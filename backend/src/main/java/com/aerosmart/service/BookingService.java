package com.aerosmart.service;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.Flight;
import com.aerosmart.domain.Passenger;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.domain.User;
import com.aerosmart.dto.BookingDto;
import com.aerosmart.dto.ConfirmBookingRequest;
import com.aerosmart.dto.HoldSeatRequest;
import com.aerosmart.dto.HoldSeatResponse;
import com.aerosmart.dto.PassengerDto;
import com.aerosmart.dto.PassengerRequest;
import com.aerosmart.event.BookingConfirmedEvent;
import com.aerosmart.exception.ApiException;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.BookingRepository;
import com.aerosmart.repository.FlightRepository;
import com.aerosmart.repository.SeatRepository;
import com.aerosmart.repository.UserRepository;
import com.aerosmart.security.UserPrincipal;
import com.aerosmart.service.booking.DistributedSeatLockService;
import com.aerosmart.service.booking.state.BookingStateManager;
import com.aerosmart.service.payment.PaymentResult;
import com.aerosmart.service.payment.PaymentStrategy;
import com.aerosmart.service.payment.PaymentStrategyFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final FlightService flightService;
    private final BookingStateManager stateManager;
    private final PaymentStrategyFactory paymentStrategyFactory;
    private final DistributedSeatLockService seatLockService;
    private final ApplicationEventPublisher eventPublisher;

    private static final String REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public HoldSeatResponse holdSeats(HoldSeatRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", request.getFlightId()));

        List<String> seatNumbers = request.getSeatNumbers().stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .distinct()
                .collect(Collectors.toList());

        if (seatNumbers.size() != request.getPassengers().size()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Number of selected seats (" + seatNumbers.size() + ") must match number of passengers (" + request.getPassengers().size() + ").");
        }

        // 1. Acquire distributed locks first to prevent race conditions
        List<String> lockedSeats = new ArrayList<>();
        try {
            for (String seatNumber : seatNumbers) {
                seatLockService.acquireHold(flight.getId(), seatNumber);
                lockedSeats.add(seatNumber);
            }
        } catch (ApiException ex) {
            // Roll back acquired locks if any single seat lock failed
            for (String locked : lockedSeats) {
                seatLockService.releaseHold(flight.getId(), locked);
            }
            throw ex;
        }

        // 2. Validate availability in database
        List<Seat> seats = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (String seatNumber : seatNumbers) {
            Seat seat = seatRepository.findByFlightIdAndSeatNumber(flight.getId(), seatNumber)
                    .orElseThrow(() -> {
                        releaseLocks(flight.getId(), lockedSeats);
                        return new ApiException(HttpStatus.NOT_FOUND, "Seat " + seatNumber + " does not exist on this flight.");
                    });

            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                releaseLocks(flight.getId(), lockedSeats);
                throw new ApiException(HttpStatus.CONFLICT, "Seat " + seatNumber + " is already " + seat.getStatus() + ".");
            }

            BigDecimal multiplier = seat.getPriceMultiplier() != null ? seat.getPriceMultiplier() : BigDecimal.ONE;
            BigDecimal seatPrice = flight.getBasePrice().multiply(multiplier).setScale(0, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(seatPrice);
            seats.add(seat);
        }

        // 3. Create booking and transition via State Pattern
        String bookingReference = generateReference();
        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .user(user)
                .flight(flight)
                .totalAmount(totalAmount)
                .status(com.aerosmart.domain.BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .passengers(new ArrayList<>())
                .build();

        // State Pattern: PENDING -> SEAT_HELD with 15-minute expiry
        stateManager.holdSeat(booking);

        // Update seats to HELD
        for (Seat s : seats) {
            s.setStatus(SeatStatus.HELD);
        }
        seatRepository.saveAll(seats);

        // Assign passengers to corresponding seats
        for (int i = 0; i < request.getPassengers().size(); i++) {
            PassengerRequest pReq = request.getPassengers().get(i);
            Seat assignedSeat = seats.stream()
                    .filter(s -> s.getSeatNumber().equalsIgnoreCase(pReq.getSeatNumber().trim()))
                    .findFirst()
                    .orElse(seats.get(i));

            Passenger passenger = Passenger.builder()
                    .booking(booking)
                    .fullName(pReq.getFullName().trim())
                    .passportNumber(pReq.getPassportNumber().trim().toUpperCase())
                    .seat(assignedSeat)
                    .build();
            booking.getPassengers().add(passenger);
        }

        Booking saved = bookingRepository.save(booking);
        long expiresInSeconds = Duration.between(LocalDateTime.now(), saved.getHoldExpiresAt()).toSeconds();

        log.info("Seats held successfully for booking ref={}, total={}, expiresIn={}s",
                saved.getBookingReference(), saved.getTotalAmount(), expiresInSeconds);

        return HoldSeatResponse.builder()
                .bookingId(saved.getId())
                .bookingReference(saved.getBookingReference())
                .status(saved.getStatus().name())
                .totalAmount(saved.getTotalAmount())
                .holdExpiresAt(saved.getHoldExpiresAt())
                .expiresInSeconds(Math.max(0, expiresInSeconds))
                .build();
    }

    @Transactional
    public BookingDto confirmBooking(ConfirmBookingRequest request, UserPrincipal currentUser) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        validateBookingAccess(booking, currentUser);

        // Strategy Pattern: Process payment
        PaymentStrategy strategy = paymentStrategyFactory.getStrategy(request.getPaymentMethod());
        PaymentResult paymentResult = strategy.processPayment(booking, booking.getTotalAmount());

        if (!paymentResult.isSuccessful()) {
            throw new ApiException(HttpStatus.PAYMENT_REQUIRED, "Payment failed: " + paymentResult.getMessage());
        }

        // State Pattern: Transition SEAT_HELD -> CONFIRMED
        stateManager.confirm(booking, paymentResult.getPaymentMethod(), paymentResult.getTransactionId());

        // Mark seats as permanently BOOKED and release Redis hold lock
        for (Passenger p : booking.getPassengers()) {
            Seat seat = p.getSeat();
            if (seat != null) {
                seat.setStatus(SeatStatus.BOOKED);
                seatRepository.save(seat);
                seatLockService.releaseHold(booking.getFlight().getId(), seat.getSeatNumber());
            }
        }

        Booking saved = bookingRepository.save(booking);

        // Observer Pattern: publish BookingConfirmedEvent
        eventPublisher.publishEvent(new BookingConfirmedEvent(this, saved));

        log.info("Booking confirmed successfully: ref={}, txId={}", saved.getBookingReference(), saved.getTransactionId());
        return toBookingDto(saved);
    }

    @Transactional
    public BookingDto cancelBooking(Long bookingId, UserPrincipal currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        validateBookingAccess(booking, currentUser);

        // State Pattern: transition to CANCELLED
        stateManager.cancel(booking);

        // Free seats back to AVAILABLE
        for (Passenger p : booking.getPassengers()) {
            Seat seat = p.getSeat();
            if (seat != null) {
                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);
                seatLockService.releaseHold(booking.getFlight().getId(), seat.getSeatNumber());
            }
        }

        Booking saved = bookingRepository.save(booking);
        log.info("Booking {} cancelled by user {}", saved.getBookingReference(), currentUser.getEmail());
        return toBookingDto(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getMyBookings(UserPrincipal currentUser) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(this::toBookingDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto getByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "reference", reference));
        return toBookingDto(booking);
    }

    private void validateBookingAccess(Booking booking, UserPrincipal user) {
        boolean isAdmin = user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not authorized to manage this booking.");
        }
    }

    private void releaseLocks(Long flightId, List<String> seatNumbers) {
        for (String seatNumber : seatNumbers) {
            seatLockService.releaseHold(flightId, seatNumber);
        }
    }

    private String generateReference() {
        StringBuilder sb = new StringBuilder("AS");
        for (int i = 0; i < 6; i++) {
            sb.append(REF_CHARS.charAt(random.nextInt(REF_CHARS.length())));
        }
        return sb.toString();
    }

    public BookingDto toBookingDto(Booking booking) {
        List<PassengerDto> passengerDtos = booking.getPassengers().stream()
                .map(p -> PassengerDto.builder()
                        .id(p.getId())
                        .fullName(p.getFullName())
                        .passportNumber(p.getPassportNumber())
                        .seatNumber(p.getSeat() != null ? p.getSeat().getSeatNumber() : null)
                        .seatClass(p.getSeat() != null ? p.getSeat().getSeatClass().name() : null)
                        .build())
                .collect(Collectors.toList());

        return BookingDto.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .status(booking.getStatus().name())
                .totalAmount(booking.getTotalAmount())
                .createdAt(booking.getCreatedAt())
                .holdExpiresAt(booking.getHoldExpiresAt())
                .paymentMethod(booking.getPaymentMethod())
                .transactionId(booking.getTransactionId())
                .flight(flightService.toFlightDto(booking.getFlight()))
                .passengers(passengerDtos)
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : null)
                .userFullName(booking.getUser() != null ? booking.getUser().getFullName() : null)
                .build();
    }
}
