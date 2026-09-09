package com.aerosmart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Request to pay for and confirm a held booking. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmBookingRequest {

    @NotNull(message = "bookingId is required")
    private Long bookingId;

    /** {@code VNPAY} or {@code MOMO}. */
    @NotBlank(message = "paymentMethod is required")
    private String paymentMethod;
}
