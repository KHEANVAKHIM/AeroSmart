package com.aerosmart.service.payment;

import com.aerosmart.domain.Booking;

import java.math.BigDecimal;

/**
 * Strategy Pattern interface for processing flight booking payments.
 */
public interface PaymentStrategy {

    String getMethodName();

    PaymentResult processPayment(Booking booking, BigDecimal amount);
}
