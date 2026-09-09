package com.aerosmart.service.payment;

import com.aerosmart.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PaymentStrategyFactory {

    private final Map<String, PaymentStrategy> strategies;

    public PaymentStrategyFactory(List<PaymentStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(
                        s -> s.getMethodName().toUpperCase(Locale.ROOT),
                        s -> s
                ));
    }

    public PaymentStrategy getStrategy(String paymentMethod) {
        if (paymentMethod == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Payment method is required.");
        }
        PaymentStrategy strategy = strategies.get(paymentMethod.trim().toUpperCase(Locale.ROOT));
        if (strategy == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Unsupported payment method: " + paymentMethod + ". Supported: " + strategies.keySet());
        }
        return strategy;
    }
}
