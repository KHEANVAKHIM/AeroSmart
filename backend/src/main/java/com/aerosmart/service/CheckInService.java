package com.aerosmart.service;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.domain.Flight;
import com.aerosmart.domain.Passenger;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.dto.BookingDto;
import com.aerosmart.dto.checkin.CheckInLookupRequest;
import com.aerosmart.dto.checkin.CheckInResponse;
import com.aerosmart.dto.checkin.CheckInSubmitRequest;
import com.aerosmart.exception.ApiException;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.BookingRepository;
import com.aerosmart.repository.PassengerRepository;
import com.aerosmart.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckInService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final SeatRepository seatRepository;
    private final BookingService bookingService;

    @Transactional(readOnly = true)
    public BookingDto lookupBooking(CheckInLookupRequest request) {
        if (request == null || request.getBookingReference() == null || request.getBookingReference().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Mã đặt chỗ (PNR) không được để trống.");
        }

        String pnr = request.getBookingReference().trim().toUpperCase(Locale.ROOT);
        String nameQuery = normalize(request.getPassengerName());

        log.info("Check-in lookup initiated for PNR={}, nameQuery='{}'", pnr, nameQuery);

        Booking booking = bookingRepository.findByBookingReference(pnr)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy mã đặt chỗ '" + pnr + "'. Vui lòng kiểm tra lại."));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Mã đặt chỗ này đã bị hủy. Không thể thực hiện check-in trực tuyến.");
        }

        // If no name query was provided, permit lookup by PNR directly
        if (nameQuery.isBlank()) {
            return bookingService.getByReference(pnr);
        }

        boolean matched = false;

        if (booking.getPassengers() != null) {
            matched = booking.getPassengers().stream().anyMatch(p -> {
                String pName = normalize(p.getFullName());
                String pPassport = normalize(p.getPassportNumber());
                return (!pName.isBlank() && (pName.contains(nameQuery) || nameQuery.contains(pName)))
                        || (!pPassport.isBlank() && (pPassport.contains(nameQuery) || nameQuery.contains(pPassport)));
            });
        }

        if (!matched && booking.getUser() != null) {
            String uName = normalize(booking.getUser().getFullName());
            String uEmail = normalize(booking.getUser().getEmail());
            matched = (!uName.isBlank() && (uName.contains(nameQuery) || nameQuery.contains(uName)))
                    || (!uEmail.isBlank() && (uEmail.contains(nameQuery) || nameQuery.contains(uEmail)));
        }

        if (!matched) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Họ tên hoặc thông tin hành khách không khớp với vé của mã đặt chỗ " + pnr);
        }

        return bookingService.getByReference(pnr);
    }

    private String normalize(String text) {
        if (text == null) return "";
        String nfd = java.text.Normalizer.normalize(text.trim(), java.text.Normalizer.Form.NFD);
        return nfd.replaceAll("\\p{InCombiningDiacriticalMarks}+", "").toLowerCase(Locale.ROOT);
    }

    @Transactional
    public CheckInResponse completeCheckIn(CheckInSubmitRequest request) {
        if (request.getDangerousGoodsAccepted() == null || !request.getDangerousGoodsAccepted()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Hành khách phải xác nhận quy định an toàn hàng không & hành lý nguy hiểm.");
        }

        String pnr = request.getBookingReference().trim().toUpperCase(Locale.ROOT);
        Booking booking = bookingRepository.findByBookingReference(pnr)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingReference", pnr));

        Passenger passenger = booking.getPassengers().stream()
                .filter(p -> p.getId().equals(request.getPassengerId()))
                .findFirst()
                .orElse(booking.getPassengers().isEmpty() ? null : booking.getPassengers().get(0));

        if (passenger == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin hành khách trên chuyến bay.");
        }

        // Change seat if specified
        if (request.getNewSeatNumber() != null && !request.getNewSeatNumber().isBlank()) {
            String newSeatNum = request.getNewSeatNumber().trim().toUpperCase(Locale.ROOT);
            Seat currentSeat = passenger.getSeat();

            if (currentSeat == null || !currentSeat.getSeatNumber().equalsIgnoreCase(newSeatNum)) {
                Seat targetSeat = seatRepository.findByFlightIdAndSeatNumber(booking.getFlight().getId(), newSeatNum)
                        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy ghế " + newSeatNum));

                if (targetSeat.getStatus() != SeatStatus.AVAILABLE && targetSeat.getStatus() != SeatStatus.HELD) {
                    throw new ApiException(HttpStatus.CONFLICT, "Ghế " + newSeatNum + " đã có người chọn.");
                }

                // Free old seat
                if (currentSeat != null) {
                    currentSeat.setStatus(SeatStatus.AVAILABLE);
                    seatRepository.save(currentSeat);
                }

                // Lock new seat
                targetSeat.setStatus(SeatStatus.BOOKED);
                seatRepository.save(targetSeat);
                passenger.setSeat(targetSeat);
                passengerRepository.save(passenger);
            }
        }

        Flight flight = booking.getFlight();
        LocalDateTime departureTime = flight.getDepartureTime();
        LocalDateTime boardingTime = departureTime != null ? departureTime.minusMinutes(40) : LocalDateTime.now().plusHours(2);

        log.info("Online check-in successfully completed for passenger: {}, flight: {}, seat: {}",
                passenger.getFullName(), flight.getFlightNumber(),
                passenger.getSeat() != null ? passenger.getSeat().getSeatNumber() : "ASSIGNED");

        BookingDto updatedBooking = bookingService.getByReference(pnr);

        return CheckInResponse.builder()
                .success(true)
                .message("Check-in trực tuyến thành công! Thẻ lên máy bay đã được kích hoạt.")
                .bookingReference(pnr)
                .passengerFullName(passenger.getFullName())
                .seatNumber(passenger.getSeat() != null ? passenger.getSeat().getSeatNumber() : "12A")
                .seatClass(passenger.getSeat() != null ? passenger.getSeat().getSeatClass().name() : "ECONOMY")
                .flightNumber(flight.getFlightNumber())
                .departureAirport(flight.getDepartureAirport().getCode())
                .arrivalAirport(flight.getArrivalAirport().getCode())
                .departureTime(flight.getDepartureTime())
                .boardingGate("GATE 04")
                .boardingTime(boardingTime)
                .booking(updatedBooking)
                .build();
    }
}
