package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Result of a successful seat hold; the client should count down {@code expiresInSeconds}. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HoldSeatResponse {

    private Long bookingId;
    private String bookingReference;
    /** Always {@code SEAT_HELD} on success. */
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime holdExpiresAt;
    private long expiresInSeconds;
}
