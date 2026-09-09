package com.aerosmart.controller;

import com.aerosmart.dto.AdminDashboardStatsDto;
import com.aerosmart.dto.AirportDto;
import com.aerosmart.dto.BookingDto;
import com.aerosmart.dto.CreateFlightRequest;
import com.aerosmart.dto.FlightDto;
import com.aerosmart.dto.FlightSearchCriteria;
import com.aerosmart.dto.FlightStatusUpdateRequest;
import com.aerosmart.dto.PassengerManifestDto;
import com.aerosmart.service.AdminService;
import com.aerosmart.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final FlightService flightService;

    @GetMapping({"/stats", "/dashboard/stats"})
    public ResponseEntity<AdminDashboardStatsDto> getStats() {
        AdminDashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/flights")
    public ResponseEntity<List<FlightDto>> listFlights(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(required = false) String status) {
        FlightSearchCriteria criteria = FlightSearchCriteria.builder()
                .origin(origin)
                .destination(destination)
                .departureDate(departureDate)
                .build();
        List<FlightDto> flights = flightService.searchFlights(criteria);

        if (departureDate != null) {
            flights = flights.stream()
                    .filter(f -> f.getDepartureTime() != null && f.getDepartureTime().toLocalDate().equals(departureDate))
                    .toList();
        }

        if (status != null && !status.isBlank()) {
            String st = status.trim().toUpperCase();
            flights = flights.stream()
                    .filter(f -> f.getStatus() != null && f.getStatus().equalsIgnoreCase(st))
                    .toList();
        }

        if (q != null && !q.isBlank()) {
            String query = q.trim().toLowerCase();
            flights = flights.stream()
                    .filter(f -> f.getFlightNumber().toLowerCase().contains(query)
                            || f.getAirline().toLowerCase().contains(query)
                            || (f.getDepartureAirport() != null && f.getDepartureAirport().getCode().toLowerCase().contains(query))
                            || (f.getArrivalAirport() != null && f.getArrivalAirport().getCode().toLowerCase().contains(query)))
                    .toList();
        }
        return ResponseEntity.ok(flights);
    }

    @PostMapping("/flights")
    public ResponseEntity<FlightDto> createFlight(@Valid @RequestBody CreateFlightRequest request) {
        FlightDto flight = flightService.createFlight(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(flight);
    }

    @PutMapping("/flights/{id}")
    public ResponseEntity<FlightDto> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody CreateFlightRequest request) {
        FlightDto flight = flightService.updateFlight(id, request);
        return ResponseEntity.ok(flight);
    }

    @PatchMapping("/flights/{id}/status")
    public ResponseEntity<FlightDto> updateStatus(
            @PathVariable Long id,
            @RequestBody FlightStatusUpdateRequest request) {
        FlightDto updated = flightService.updateFlightStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/flights/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/flights/{id}/manifest")
    public ResponseEntity<PassengerManifestDto> getManifest(@PathVariable Long id) {
        PassengerManifestDto manifest = adminService.getPassengerManifest(id);
        return ResponseEntity.ok(manifest);
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDto>> listBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate flightDate) {
        List<BookingDto> bookings = adminService.listBookings(status, q, bookingDate, flightDate);
        return ResponseEntity.ok(bookings);
    }

    private final com.aerosmart.service.DestinationDealService destinationDealService;

    @PostMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingDto> cancelBooking(@PathVariable Long id) {
        BookingDto cancelled = adminService.cancelBookingByAdmin(id);
        return ResponseEntity.ok(cancelled);
    }

    @GetMapping("/airports")
    public ResponseEntity<List<AirportDto>> listAirports() {
        List<AirportDto> airports = flightService.listAirports();
        return ResponseEntity.ok(airports);
    }

    @PostMapping("/airports")
    public ResponseEntity<AirportDto> createAirport(@Valid @RequestBody AirportDto dto) {
        AirportDto created = flightService.createAirport(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/airports/{code}")
    public ResponseEntity<AirportDto> updateAirport(
            @PathVariable String code,
            @Valid @RequestBody AirportDto dto) {
        AirportDto updated = flightService.updateAirport(code, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/airports/{code}")
    public ResponseEntity<Void> deleteAirport(@PathVariable String code) {
        flightService.deleteAirport(code);
        return ResponseEntity.noContent().build();
    }

    private final com.aerosmart.service.CountrySpotlightService countrySpotlightService;

    @GetMapping("/destination-deals")
    public ResponseEntity<List<com.aerosmart.dto.DestinationDealDto>> listDestinationDeals() {
        List<com.aerosmart.dto.DestinationDealDto> deals = destinationDealService.getAllDeals();
        return ResponseEntity.ok(deals);
    }

    @PostMapping("/destination-deals")
    public ResponseEntity<com.aerosmart.dto.DestinationDealDto> createDestinationDeal(
            @Valid @RequestBody com.aerosmart.dto.DestinationDealDto dto) {
        com.aerosmart.dto.DestinationDealDto created = destinationDealService.createDeal(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/destination-deals/{id}")
    public ResponseEntity<com.aerosmart.dto.DestinationDealDto> updateDestinationDeal(
            @PathVariable Long id,
            @Valid @RequestBody com.aerosmart.dto.DestinationDealDto dto) {
        com.aerosmart.dto.DestinationDealDto updated = destinationDealService.updateDeal(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/destination-deals/{id}/toggle")
    public ResponseEntity<com.aerosmart.dto.DestinationDealDto> toggleDestinationDeal(@PathVariable Long id) {
        com.aerosmart.dto.DestinationDealDto toggled = destinationDealService.toggleActive(id);
        return ResponseEntity.ok(toggled);
    }

    @DeleteMapping("/destination-deals/{id}")
    public ResponseEntity<Void> deleteDestinationDeal(@PathVariable Long id) {
        destinationDealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/countries")
    public ResponseEntity<List<com.aerosmart.dto.CountrySpotlightDto>> listCountries() {
        List<com.aerosmart.dto.CountrySpotlightDto> countries = countrySpotlightService.getAllCountries();
        return ResponseEntity.ok(countries);
    }

    @PostMapping("/countries")
    public ResponseEntity<com.aerosmart.dto.CountrySpotlightDto> createCountry(
            @Valid @RequestBody com.aerosmart.dto.CountrySpotlightDto dto) {
        com.aerosmart.dto.CountrySpotlightDto created = countrySpotlightService.createCountry(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/countries/{id}")
    public ResponseEntity<com.aerosmart.dto.CountrySpotlightDto> updateCountry(
            @PathVariable Long id,
            @Valid @RequestBody com.aerosmart.dto.CountrySpotlightDto dto) {
        com.aerosmart.dto.CountrySpotlightDto updated = countrySpotlightService.updateCountry(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/countries/{id}/toggle")
    public ResponseEntity<com.aerosmart.dto.CountrySpotlightDto> toggleCountry(@PathVariable Long id) {
        com.aerosmart.dto.CountrySpotlightDto toggled = countrySpotlightService.toggleActive(id);
        return ResponseEntity.ok(toggled);
    }

    @DeleteMapping("/countries/{id}")
    public ResponseEntity<Void> deleteCountry(@PathVariable Long id) {
        countrySpotlightService.deleteCountry(id);
        return ResponseEntity.noContent().build();
    }
}
