package com.aerosmart.service.booking.state;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;

/**
 * State Pattern interface governing transitions for {@link Booking}.
 * Illegal state skips are rejected with {@link com.aerosmart.exception.ApiException}.
 */
public interface BookingState {

    BookingStatus getStatus();

    /**
     * Attempts to transition the booking into {@link BookingStatus#SEAT_HELD}.
     */
    void holdSeat(Booking booking);

    /**
     * Confirms the booking upon successful payment verification.
     */
    void confirm(Booking booking, String paymentMethod, String transactionId);

    /**
     * Cancels the booking and releases hold or marks confirmed booking as cancelled.
     */
    void cancel(Booking booking);
}
