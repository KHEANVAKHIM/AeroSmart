package com.aerosmart.service.booking.state;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class CancelledState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.CANCELLED;
    }

    @Override
    public void holdSeat(Booking booking) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot hold seats for a CANCELLED booking.");
    }

    @Override
    public void confirm(Booking booking, String paymentMethod, String transactionId) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot confirm a CANCELLED booking.");
    }

    @Override
    public void cancel(Booking booking) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Booking is already CANCELLED.");
    }
}
