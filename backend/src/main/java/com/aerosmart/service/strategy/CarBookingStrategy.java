package com.aerosmart.service.strategy;

import com.aerosmart.dao.GenericDao;
import com.aerosmart.domain.CarBooking;
import com.aerosmart.domain.RentalCar;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CarBookingStrategy implements BookingStrategy {

    private final GenericDao genericDao;

    @Override
    public boolean supports(String productType) {
        return "CAR".equalsIgnoreCase(productType) || "CAR_RENTAL".equalsIgnoreCase(productType);
    }

    @Override
    public Object executeBooking(Map<String, Object> req) {
        String refCode = "CAR-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        
        Long carId = req.get("carId") != null ? Long.valueOf(req.get("carId").toString()) : null;
        RentalCar car = carId != null ? genericDao.findById(RentalCar.class, carId).orElse(null) : null;

        CarBooking booking = CarBooking.builder()
                .referenceCode(refCode)
                .car(car)
                .pickupDate(req.get("pickupDate") != null ? LocalDate.parse(req.get("pickupDate").toString()) : LocalDate.now().plusDays(2))
                .pickupTime((String) req.getOrDefault("pickupTime", "09:00"))
                .returnDate(req.get("returnDate") != null ? LocalDate.parse(req.get("returnDate").toString()) : LocalDate.now().plusDays(5))
                .returnTime((String) req.getOrDefault("returnTime", "18:00"))
                .pickupLocation((String) req.getOrDefault("pickupLocation", "Sân bay Nội Bài"))
                .renterName((String) req.getOrDefault("renterName", "Khách hàng"))
                .renterPhone((String) req.getOrDefault("renterPhone", ""))
                .renterEmail((String) req.getOrDefault("renterEmail", ""))
                .hasInsuranceUpgrade(Boolean.TRUE.equals(req.get("hasInsuranceUpgrade")))
                .totalPrice(req.get("totalPrice") != null ? Long.valueOf(req.get("totalPrice").toString()) : 0L)
                .status("CONFIRMED")
                .build();

        return genericDao.save(booking);
    }
}
