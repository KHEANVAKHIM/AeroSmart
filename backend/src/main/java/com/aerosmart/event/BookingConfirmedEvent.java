package com.aerosmart.event;

import com.aerosmart.domain.Booking;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * Spring Application Event fired when a booking moves from SEAT_HELD to CONFIRMED.
 * Handled asynchronously by observers for ticket issuance and email dispatch.
 */
@Getter
public class BookingConfirmedEvent extends ApplicationEvent {

    private final Booking booking;

    public BookingConfirmedEvent(Object source, Booking booking) {
        super(source);
        this.booking = booking;
    }
}
