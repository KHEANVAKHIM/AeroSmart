package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/** One day of confirmed revenue, for the admin dashboard chart. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenuePointDto {

    private LocalDate date;
    /** Confirmed revenue for that day, in VND. */
    private BigDecimal revenue;
}
