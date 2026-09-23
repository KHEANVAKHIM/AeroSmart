package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Abstract Decorator class in the Decorator Pattern.
 * Wraps an existing FlightFareComponent and delegates default operations to it.
 */
public abstract class FlightFareDecorator implements FlightFareComponent {

    protected final FlightFareComponent wrappedFare;

    public FlightFareDecorator(FlightFareComponent wrappedFare) {
        if (wrappedFare == null) {
            throw new IllegalArgumentException("Wrapped fare component cannot be null.");
        }
        this.wrappedFare = wrappedFare;
    }

    @Override
    public BigDecimal calculateTotal() {
        return wrappedFare.calculateTotal().add(getAddonPrice());
    }

    @Override
    public String getDescription() {
        return wrappedFare.getDescription() + " + " + getAddonDescription();
    }

    @Override
    public List<FareBreakdownItem> getBreakdown() {
        List<FareBreakdownItem> list = new ArrayList<>(wrappedFare.getBreakdown());
        list.add(getAddonBreakdownItem());
        return list;
    }

    /**
     * @return The incremental cost added by this specific decorator.
     */
    public abstract BigDecimal getAddonPrice();

    /**
     * @return Description of this specific add-on.
     */
    public abstract String getAddonDescription();

    /**
     * @return Itemized breakdown entry for this add-on.
     */
    public abstract FareBreakdownItem getAddonBreakdownItem();
}
