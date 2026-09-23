package com.aerosmart.service.ticket.factory;

import com.aerosmart.domain.Booking;
import com.aerosmart.exception.ApiException;
import com.aerosmart.exception.ResourceNotFoundException;
import com.aerosmart.repository.BookingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service managing the Factory Method Pattern for document generation.
 */
@Slf4j
@Service
public class TicketDocumentService {

    private final BookingRepository bookingRepository;
    private final Map<String, TicketDocumentFactory> factoryRegistry = new HashMap<>();

    public TicketDocumentService(BookingRepository bookingRepository, List<TicketDocumentFactory> factories) {
        this.bookingRepository = bookingRepository;
        for (TicketDocumentFactory f : factories) {
            factoryRegistry.put(f.getSupportedFormat().toUpperCase(), f);
            log.info("Registered TicketDocumentFactory for format: {}", f.getSupportedFormat());
        }
    }

    public TicketDocumentResponse generate(String bookingReference, String format) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "bookingReference", bookingReference));

        String fmt = format != null ? format.trim().toUpperCase() : "PDF";
        TicketDocumentFactory factory = factoryRegistry.get(fmt);

        if (factory == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unsupported document format: " + format + ". Supported: " + factoryRegistry.keySet());
        }

        log.info("Generating document [{}] for booking reference={}", fmt, bookingReference);
        return factory.generateDocument(booking);
    }
}
