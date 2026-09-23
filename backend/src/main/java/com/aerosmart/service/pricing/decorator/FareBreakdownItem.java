package com.aerosmart.service.pricing.decorator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FareBreakdownItem {

    private String code;
    private String name;
    private String category; // BASE, BAGGAGE, MEAL, INSURANCE, LOUNGE, TAX
    private BigDecimal amount;
    private String details;
}
