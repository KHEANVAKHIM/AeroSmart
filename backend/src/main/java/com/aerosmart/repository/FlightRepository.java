package com.aerosmart.repository;

import com.aerosmart.domain.Flight;
import com.aerosmart.domain.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    boolean existsByFlightNumber(String flightNumber);

    long countByStatus(FlightStatus status);

    /**
     * Searches flights on a given day between two airports identified by their IATA codes.
     * The caller supplies the inclusive start and exclusive-ish end of the travel day.
     */
    @Query("""
            SELECT f FROM Flight f
            JOIN f.departureAirport dep
            JOIN f.arrivalAirport arr
            WHERE dep.code = :originCode
              AND arr.code = :destCode
              AND f.departureTime BETWEEN :dayStart AND :dayEnd
            ORDER BY f.departureTime ASC
            """)
    List<Flight> search(@Param("originCode") String originCode,
                        @Param("destCode") String destCode,
                        @Param("dayStart") LocalDateTime dayStart,
                        @Param("dayEnd") LocalDateTime dayEnd);

    @Query("""
            SELECT f FROM Flight f
            JOIN f.departureAirport dep
            JOIN f.arrivalAirport arr
            WHERE dep.code = :originCode
              AND arr.code = :destCode
            ORDER BY f.departureTime ASC
            """)
    List<Flight> findByRoute(@Param("originCode") String originCode,
                             @Param("destCode") String destCode);

    List<Flight> findByDepartureTimeBetweenOrderByDepartureTimeAsc(LocalDateTime from, LocalDateTime to);
}
