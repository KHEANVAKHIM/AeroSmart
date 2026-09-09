package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Builder Pattern representation of multi-attribute flight search filters.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchCriteria {

    private String origin;
    private String destination;
    private LocalDate departureDate;
    private LocalDate returnDate;
    @Builder.Default
    private int passengers = 1;
    @Builder.Default
    private String tripType = "ONE_WAY";
    private String airline;
    private String seatClass;
    private BigDecimal maxPrice;
    private Integer maxStops;
    private String departureBucket; // MORNING, AFTERNOON, EVENING, NIGHT
    private String sortBy; // PRICE_ASC, PRICE_DESC, DURATION_ASC, DEPARTURE_ASC, DEPARTURE_DESC
}
