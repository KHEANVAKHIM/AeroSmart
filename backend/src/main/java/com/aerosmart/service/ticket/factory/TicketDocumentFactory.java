package com.aerosmart.service.ticket.factory;

import com.aerosmart.domain.Booking;

/**
 * Factory interface in the Factory Method Pattern.
 * Defines the contract for generating different document formats from a Booking entity.
 */
public interface TicketDocumentFactory {

    /**
     * @return The format identifier supported by this factory (e.g. "PDF", "WALLET", "HTML").
     */
    String getSupportedFormat();

    /**
     * Factory Method to generate the specific document representation.
     */
    TicketDocumentResponse generateDocument(Booking booking);
}
