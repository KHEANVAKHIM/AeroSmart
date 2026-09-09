package com.aerosmart.service.booking.state;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingStateManager {

    private final Map<BookingStatus, BookingState> stateMap = new EnumMap<>(BookingStatus.class);

    public BookingStateManager(List<BookingState> states) {
        for (BookingState state : states) {
            stateMap.put(state.getStatus(), state);
        }
    }

    public BookingState getState(BookingStatus status) {
        BookingState state = stateMap.get(status);
        if (state == null) {
            throw new IllegalStateException("No BookingState registered for status: " + status);
        }
        return state;
    }

    public void holdSeat(Booking booking) {
        getState(booking.getStatus()).holdSeat(booking);
    }

    public void confirm(Booking booking, String paymentMethod, String transactionId) {
        getState(booking.getStatus()).confirm(booking, paymentMethod, transactionId);
    }

    public void cancel(Booking booking) {
        getState(booking.getStatus()).cancel(booking);
    }
}
