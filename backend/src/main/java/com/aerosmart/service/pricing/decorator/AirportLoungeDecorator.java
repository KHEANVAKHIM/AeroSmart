package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;

/**
 * Concrete Decorator for VIP Business Lounge & Priority Fast-Track Boarding.
 */
public class AirportLoungeDecorator extends FlightFareDecorator {

    private final BigDecimal loungePrice = new BigDecimal("350000");

    public AirportLoungeDecorator(FlightFareComponent wrappedFare) {
        super(wrappedFare);
    }

    @Override
    public BigDecimal getAddonPrice() {
        return loungePrice;
    }

    @Override
    public String getAddonDescription() {
        return "Lotus Business Lounge Access & Priority Fast-Track Boarding";
    }

    @Override
    public FareBreakdownItem getAddonBreakdownItem() {
        return FareBreakdownItem.builder()
                .code("LOUNGE_FASTTRACK")
                .name("Lotus Business Lounge & Fast-Track Priority")
                .category("LOUNGE")
                .amount(loungePrice)
                .details("VIP airport lounge access with buffet & priority security screening")
                .build();
    }
}
