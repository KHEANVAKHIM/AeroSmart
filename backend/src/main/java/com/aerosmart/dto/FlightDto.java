package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Flight projection used by search results, flight details and AI flight cards.
 * Kept free of JPA proxies so it can be cached in Redis as JSON.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightDto {

    private Long id;
    private String flightNumber;
    private String airline;
    /** {@code SCHEDULED}, {@code DELAYED}, {@code COMPLETED} or {@code CANCELLED}. */
    private String status;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private long durationMinutes;
    /** ECONOMY fare in VND. */
    private BigDecimal basePrice;
    private long availableSeats;
    private int stops;
    private AirportDto departureAirport;
    private AirportDto arrivalAirport;
}
