package com.aerosmart.service.booking.validation;

import com.aerosmart.domain.Flight;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.User;
import com.aerosmart.dto.ConfirmBookingRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Context object passed through the Chain of Responsibility handlers during booking validation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingValidationContext {

    private User user;
    private Flight flight;
    private Seat seat;
    private ConfirmBookingRequest request;
    private String seatHoldKey;
    private boolean isHoldValid;
    private BigDecimal calculatedAmount;
}
