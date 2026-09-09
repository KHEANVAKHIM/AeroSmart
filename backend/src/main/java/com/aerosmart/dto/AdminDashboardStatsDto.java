package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDto {

    private BigDecimal totalRevenue;
    private long activeFlights;
    private long bookedSeats;
    private long availableSeats;
    private double conversionRate;
    private long totalBookings;

    @Builder.Default
    private List<RevenuePointDto> revenueTrend = new ArrayList<>();
}
