package com.aerosmart.service.strategy;

import java.util.Map;

/**
 * Strategy Pattern Interface for multi-product travel bookings (Flight, Hotel, Car, Package, Attraction, Taxi)
 */
public interface BookingStrategy {
    boolean supports(String productType);
    Object executeBooking(Map<String, Object> request);
}
