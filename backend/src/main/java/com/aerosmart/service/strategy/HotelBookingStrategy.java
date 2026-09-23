package com.aerosmart.service.strategy;

import com.aerosmart.dao.GenericDao;
import com.aerosmart.domain.Hotel;
import com.aerosmart.domain.HotelBooking;
import com.aerosmart.domain.HotelRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class HotelBookingStrategy implements BookingStrategy {

    private final GenericDao genericDao;

    @Override
    public boolean supports(String productType) {
        return "HOTEL".equalsIgnoreCase(productType) || "STAYS".equalsIgnoreCase(productType);
    }

    @Override
    public Object executeBooking(Map<String, Object> req) {
        String refCode = "STAY-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        
        Long hotelId = req.get("hotelId") != null ? Long.valueOf(req.get("hotelId").toString()) : null;
        Long roomId = req.get("roomId") != null ? Long.valueOf(req.get("roomId").toString()) : null;
        
        Hotel hotel = hotelId != null ? genericDao.findById(Hotel.class, hotelId).orElse(null) : null;
        HotelRoom room = roomId != null ? genericDao.findById(HotelRoom.class, roomId).orElse(null) : null;

        HotelBooking booking = HotelBooking.builder()
                .referenceCode(refCode)
                .hotel(hotel)
                .room(room)
                .checkInDate(req.get("checkInDate") != null ? LocalDate.parse(req.get("checkInDate").toString()) : LocalDate.now().plusDays(3))
                .checkOutDate(req.get("checkOutDate") != null ? LocalDate.parse(req.get("checkOutDate").toString()) : LocalDate.now().plusDays(6))
                .nights(req.get("nights") != null ? Integer.valueOf(req.get("nights").toString()) : 3)
                .guestName((String) req.getOrDefault("guestName", "Khách hàng"))
                .guestPhone((String) req.getOrDefault("guestPhone", ""))
                .guestEmail((String) req.getOrDefault("guestEmail", ""))
                .totalPrice(req.get("totalPrice") != null ? Long.valueOf(req.get("totalPrice").toString()) : 0L)
                .status("CONFIRMED")
                .build();

        return genericDao.save(booking);
    }
}
