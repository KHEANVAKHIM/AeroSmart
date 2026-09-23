package com.aerosmart.service.strategy;

import com.aerosmart.dao.GenericDao;
import com.aerosmart.domain.Attraction;
import com.aerosmart.domain.AttractionBooking;
import com.aerosmart.domain.AttractionTicket;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AttractionBookingStrategy implements BookingStrategy {

    private final GenericDao genericDao;

    @Override
    public boolean supports(String productType) {
        return "ATTRACTION".equalsIgnoreCase(productType) || "TOUR".equalsIgnoreCase(productType);
    }

    @Override
    public Object executeBooking(Map<String, Object> req) {
        String refCode = "TICKET-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        
        Long attractionId = req.get("attractionId") != null ? Long.valueOf(req.get("attractionId").toString()) : null;
        Long ticketId = req.get("ticketId") != null ? Long.valueOf(req.get("ticketId").toString()) : null;

        Attraction attraction = attractionId != null ? genericDao.findById(Attraction.class, attractionId).orElse(null) : null;
        AttractionTicket ticket = ticketId != null ? genericDao.findById(AttractionTicket.class, ticketId).orElse(null) : null;

        AttractionBooking booking = AttractionBooking.builder()
                .referenceCode(refCode)
                .attraction(attraction)
                .ticket(ticket)
                .visitDate(req.get("visitDate") != null ? LocalDate.parse(req.get("visitDate").toString()) : LocalDate.now().plusDays(2))
                .ticketQuantity(req.get("ticketQuantity") != null ? Integer.valueOf(req.get("ticketQuantity").toString()) : 2)
                .visitorName((String) req.getOrDefault("visitorName", "Khách hàng"))
                .visitorPhone((String) req.getOrDefault("visitorPhone", ""))
                .visitorEmail((String) req.getOrDefault("visitorEmail", ""))
                .qrCodeToken(UUID.randomUUID().toString())
                .totalPrice(req.get("totalPrice") != null ? Long.valueOf(req.get("totalPrice").toString()) : 0L)
                .status("CONFIRMED")
                .build();

        return genericDao.save(booking);
    }
}
