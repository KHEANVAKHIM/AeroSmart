package com.aerosmart.controller;

import com.aerosmart.dao.GenericDao;
import com.aerosmart.domain.*;
import com.aerosmart.service.strategy.BookingStrategyFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Unified Travel Product Controller utilizing Generic DAO Pattern & Strategy Pattern.
 * No individual repository interfaces needed.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TravelProductController {

    private final GenericDao genericDao;
    private final BookingStrategyFactory bookingStrategyFactory;

    /* ----------------------------------------------------------------- Stays / Hotels */
    @GetMapping("/stays")
    public ResponseEntity<List<Hotel>> listHotels(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(genericDao.findByFieldIgnoreCase(Hotel.class, "city", city));
        }
        return ResponseEntity.ok(genericDao.findAll(Hotel.class));
    }

    @GetMapping("/stays/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return genericDao.findById(Hotel.class, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/stays/bookings")
    public ResponseEntity<?> createHotelBooking(@RequestBody Map<String, Object> bookingData) {
        return ResponseEntity.ok(bookingStrategyFactory.processBooking("HOTEL", bookingData));
    }

    /* ----------------------------------------------------------------- Cars */
    @GetMapping("/cars")
    public ResponseEntity<List<RentalCar>> listCars(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(genericDao.findByField(RentalCar.class, "category", category));
        }
        return ResponseEntity.ok(genericDao.findAll(RentalCar.class));
    }

    @GetMapping("/cars/{id}")
    public ResponseEntity<RentalCar> getCarById(@PathVariable Long id) {
        return genericDao.findById(RentalCar.class, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/cars/bookings")
    public ResponseEntity<?> createCarBooking(@RequestBody Map<String, Object> bookingData) {
        return ResponseEntity.ok(bookingStrategyFactory.processBooking("CAR", bookingData));
    }

    /* ----------------------------------------------------------------- Packages */
    @GetMapping("/packages")
    public ResponseEntity<List<TravelPackage>> listPackages() {
        return ResponseEntity.ok(genericDao.findAll(TravelPackage.class));
    }

    @GetMapping("/packages/{id}")
    public ResponseEntity<TravelPackage> getPackageById(@PathVariable Long id) {
        return genericDao.findById(TravelPackage.class, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/packages/bookings")
    public ResponseEntity<?> createPackageBooking(@RequestBody Map<String, Object> bookingData) {
        return ResponseEntity.ok(bookingStrategyFactory.processBooking("PACKAGE", bookingData));
    }

    /* ----------------------------------------------------------------- Attractions */
    @GetMapping("/attractions")
    public ResponseEntity<List<Attraction>> listAttractions(@RequestParam(required = false) String city) {
        if (city != null && !city.isBlank()) {
            return ResponseEntity.ok(genericDao.findByFieldIgnoreCase(Attraction.class, "city", city));
        }
        return ResponseEntity.ok(genericDao.findAll(Attraction.class));
    }

    @GetMapping("/attractions/{id}")
    public ResponseEntity<Attraction> getAttractionById(@PathVariable Long id) {
        return genericDao.findById(Attraction.class, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/attractions/bookings")
    public ResponseEntity<?> createAttractionBooking(@RequestBody Map<String, Object> bookingData) {
        return ResponseEntity.ok(bookingStrategyFactory.processBooking("ATTRACTION", bookingData));
    }

    /* ----------------------------------------------------------------- Taxis */
    @GetMapping("/taxis")
    public ResponseEntity<List<AirportTaxi>> listTaxis() {
        return ResponseEntity.ok(genericDao.findAll(AirportTaxi.class));
    }

    @GetMapping("/taxis/{id}")
    public ResponseEntity<AirportTaxi> getTaxiById(@PathVariable Long id) {
        return genericDao.findById(AirportTaxi.class, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/taxis/bookings")
    public ResponseEntity<?> createTaxiBooking(@RequestBody Map<String, Object> bookingData) {
        return ResponseEntity.ok(bookingStrategyFactory.processBooking("TAXI", bookingData));
    }

    /* ----------------------------------------------------------------- Generic Booking Gateway */
    @PostMapping("/travel/book/{productType}")
    public ResponseEntity<?> genericBook(@PathVariable String productType, @RequestBody Map<String, Object> bookingData) {
        return ResponseEntity.ok(bookingStrategyFactory.processBooking(productType, bookingData));
    }
}
