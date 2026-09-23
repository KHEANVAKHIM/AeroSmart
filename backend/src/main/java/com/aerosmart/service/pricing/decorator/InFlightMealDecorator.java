package com.aerosmart.service.pricing.decorator;

import java.math.BigDecimal;

/**
 * Concrete Decorator for Gourmet In-Flight Meals.
 */
public class InFlightMealDecorator extends FlightFareDecorator {

    private final String mealCode;
    private final String mealName;
    private final BigDecimal mealPrice;

    public InFlightMealDecorator(FlightFareComponent wrappedFare, String mealCode) {
        super(wrappedFare);
        this.mealCode = mealCode != null ? mealCode.toUpperCase() : "CHICKEN_RICE";

        switch (this.mealCode) {
            case "BEEF_PEPPER":
                this.mealName = "Braised Black Pepper Beef with Fragrant Rice";
                this.mealPrice = new BigDecimal("150000");
                break;
            case "PASTA_BOLOGNESE":
                this.mealName = "Italian Pasta Bolognese with Parmesan";
                this.mealPrice = new BigDecimal("130000");
                break;
            case "VEGAN_DELIGHT":
                this.mealName = "Gourmet Garden Vegan Platter";
                this.mealPrice = new BigDecimal("110000");
                break;
            case "CHICKEN_RICE":
            default:
                this.mealName = "Hội An Specialty Chicken Rice";
                this.mealPrice = new BigDecimal("120000");
                break;
        }
    }

    @Override
    public BigDecimal getAddonPrice() {
        return mealPrice;
    }

    @Override
    public String getAddonDescription() {
        return "Hot In-Flight Meal: " + mealName;
    }

    @Override
    public FareBreakdownItem getAddonBreakdownItem() {
        return FareBreakdownItem.builder()
                .code("MEAL_" + mealCode)
                .name("In-Flight Gourmet Meal: " + mealName)
                .category("MEAL")
                .amount(mealPrice)
                .details("Freshly prepared chef meal served with complimentary beverage")
                .build();
    }
}
