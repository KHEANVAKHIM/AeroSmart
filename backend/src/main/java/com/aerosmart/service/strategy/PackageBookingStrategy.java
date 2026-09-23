package com.aerosmart.service.strategy;

import com.aerosmart.dao.GenericDao;
import com.aerosmart.domain.PackageBooking;
import com.aerosmart.domain.TravelPackage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PackageBookingStrategy implements BookingStrategy {

    private final GenericDao genericDao;

    @Override
    public boolean supports(String productType) {
        return "PACKAGE".equalsIgnoreCase(productType) || "COMBO".equalsIgnoreCase(productType);
    }

    @Override
    public Object executeBooking(Map<String, Object> req) {
        String refCode = "COMBO-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        
        Long packageId = req.get("packageId") != null ? Long.valueOf(req.get("packageId").toString()) : null;
        TravelPackage pkg = packageId != null ? genericDao.findById(TravelPackage.class, packageId).orElse(null) : null;

        PackageBooking booking = PackageBooking.builder()
                .referenceCode(refCode)
                .travelPackage(pkg)
                .departureDate(req.get("departureDate") != null ? LocalDate.parse(req.get("departureDate").toString()) : LocalDate.now().plusDays(5))
                .passengersCount(req.get("passengersCount") != null ? Integer.valueOf(req.get("passengersCount").toString()) : 2)
                .buyerName((String) req.getOrDefault("buyerName", "Khách hàng"))
                .buyerPhone((String) req.getOrDefault("buyerPhone", ""))
                .buyerEmail((String) req.getOrDefault("buyerEmail", ""))
                .totalPrice(req.get("totalPrice") != null ? Long.valueOf(req.get("totalPrice").toString()) : 0L)
                .status("CONFIRMED")
                .build();

        return genericDao.save(booking);
    }
}
