package com.aerosmart.service.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResult {
    private boolean successful;
    private String transactionId;
    private String paymentMethod;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private String message;
}
