package com.aerosmart.service.strategy;

import com.aerosmart.dao.GenericDao;
import com.aerosmart.domain.AirportTaxi;
import com.aerosmart.domain.TaxiBooking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TaxiBookingStrategy implements BookingStrategy {

    private final GenericDao genericDao;

    @Override
    public boolean supports(String productType) {
        return "TAXI".equalsIgnoreCase(productType) || "AIRPORT_TAXI".equalsIgnoreCase(productType);
    }

    @Override
    public Object executeBooking(Map<String, Object> req) {
        String refCode = "TAXI-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        
        Long taxiId = req.get("taxiId") != null ? Long.valueOf(req.get("taxiId").toString()) : null;
        AirportTaxi taxi = taxiId != null ? genericDao.findById(AirportTaxi.class, taxiId).orElse(null) : null;

        TaxiBooking booking = TaxiBooking.builder()
                .referenceCode(refCode)
                .taxi(taxi)
                .tripDirection((String) req.getOrDefault("tripDirection", "FROM_AIRPORT"))
                .airportCode((String) req.getOrDefault("airportCode", "HAN"))
                .destinationAddress((String) req.getOrDefault("destinationAddress", "Hà Nội"))
                .flightNumber((String) req.getOrDefault("flightNumber", "VN216"))
                .pickupDateTime((String) req.getOrDefault("pickupDateTime", "2026-10-15T14:30"))
                .passengerName((String) req.getOrDefault("passengerName", "Khách hàng"))
                .passengerPhone((String) req.getOrDefault("passengerPhone", ""))
                .passengerEmail((String) req.getOrDefault("passengerEmail", ""))
                .totalPrice(req.get("totalPrice") != null ? Long.valueOf(req.get("totalPrice").toString()) : 0L)
                .status("CONFIRMED")
                .build();

        return genericDao.save(booking);
    }
}
