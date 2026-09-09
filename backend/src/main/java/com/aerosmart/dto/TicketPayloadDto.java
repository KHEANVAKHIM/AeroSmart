package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * E-Ticket and Boarding Pass presentation payload constructed using Builder pattern.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketPayloadDto {

    private String ticketNumber;
    private String bookingReference;
    private String passengerName;
    private String passportNumber;
    private String seatNumber;
    private String seatClass;
    private String flightNumber;
    private String airline;
    private String originAirportCode;
    private String originCity;
    private String destinationAirportCode;
    private String destinationCity;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String boardingGate;
    private LocalDateTime boardingTime;
    private String qrCodeData;
    private String barcodeString;
    private String status;
    private BigDecimal pricePaid;
}
