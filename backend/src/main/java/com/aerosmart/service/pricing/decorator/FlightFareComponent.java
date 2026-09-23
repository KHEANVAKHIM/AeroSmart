package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;
import java.util.List;

/**
 * Component interface for the Decorator Pattern in AeroSmart.
 * Allows dynamic composition of flight ticket fares with add-ons (ancillary services).
 */
public interface FlightFareComponent {

    /**
     * @return Total calculated price of this fare item and all its applied decorators.
     */
    BigDecimal calculateTotal();

    /**
     * @return Summary description of the fare item and all applied decorators.
     */
    String getDescription();

    /**
     * @return Itemized breakdown of all individual costs.
     */
    List<FareBreakdownItem> getBreakdown();
}
