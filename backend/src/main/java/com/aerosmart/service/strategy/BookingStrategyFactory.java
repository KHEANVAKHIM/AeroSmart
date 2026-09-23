package com.aerosmart.service.strategy;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class BookingStrategyFactory {

    private final List<BookingStrategy> strategies;

    public BookingStrategyFactory(List<BookingStrategy> strategies) {
        this.strategies = strategies;
    }

    public Object processBooking(String productType, Map<String, Object> bookingData) {
        return strategies.stream()
                .filter(s -> s.supports(productType))
                .findFirst()
                .map(s -> s.executeBooking(bookingData))
                .orElseThrow(() -> new IllegalArgumentException("Unsupported product type for booking: " + productType));
    }
}
