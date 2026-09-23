package com.aerosmart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request to pay for and confirm a held booking, including Decorator Ancillary Add-ons.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmBookingRequest {

    @NotNull(message = "bookingId is required")
    private Long bookingId;

    /** {@code VNPAY}, {@code MOMO}, {@code CREDIT_CARD}, or {@code BANK_TRANSFER}. */
    @NotBlank(message = "paymentMethod is required")
    private String paymentMethod;

    private List<PassengerDto> passengers;

    // Ancillary Add-on options (Decorator Pattern)
    private Integer extraBaggageKg;
    private String mealCode;
    private Boolean hasInsurance;
    private String insurancePlan;
    private Boolean hasLounge;
}
