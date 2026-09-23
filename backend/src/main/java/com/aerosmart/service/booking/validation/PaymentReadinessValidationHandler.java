package com.aerosmart.service.booking.validation;

import com.aerosmart.dto.ConfirmBookingRequest;
import com.aerosmart.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import java.util.Set;

/**
 * Concrete Handler 4 in Chain of Responsibility.
 * Verifies payment method selection and readiness before settlement.
 */
@Slf4j
public class PaymentReadinessValidationHandler extends BookingValidationHandler {

    private static final Set<String> SUPPORTED_PAYMENTS = Set.of(
            "VNPAY", "MOMO", "VIETQR", "CREDIT_CARD", "BANK_TRANSFER", "STRIPE"
    );

    @Override
    public void validate(BookingValidationContext context) {
        ConfirmBookingRequest req = context.getRequest();
        String method = req.getPaymentMethod();

        if (method == null || method.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Payment gateway selection is required.");
        }

        String normalized = method.trim().toUpperCase();
        if (!SUPPORTED_PAYMENTS.contains(normalized)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unsupported payment method: " + method);
        }

        log.debug("Chain Handler [PaymentReadinessValidationHandler] Passed for payment method={}", normalized);
        passToNext(context);
    }
}
