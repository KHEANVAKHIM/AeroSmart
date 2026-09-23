package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;

/**
 * Concrete Decorator for Checked Baggage Add-ons.
 * Allows adding +10kg, +20kg, +30kg baggage allowances.
 */
public class ExtraBaggageDecorator extends FlightFareDecorator {

    private final int extraWeightKg;
    private final BigDecimal baggageCost;

    public ExtraBaggageDecorator(FlightFareComponent wrappedFare, int extraWeightKg) {
        super(wrappedFare);
        this.extraWeightKg = extraWeightKg;
        // Standard airline rate: 10kg = 200,000 VND; 20kg = 350,000 VND; 30kg = 480,000 VND
        if (extraWeightKg <= 10) {
            this.baggageCost = new BigDecimal("200000");
        } else if (extraWeightKg <= 20) {
            this.baggageCost = new BigDecimal("350000");
        } else {
            this.baggageCost = new BigDecimal("480000");
        }
    }

    @Override
    public BigDecimal getAddonPrice() {
        return baggageCost;
    }

    @Override
    public String getAddonDescription() {
        return "Extra Checked Baggage (+" + extraWeightKg + "kg)";
    }

    @Override
    public FareBreakdownItem getAddonBreakdownItem() {
        return FareBreakdownItem.builder()
                .code("BAGGAGE_" + extraWeightKg + "KG")
                .name("Extra Checked Baggage (+" + extraWeightKg + "kg)")
                .category("BAGGAGE")
                .amount(baggageCost)
                .details("Pre-paid checked luggage allowance up to " + extraWeightKg + "kg")
                .build();
    }
}
