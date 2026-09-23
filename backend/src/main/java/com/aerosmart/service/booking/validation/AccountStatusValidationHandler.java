package com.aerosmart.service.booking.validation;

import com.aerosmart.domain.User;
import com.aerosmart.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

/**
 * Concrete Handler 1 in Chain of Responsibility.
 * Verifies that the passenger's account exists, is active, and is not suspended/locked.
 */
@Slf4j
public class AccountStatusValidationHandler extends BookingValidationHandler {

    @Override
    public void validate(BookingValidationContext context) {
        User user = context.getUser();
        if (user == null) {
            log.warn("Validation failed: User account is missing from booking context.");
            throw new ApiException(HttpStatus.UNAUTHORIZED, "User authentication required to complete booking.");
        }

        if (user.getActive() != null && !user.getActive()) {
            log.warn("Validation failed: User account id={} is locked or suspended.", user.getId());
            throw new ApiException(HttpStatus.FORBIDDEN, "Your account has been locked. Please contact AeroSmart support.");
        }

        log.debug("Chain Handler [AccountStatusValidationHandler] Passed for user={}", user.getEmail());
        passToNext(context);
    }
}
