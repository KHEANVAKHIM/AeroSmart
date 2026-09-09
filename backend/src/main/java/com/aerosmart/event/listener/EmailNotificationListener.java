package com.aerosmart.event.listener;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.Passenger;
import com.aerosmart.event.BookingConfirmedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Slf4j
@Component
public class EmailNotificationListener {

    @Async("aeroTaskExecutor")
    @EventListener
    public void onBookingConfirmed(BookingConfirmedEvent event) {
        Booking booking = event.getBooking();
        String recipient = booking.getUser() != null ? booking.getUser().getEmail() : "customer@example.com";
        String flightNo = booking.getFlight() != null ? booking.getFlight().getFlightNumber() : "N/A";
        String passengers = booking.getPassengers().stream()
                .map(Passenger::getFullName)
                .collect(Collectors.joining(", "));

        log.info("""
                [MOCK EMAIL DISPATCH]
                To: {}
                Subject: AeroSmart Confirmation - Booking Reference #{}
                Flight: {}
                Passengers: {}
                Total Paid: {} VND
                Transaction: {} via {}
                Thank you for choosing AeroSmart. Smart Booking, Seamless Journey!
                """,
                recipient,
                booking.getBookingReference(),
                flightNo,
                passengers,
                booking.getTotalAmount(),
                booking.getTransactionId(),
                booking.getPaymentMethod());
    }
}
