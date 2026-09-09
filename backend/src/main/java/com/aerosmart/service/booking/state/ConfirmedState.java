package com.aerosmart.service.booking.state;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class ConfirmedState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.CONFIRMED;
    }

    @Override
    public void holdSeat(Booking booking) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Booking is already CONFIRMED; seats cannot be re-held.");
    }

    @Override
    public void confirm(Booking booking, String paymentMethod, String transactionId) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Booking has already been confirmed with reference: " + booking.getBookingReference());
    }

    @Override
    public void cancel(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setHoldExpiresAt(null);
    }
}
