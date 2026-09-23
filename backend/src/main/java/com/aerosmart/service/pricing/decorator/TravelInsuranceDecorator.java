package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;

/**
 * Concrete Decorator for Comprehensive Travel Care Insurance.
 */
public class TravelInsuranceDecorator extends FlightFareDecorator {

    private final String planType;
    private final BigDecimal insurancePrice;

    public TravelInsuranceDecorator(FlightFareComponent wrappedFare, String planType) {
        super(wrappedFare);
        this.planType = planType != null ? planType.toUpperCase() : "STANDARD";
        // Comprehensive airline travel insurance: 99,000 VND
        if ("PREMIUM".equals(this.planType)) {
            this.insurancePrice = new BigDecimal("189000");
        } else {
            this.insurancePrice = new BigDecimal("99000");
        }
    }

    @Override
    public BigDecimal getAddonPrice() {
        return insurancePrice;
    }

    @Override
    public String getAddonDescription() {
        return "AeroSmart Comprehensive Travel Care (" + planType + " Plan)";
    }

    @Override
    public FareBreakdownItem getAddonBreakdownItem() {
        return FareBreakdownItem.builder()
                .code("INSURANCE_" + planType)
                .name("AeroSmart Travel Care Insurance (" + planType + ")")
                .category("INSURANCE")
                .amount(insurancePrice)
                .details("Flight delay compensation up to 5,000,000 VND + Lost baggage & medical cover")
                .build();
    }
}
