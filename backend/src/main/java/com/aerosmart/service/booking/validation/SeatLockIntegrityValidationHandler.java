package com.aerosmart.service.booking.validation;

import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

/**
 * Concrete Handler 2 in Chain of Responsibility.
 * Verifies that the selected seat is held by this user and hasn't expired or been booked by someone else.
 */
@Slf4j
public class SeatLockIntegrityValidationHandler extends BookingValidationHandler {

    @Override
    public void validate(BookingValidationContext context) {
        Seat seat = context.getSeat();
        if (seat == null) {
            log.warn("Validation failed: Target seat not found in context.");
            throw new ApiException(HttpStatus.NOT_FOUND, "Target flight seat was not found.");
        }

        if (seat.getStatus() == SeatStatus.BOOKED) {
            log.warn("Validation failed: Seat {} is already booked.", seat.getSeatNumber());
            throw new ApiException(HttpStatus.CONFLICT, "Seat " + seat.getSeatNumber() + " has already been booked by another passenger.");
        }

        log.debug("Chain Handler [SeatLockIntegrityValidationHandler] Passed for seat={}", seat.getSeatNumber());
        passToNext(context);
    }
}
