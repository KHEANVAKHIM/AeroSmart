package com.aerosmart.service.booking;

import com.aerosmart.domain.Booking;
import com.aerosmart.domain.BookingStatus;
import com.aerosmart.domain.Passenger;
import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import com.aerosmart.repository.BookingRepository;
import com.aerosmart.repository.SeatRepository;
import com.aerosmart.service.booking.state.BookingStateManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatHoldEvictionService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final BookingStateManager stateManager;
    private final DistributedSeatLockService seatLockService;

    /**
     * Sweeps every 60 seconds for bookings whose 15-minute hold window has expired.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void evictExpiredSeatHolds() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository.findByStatusAndHoldExpiresAtBefore(BookingStatus.SEAT_HELD, now);

        if (expiredBookings.isEmpty()) {
            return;
        }

        log.info("Found {} expired seat hold(s) to evict at {}", expiredBookings.size(), now);

        for (Booking booking : expiredBookings) {
            try {
                // Execute cancel state transition
                stateManager.cancel(booking);

                // Release the seats back to AVAILABLE
                for (Passenger passenger : booking.getPassengers()) {
                    Seat seat = passenger.getSeat();
                    if (seat != null) {
                        seat.setStatus(SeatStatus.AVAILABLE);
                        seatRepository.save(seat);

                        if (booking.getFlight() != null) {
                            seatLockService.releaseHold(booking.getFlight().getId(), seat.getSeatNumber());
                        }
                    }
                }
                bookingRepository.save(booking);
                log.info("Evicted expired booking {} and released seats", booking.getBookingReference());
            } catch (Exception e) {
                log.error("Failed to evict expired booking {}: {}", booking.getBookingReference(), e.getMessage());
            }
        }
    }
}
