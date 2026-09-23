package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Concrete Component in the Decorator Pattern.
 * Represents the fundamental base ticket fare (base price + seat class multiplier + airport taxes).
 */
public class BaseFlightFare implements FlightFareComponent {

    private final String flightNumber;
    private final String seatNumber;
    private final String seatClass;
    private final BigDecimal basePrice;
    private final BigDecimal seatClassMultiplier;
    private final BigDecimal taxesAndFees;

    public BaseFlightFare(String flightNumber, String seatNumber, String seatClass,
                          BigDecimal basePrice, BigDecimal seatClassMultiplier, BigDecimal taxesAndFees) {
        this.flightNumber = flightNumber;
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.basePrice = basePrice != null ? basePrice : BigDecimal.ZERO;
        this.seatClassMultiplier = seatClassMultiplier != null ? seatClassMultiplier : BigDecimal.ONE;
        this.taxesAndFees = taxesAndFees != null ? taxesAndFees : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal calculateTotal() {
        BigDecimal seatFare = basePrice.multiply(seatClassMultiplier);
        return seatFare.add(taxesAndFees);
    }

    @Override
    public String getDescription() {
        return String.format("Flight %s (Seat %s - %s)", flightNumber, seatNumber, seatClass);
    }

    @Override
    public List<FareBreakdownItem> getBreakdown() {
        List<FareBreakdownItem> list = new ArrayList<>();
        list.add(FareBreakdownItem.builder()
                .code("BASE_AIRFARE")
                .name("Base Airfare (" + seatClass + ")")
                .category("BASE")
                .amount(basePrice.multiply(seatClassMultiplier))
                .details(String.format("Seat %s in %s class", seatNumber, seatClass))
                .build());

        if (taxesAndFees.compareTo(BigDecimal.ZERO) > 0) {
            list.add(FareBreakdownItem.builder()
                    .code("TAXES_AND_FEES")
                    .name("Airport Taxes & Security Surcharges")
                    .category("TAX")
                    .amount(taxesAndFees)
                    .details("Mandatory aviation facility fees")
                    .build());
        }
        return list;
    }
}
