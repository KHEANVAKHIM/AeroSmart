package com.aerosmart.dto.checkin;

import com.aerosmart.dto.BookingDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInResponse {

    private boolean success;
    private String message;
    private String bookingReference;
    private String passengerFullName;
    private String seatNumber;
    private String seatClass;
    private String flightNumber;
    private String departureAirport;
    private String arrivalAirport;
    private LocalDateTime departureTime;
    private String boardingGate;
    private LocalDateTime boardingTime;
    private BookingDto booking;
}
