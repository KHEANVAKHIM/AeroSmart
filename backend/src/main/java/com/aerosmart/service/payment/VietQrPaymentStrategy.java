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
public class VietQrPaymentStrategy implements PaymentStrategy {

    @Override
    public String getMethodName() {
        return "VIETQR";
    }

    @Override
    public PaymentResult processPayment(Booking booking, BigDecimal amount) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String suffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String txId = "VQR_" + timestamp + "_" + suffix;

        log.info("Processing VietQR payment for booking: {}, amount: {} VND, txId: {}",
                booking.getBookingReference(), amount, txId);

        return PaymentResult.builder()
                .successful(true)
                .transactionId(txId)
                .paymentMethod("VIETQR")
                .amount(amount)
                .paidAt(LocalDateTime.now())
                .message("VietQR Napas 24/7 bank transfer settled successfully")
                .build();
    }
}
