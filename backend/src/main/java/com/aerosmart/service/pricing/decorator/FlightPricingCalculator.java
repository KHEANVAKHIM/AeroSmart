package com.aerosmart.service.pricing.decorator;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Service that coordinates the Decorator Pattern for dynamic flight pricing & ancillary services.
 */
@Service
public class FlightPricingCalculator {

    /**
     * Composes and decorates a base flight fare with chosen ancillaries.
     */
    public FlightFareComponent buildFare(
            String flightNumber,
            String seatNumber,
            String seatClass,
            BigDecimal basePrice,
            BigDecimal seatClassMultiplier,
            BigDecimal taxesAndFees,
            Integer extraBaggageKg,
            String mealCode,
            Boolean hasInsurance,
            String insurancePlan,
            Boolean hasLounge) {

        // 1. Base Component
        FlightFareComponent fare = new BaseFlightFare(
                flightNumber, seatNumber, seatClass, basePrice, seatClassMultiplier, taxesAndFees);

        // 2. Decorate with Extra Baggage if selected
        if (extraBaggageKg != null && extraBaggageKg > 0) {
            fare = new ExtraBaggageDecorator(fare, extraBaggageKg);
        }

        // 3. Decorate with Hot In-Flight Meal if selected
        if (mealCode != null && !mealCode.isBlank() && !"NONE".equalsIgnoreCase(mealCode)) {
            fare = new InFlightMealDecorator(fare, mealCode);
        }

        // 4. Decorate with Travel Care Insurance if opted in
        if (Boolean.TRUE.equals(hasInsurance)) {
            fare = new TravelInsuranceDecorator(fare, insurancePlan);
        }

        // 5. Decorate with Lounge & Priority Fast-Track if opted in
        if (Boolean.TRUE.equals(hasLounge)) {
            fare = new AirportLoungeDecorator(fare);
        }

        return fare;
    }
}
