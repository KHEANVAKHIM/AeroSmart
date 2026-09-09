package com.aerosmart.event.listener;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.Passenger;
import com.aerosmart.event.BookingConfirmedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
public class TicketIssuanceListener {

    @Async("aeroTaskExecutor")
    @EventListener
    public void onBookingConfirmed(BookingConfirmedEvent event) {
        Booking booking = event.getBooking();
        log.info("Issuing electronic tickets for confirmed booking {}", booking.getBookingReference());

        for (Passenger passenger : booking.getPassengers()) {
            String eTicketNumber = "738-" + String.valueOf(Math.abs(UUID.randomUUID().getMostSignificantBits())).substring(0, 10);
            String seatNo = passenger.getSeat() != null ? passenger.getSeat().getSeatNumber() : "UNASSIGNED";
            log.info("Generated E-Ticket {} for passenger {} (Passport: {}, Seat: {})",
                    eTicketNumber, passenger.getFullName(), passenger.getPassportNumber(), seatNo);
        }
    }
}
