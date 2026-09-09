package com.aerosmart.service.booking.state;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SeatHeldState implements BookingState {

    @Override
    public BookingStatus getStatus() {
        return BookingStatus.SEAT_HELD;
    }

    @Override
    public void holdSeat(Booking booking) {
        if (booking.getHoldExpiresAt() != null && booking.getHoldExpiresAt().isAfter(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Seats are already held for this booking until " + booking.getHoldExpiresAt());
        }
        booking.setHoldExpiresAt(LocalDateTime.now().plusMinutes(15));
    }

    @Override
    public void confirm(Booking booking, String paymentMethod, String transactionId) {
        if (booking.getHoldExpiresAt() != null && booking.getHoldExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.GONE, "Seat hold duration has expired. Please reselect your seats.");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentMethod(paymentMethod);
        booking.setTransactionId(transactionId);
        booking.setHoldExpiresAt(null);
    }

    @Override
    public void cancel(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setHoldExpiresAt(null);
    }
}
