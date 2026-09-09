package com.aerosmart.service.payment;

import com.aerosmart.domain.Booking;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Component
public class MomoPaymentStrategy implements PaymentStrategy {

    @Override
    public String getMethodName() {
        return "MOMO";
    }

    @Override
    public PaymentResult processPayment(Booking booking, BigDecimal amount) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String suffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String txId = "MOMO_" + timestamp + "_" + suffix;

        log.info("Processing MoMo e-wallet payment for booking reference: {}, amount: {} VND, txId: {}",
                booking.getBookingReference(), amount, txId);

        return PaymentResult.builder()
                .successful(true)
                .transactionId(txId)
                .paymentMethod("MOMO")
                .amount(amount)
                .paidAt(LocalDateTime.now())
                .message("MoMo e-wallet payment debited successfully")
                .build();
    }
}
