package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Full booking projection used by "my bookings", lookup by reference and admin listings. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {

    private Long id;
    private String bookingReference;
    /** {@code PENDING}, {@code SEAT_HELD}, {@code CONFIRMED} or {@code CANCELLED}. */
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime holdExpiresAt;
    private String paymentMethod;
    private String transactionId;
    private FlightDto flight;
    private List<PassengerDto> passengers;
    private String userEmail;
    private String userFullName;
}
