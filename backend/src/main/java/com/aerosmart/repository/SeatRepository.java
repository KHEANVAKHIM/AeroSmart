package com.aerosmart.repository;

import com.aerosmart.domain.Seat;
import com.aerosmart.domain.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlightIdOrderBySeatNumberAsc(Long flightId);

    Optional<Seat> findByFlightIdAndSeatNumber(Long flightId, String seatNumber);

    long countByStatus(SeatStatus status);

    long countByFlightIdAndStatus(Long flightId, SeatStatus status);
}
