package com.aerosmart.service.ticket.factory;

import com.aerosmart.domain.Booking;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

/**
 * Concrete Factory for generating Digital Apple Wallet / Google Wallet JSON/PKPass metadata.
 */
@Component
public class AppleWalletPassFactory implements TicketDocumentFactory {

    @Override
    public String getSupportedFormat() {
        return "WALLET";
    }

    @Override
    public TicketDocumentResponse generateDocument(Booking booking) {
        String pnr = booking.getBookingReference();
        String passengerName = booking.getPassengers().isEmpty()
                ? "VALUED PASSENGER"
                : booking.getPassengers().get(0).getFullName();
        String seatNo = booking.getPassengers().isEmpty() || booking.getPassengers().get(0).getSeat() == null
                ? "AUTO"
                : booking.getPassengers().get(0).getSeat().getSeatNumber();
        String flightNo = booking.getFlight() != null ? booking.getFlight().getFlightNumber() : "AS-100";

        // PKPass metadata JSON payload
        String jsonPayload = String.format("""
                {
                  "formatVersion": 1,
                  "passTypeIdentifier": "pass.com.aerosmart.boardingpass",
                  "serialNumber": "%s",
                  "teamIdentifier": "AEROSMART_AIRWAYS",
                  "organizationName": "AeroSmart Aviation Ltd",
                  "description": "AeroSmart Boarding Pass",
                  "foregroundColor": "rgb(255, 255, 255)",
                  "backgroundColor": "rgb(0, 53, 128)",
                  "boardingPass": {
                    "transitType": "PKTransitTypeAir",
                    "primaryFields": [
                      { "key": "passenger", "label": "PASSENGER", "value": "%s" }
                    ],
                    "secondaryFields": [
                      { "key": "flight", "label": "FLIGHT", "value": "%s" },
                      { "key": "seat", "label": "SEAT", "value": "%s" }
                    ]
                  },
                  "barcode": {
                    "message": "%s",
                    "format": "PKBarcodeFormatQR",
                    "messageEncoding": "iso-8859-1"
                  }
                }
                """, pnr, passengerName, flightNo, seatNo, pnr);

        byte[] bytes = jsonPayload.getBytes(StandardCharsets.UTF_8);

        return TicketDocumentResponse.builder()
                .format("WALLET")
                .filename("AeroSmart_Pass_" + pnr + ".pkpass.json")
                .contentType("application/json")
                .data(bytes)
                .previewUrl("/api/bookings/" + pnr + "/documents/preview?format=WALLET")
                .build();
    }
}
