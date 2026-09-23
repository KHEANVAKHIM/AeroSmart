package com.aerosmart.service.ticket.factory;

import com.aerosmart.domain.Booking;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

/**
 * Concrete Factory for generating Official VAT / Tax Invoices & Receipts.
 */
@Component
public class HtmlReceiptFactory implements TicketDocumentFactory {

    @Override
    public String getSupportedFormat() {
        return "HTML";
    }

    @Override
    public TicketDocumentResponse generateDocument(Booking booking) {
        String pnr = booking.getBookingReference();
        String totalAmount = booking.getTotalAmount() != null ? booking.getTotalAmount().toString() : "0";
        String paymentMethod = booking.getPaymentMethod() != null ? booking.getPaymentMethod() : "ONLINE_PAYMENT";

        String htmlReceipt = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <title>AeroSmart Tax Invoice - %s</title>
                <style>
                  body { font-family: monospace, sans-serif; background: #fafafa; padding: 20px; }
                  .receipt { max-width: 500px; margin: 0 auto; background: white; padding: 25px; border: 1px dashed #cbd5e1; border-radius: 8px; }
                  h2 { text-align: center; margin: 0 0 10px 0; }
                  .line { border-top: 1px dashed #94a3b8; margin: 15px 0; }
                  .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
                </style>
                </head>
                <body>
                  <div class="receipt">
                    <h2>AEROSMART AVIATION TECHNOLOGIES</h2>
                    <p style="text-align: center; font-size: 11px; margin: 0;">Official Electronic Tax Receipt / E-Invoice</p>
                    <div class="line"></div>
                    <div class="item"><span>Booking Ref (PNR):</span><span><strong>%s</strong></span></div>
                    <div class="item"><span>Payment Gateway:</span><span>%s</span></div>
                    <div class="item"><span>Status:</span><span>PAID & CONFIRMED</span></div>
                    <div class="line"></div>
                    <div class="item" style="font-size: 16px;"><span>TOTAL AMOUNT PAID:</span><span><strong>%s VND</strong></span></div>
                    <div class="line"></div>
                    <p style="text-align: center; font-size: 10px; color: #64748b;">Thank you for flying with AeroSmart!</p>
                  </div>
                </body>
                </html>
                """, pnr, pnr, paymentMethod, totalAmount);

        byte[] bytes = htmlReceipt.getBytes(StandardCharsets.UTF_8);

        return TicketDocumentResponse.builder()
                .format("HTML")
                .filename("AeroSmart_Receipt_" + pnr + ".html")
                .contentType("text/html; charset=UTF-8")
                .data(bytes)
                .previewUrl("/api/bookings/" + pnr + "/documents/preview?format=HTML")
                .build();
    }
}
