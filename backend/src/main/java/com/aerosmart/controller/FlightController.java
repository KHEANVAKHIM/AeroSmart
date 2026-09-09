package com.aerosmart.controller;

import com.aerosmart.dto.AirportDto;
import com.aerosmart.dto.FlightDto;
import com.aerosmart.dto.FlightSearchCriteria;
import com.aerosmart.dto.FlightSeatMapDto;
import com.aerosmart.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping({"/flights", "/flights/search"})
    public ResponseEntity<List<FlightDto>> searchFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate,
            @RequestParam(defaultValue = "1") int passengers,
            @RequestParam(defaultValue = "ONE_WAY") String tripType,
            @RequestParam(required = false) String airline,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer maxStops,
            @RequestParam(required = false) String departureBucket,
            @RequestParam(required = false) String sortBy) {

        FlightSearchCriteria criteria = FlightSearchCriteria.builder()
                .origin(origin)
                .destination(destination)
                .departureDate(departureDate)
                .returnDate(returnDate)
                .passengers(passengers)
                .tripType(tripType)
                .airline(airline)
                .maxPrice(maxPrice)
                .maxStops(maxStops)
                .departureBucket(departureBucket)
                .sortBy(sortBy)
                .build();

        List<FlightDto> flights = flightService.searchFlights(criteria);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/flights/{id}")
    public ResponseEntity<FlightDto> getFlightById(@PathVariable Long id) {
        FlightDto flight = flightService.getFlightById(id);
        return ResponseEntity.ok(flight);
    }

    @GetMapping("/flights/{id}/seats")
    public ResponseEntity<FlightSeatMapDto> getFlightSeats(@PathVariable Long id) {
        FlightSeatMapDto seatMap = flightService.getFlightSeats(id);
        return ResponseEntity.ok(seatMap);
    }

    @GetMapping("/airports")
    public ResponseEntity<List<AirportDto>> listAirports() {
        List<AirportDto> airports = flightService.listAirports();
        return ResponseEntity.ok(airports);
    }
}
