package com.aerosmart.service.booking.state;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PendingState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.PENDING;
    }

    @Override
    public void holdSeat(Booking booking) {
        booking.setStatus(BookingStatus.SEAT_HELD);
        booking.setHoldExpiresAt(LocalDateTime.now().plusMinutes(15));
    }

    @Override
    public void confirm(Booking booking, String paymentMethod, String transactionId) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot confirm a booking directly from PENDING state. Seats must be held first.");
    }

    @Override
    public void cancel(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setHoldExpiresAt(null);
    }
}
