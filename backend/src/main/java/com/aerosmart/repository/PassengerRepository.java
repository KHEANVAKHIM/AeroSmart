package com.aerosmart.repository;

import com.aerosmart.domain.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    List<Passenger> findByBookingId(Long bookingId);

    long countByBookingId(Long bookingId);

    List<Passenger> findByBookingFlightId(Long flightId);
}
