package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** A single seat on the seat map, with its resolved price in VND. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatDto {

    private Long id;
    private String seatNumber;
    /** {@code ECONOMY} or {@code BUSINESS}. */
    private String seatClass;
    /** {@code AVAILABLE}, {@code HELD} or {@code BOOKED}. */
    private String status;
    /** basePrice * priceMultiplier, in VND. */
    private BigDecimal price;
}
