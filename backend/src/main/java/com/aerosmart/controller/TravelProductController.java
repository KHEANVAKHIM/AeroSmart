package com.aerosmart.controller;

import com.aerosmart.domain.*;
import com.aerosmart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TravelProductController {

    private final HotelRepository hotelRepository;
    private final HotelBookingRepository hotelBookingRepository;
    private final RentalCarRepository rentalCarRepository;
    private final CarBookingRepository carBookingRepository;
    private final TravelPackageRepository travelPackageRepository;
    private final PackageBookingRepository packageBookingRepository;
    private final AttractionRepository attractionRepository;
    private final AttractionBookingRepository attractionBookingRepository;
    private final AirportTaxiRepository airportTaxiRepository;
    private final TaxiBookingRepository taxiBookingRepository;

    /* ----------------------------------------------------------------- Stays / Hotels */
    @GetMapping("/stays")
    public ResponseEntity<List<Hotel>> listHotels(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(hotelRepository.findByCityIgnoreCaseAndIsActiveTrue(city));
        }
        return ResponseEntity.ok(hotelRepository.findByIsActiveTrue());
    }

    @GetMapping("/stays/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/stays/bookings")
    public ResponseEntity<?> createHotelBooking(@RequestBody HotelBooking booking) {
        if (booking.getReferenceCode() == null || booking.getReferenceCode().isBlank()) {
            booking.setReferenceCode("STAY-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        HotelBooking saved = hotelBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    /* ----------------------------------------------------------------- Cars */
    @GetMapping("/cars")
    public ResponseEntity<List<RentalCar>> listCars(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(rentalCarRepository.findByCategoryAndIsAvailableTrue(category));
        }
        return ResponseEntity.ok(rentalCarRepository.findByIsAvailableTrue());
    }

    @GetMapping("/cars/{id}")
    public ResponseEntity<RentalCar> getCarById(@PathVariable Long id) {
        return rentalCarRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/cars/bookings")
    public ResponseEntity<?> createCarBooking(@RequestBody CarBooking booking) {
        if (booking.getReferenceCode() == null || booking.getReferenceCode().isBlank()) {
            booking.setReferenceCode("CAR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        CarBooking saved = carBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    /* ----------------------------------------------------------------- Packages */
    @GetMapping("/packages")
    public ResponseEntity<List<TravelPackage>> listPackages() {
        return ResponseEntity.ok(travelPackageRepository.findByIsActiveTrue());
    }

    @GetMapping("/packages/{id}")
    public ResponseEntity<TravelPackage> getPackageById(@PathVariable Long id) {
        return travelPackageRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/packages/bookings")
    public ResponseEntity<?> createPackageBooking(@RequestBody PackageBooking booking) {
        if (booking.getReferenceCode() == null || booking.getReferenceCode().isBlank()) {
            booking.setReferenceCode("COMBO-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        PackageBooking saved = packageBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    /* ----------------------------------------------------------------- Attractions */
    @GetMapping("/attractions")
    public ResponseEntity<List<Attraction>> listAttractions(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(attractionRepository.findByCityIgnoreCaseAndIsActiveTrue(city));
        }
        return ResponseEntity.ok(attractionRepository.findByIsActiveTrue());
    }

    @GetMapping("/attractions/{id}")
    public ResponseEntity<Attraction> getAttractionById(@PathVariable Long id) {
        return attractionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/attractions/bookings")
    public ResponseEntity<?> createAttractionBooking(@RequestBody AttractionBooking booking) {
        if (booking.getReferenceCode() == null || booking.getReferenceCode().isBlank()) {
            booking.setReferenceCode("TICKET-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        AttractionBooking saved = attractionBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    /* ----------------------------------------------------------------- Taxis */
    @GetMapping("/taxis")
    public ResponseEntity<List<AirportTaxi>> listTaxis() {
        return ResponseEntity.ok(airportTaxiRepository.findByIsAvailableTrue());
    }

    @GetMapping("/taxis/{id}")
    public ResponseEntity<AirportTaxi> getTaxiById(@PathVariable Long id) {
        return airportTaxiRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/taxis/bookings")
    public ResponseEntity<?> createTaxiBooking(@RequestBody TaxiBooking booking) {
        if (booking.getReferenceCode() == null || booking.getReferenceCode().isBlank()) {
            booking.setReferenceCode("TAXI-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        TaxiBooking saved = taxiBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }
}
