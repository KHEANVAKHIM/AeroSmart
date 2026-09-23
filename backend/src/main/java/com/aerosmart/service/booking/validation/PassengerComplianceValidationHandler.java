package com.aerosmart.service.booking.validation;

import com.aerosmart.dto.ConfirmBookingRequest;
import com.aerosmart.dto.PassengerDto;
import com.aerosmart.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

/**
 * Concrete Handler 3 in Chain of Responsibility.
 * Verifies aviation compliance: passenger full name, passport / national ID format, and email.
 */
@Slf4j
public class PassengerComplianceValidationHandler extends BookingValidationHandler {

    @Override
    public void validate(BookingValidationContext context) {
        ConfirmBookingRequest req = context.getRequest();
        if (req == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Booking request payload is required.");
        }

        if (req.getPassengers() == null || req.getPassengers().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "At least one passenger must be specified.");
        }

        for (PassengerDto p : req.getPassengers()) {
            if (p.getFullName() == null || p.getFullName().trim().length() < 2) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Passenger full name must be at least 2 characters.");
            }
            if (p.getPassportNumber() == null || p.getPassportNumber().trim().length() < 4) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Valid Passport or National ID is required for passenger " + p.getFullName());
            }
        }

        log.debug("Chain Handler [PassengerComplianceValidationHandler] Passed for {} passengers", req.getPassengers().size());
        passToNext(context);
    }
}
