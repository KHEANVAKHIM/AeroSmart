package com.aerosmart.service;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.domain.Flight;
import com.aerosmart.domain.FlightStatus;
import com.aerosmart.domain.Passenger;
import com.aerosmart.domain.Role;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.domain.User;
import com.aerosmart.dto.AdminDashboardStatsDto;
import com.aerosmart.dto.BookingDto;
import com.aerosmart.dto.PassengerDto;
import com.aerosmart.dto.PassengerManifestDto;
import com.aerosmart.dto.RevenuePointDto;
import com.aerosmart.dto.auth.AdminCreateUserRequest;
import com.aerosmart.dto.auth.AdminUpdateUserRequest;
import com.aerosmart.dto.auth.UserDto;
import com.aerosmart.exception.ApiException;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.BookingRepository;
import com.aerosmart.repository.FlightRepository;
import com.aerosmart.repository.PassengerRepository;
import com.aerosmart.repository.SeatRepository;
import com.aerosmart.repository.UserRepository;
import com.aerosmart.service.booking.DistributedSeatLockService;
import com.aerosmart.service.booking.state.BookingStateManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final PassengerRepository passengerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BookingService bookingService;
    private final BookingStateManager stateManager;
    private final DistributedSeatLockService seatLockService;

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        List<Booking> allBookings = bookingRepository.findAll();

        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeFlights = flightRepository.countByStatus(FlightStatus.SCHEDULED)
                + flightRepository.countByStatus(FlightStatus.DELAYED);

        long bookedSeats = seatRepository.countByStatus(SeatStatus.BOOKED);
        long availableSeats = seatRepository.countByStatus(SeatStatus.AVAILABLE);

        long confirmedCount = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .count();

        double conversionRate = allBookings.isEmpty() ? 0.0 :
                Math.round(((double) confirmedCount / allBookings.size()) * 1000.0) / 10.0;

        // Calculate 7-day revenue trend
        LocalDate today = LocalDate.now();
        Map<LocalDate, BigDecimal> trendMap = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            trendMap.put(today.minusDays(i), BigDecimal.ZERO);
        }

        for (Booking b : allBookings) {
            if (b.getStatus() == BookingStatus.CONFIRMED && b.getCreatedAt() != null) {
                LocalDate bDate = b.getCreatedAt().toLocalDate();
                if (trendMap.containsKey(bDate)) {
                    trendMap.put(bDate, trendMap.get(bDate).add(b.getTotalAmount()));
                }
            }
        }

        List<RevenuePointDto> trendList = trendMap.entrySet().stream()
                .map(e -> RevenuePointDto.builder()
                        .date(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .activeFlights(activeFlights)
                .bookedSeats(bookedSeats)
                .availableSeats(availableSeats)
                .conversionRate(conversionRate)
                .totalBookings(allBookings.size())
                .revenueTrend(trendList)
                .build();
    }

    @Transactional(readOnly = true)
    public List<BookingDto> listBookings(String status, String query, LocalDate bookingDate, LocalDate flightDate) {
        List<Booking> list = bookingRepository.findAllByOrderByCreatedAtDesc();

        return list.stream()
                .filter(b -> status == null || status.isBlank() || b.getStatus().name().equalsIgnoreCase(status.trim()))
                .filter(b -> {
                    if (bookingDate == null) return true;
                    return b.getCreatedAt() != null && b.getCreatedAt().toLocalDate().equals(bookingDate);
                })
                .filter(b -> {
                    if (flightDate == null) return true;
                    return b.getFlight() != null && b.getFlight().getDepartureTime() != null
                            && b.getFlight().getDepartureTime().toLocalDate().equals(flightDate);
                })
                .filter(b -> {
                    if (query == null || query.isBlank()) return true;
                    String q = query.trim().toLowerCase();
                    boolean matchRef = b.getBookingReference() != null && b.getBookingReference().toLowerCase().contains(q);
                    boolean matchFlight = b.getFlight() != null && b.getFlight().getFlightNumber().toLowerCase().contains(q);
                    boolean matchUser = b.getUser() != null && (b.getUser().getEmail().toLowerCase().contains(q)
                            || (b.getUser().getFullName() != null && b.getUser().getFullName().toLowerCase().contains(q)));
                    return matchRef || matchFlight || matchUser;
                })
                .map(bookingService::toBookingDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PassengerManifestDto getPassengerManifest(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", flightId));

        List<Passenger> passengers = passengerRepository.findByBookingFlightId(flightId);

        List<PassengerDto> passengerDtos = passengers.stream()
                .filter(p -> p.getBooking() != null && p.getBooking().getStatus() == BookingStatus.CONFIRMED)
                .map(p -> PassengerDto.builder()
                        .id(p.getId())
                        .fullName(p.getFullName())
                        .passportNumber(p.getPassportNumber())
                        .seatNumber(p.getSeat() != null ? p.getSeat().getSeatNumber() : "UNASSIGNED")
                        .seatClass(p.getSeat() != null ? p.getSeat().getSeatClass().name() : "ECONOMY")
                        .build())
                .collect(Collectors.toList());

        return PassengerManifestDto.builder()
                .flightId(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirline())
                .origin(flight.getDepartureAirport().getCode())
                .destination(flight.getArrivalAirport().getCode())
                .departureTime(flight.getDepartureTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")))
                .totalPassengers(passengerDtos.size())
                .passengers(passengerDtos)
                .build();
    }

    @Transactional
    public BookingDto cancelBookingByAdmin(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        stateManager.cancel(booking);

        for (Passenger p : booking.getPassengers()) {
            Seat seat = p.getSeat();
            if (seat != null) {
                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);
                if (booking.getFlight() != null) {
                    seatLockService.releaseHold(booking.getFlight().getId(), seat.getSeatNumber());
                }
            }
        }

        Booking saved = bookingRepository.save(booking);
        log.info("Admin force cancelled booking {}", saved.getBookingReference());
        return bookingService.toBookingDto(saved);
    }

    /* ---------------------------------------------------- User Account Management */

    @Transactional(readOnly = true)
    public List<UserDto> listUsers(String query, Role role, String provider) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(u -> {
                    if (role != null && u.getRole() != role) return false;
                    if (provider != null && !provider.isBlank()) {
                        String userProvider = u.getProvider() != null ? u.getProvider() : "LOCAL";
                        if (!userProvider.equalsIgnoreCase(provider.trim())) return false;
                    }
                    if (query != null && !query.isBlank()) {
                        String q = query.trim().toLowerCase();
                        boolean matchName = u.getFullName() != null && u.getFullName().toLowerCase().contains(q);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                        boolean matchPhone = u.getPhone() != null && u.getPhone().toLowerCase().contains(q);
                        return matchName || matchEmail || matchPhone;
                    }
                    return true;
                })
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(AdminCreateUserRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email address is already in use.");
        }

        User user = User.builder()
                .email(email)
                .fullName(req.getFullName().trim())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole() != null ? req.getRole() : Role.ROLE_USER)
                .phone(req.getPhone() != null ? req.getPhone().trim() : null)
                .passportNo(req.getPassportNo() != null ? req.getPassportNo().trim() : null)
                .avatarUrl(req.getAvatarUrl() != null ? req.getAvatarUrl().trim() : null)
                .provider(req.getProvider() != null ? req.getProvider().trim().toUpperCase() : "LOCAL")
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        log.info("Admin created new user id={}, role={}", saved.getId(), saved.getRole());
        return UserDto.from(saved);
    }

    @Transactional
    public UserDto updateUser(Long id, AdminUpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName().trim());
        }
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            String newEmail = req.getEmail().trim().toLowerCase();
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new ApiException(HttpStatus.CONFLICT, "Email is already taken by another account.");
            }
            user.setEmail(newEmail);
        }
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getRole() != null) {
            user.setRole(req.getRole());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone().trim());
        }
        if (req.getPassportNo() != null) {
            user.setPassportNo(req.getPassportNo().trim());
        }
        if (req.getAvatarUrl() != null) {
            user.setAvatarUrl(req.getAvatarUrl().trim());
        }
        if (req.getProvider() != null) {
            user.setProvider(req.getProvider().trim().toUpperCase());
        }
        if (req.getActive() != null) {
            user.setActive(req.getActive());
        }

        User updated = userRepository.save(user);
        log.info("Admin updated user id={}", updated.getId());
        return UserDto.from(updated);
    }

    @Transactional
    public UserDto changeUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setRole(role);
        User saved = userRepository.save(user);
        log.info("Admin changed role for user id={} to {}", id, role);
        return UserDto.from(saved);
    }

    @Transactional
    public UserDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        boolean currentStatus = user.getActive() == null || user.getActive();
        user.setActive(!currentStatus);
        User saved = userRepository.save(user);
        log.info("Admin toggled active status for user id={} to {}", id, saved.getActive());
        return UserDto.from(saved);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
        log.info("Admin deleted user id={}", id);
    }

    @Transactional
    public void resetUserPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        userRepository.save(user);
        log.info("Admin reset password for user id={}", id);
    }
}
