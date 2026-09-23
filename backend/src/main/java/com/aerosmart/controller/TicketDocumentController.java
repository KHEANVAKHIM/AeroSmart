package com.aerosmart.controller;

import com.aerosmart.service.ticket.factory.TicketDocumentResponse;
import com.aerosmart.service.ticket.factory.TicketDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class TicketDocumentController {

    private final TicketDocumentService ticketDocumentService;

    @GetMapping("/{reference}/documents")
    public ResponseEntity<byte[]> getDocument(
            @PathVariable String reference,
            @RequestParam(defaultValue = "PDF") String format) {

        TicketDocumentResponse doc = ticketDocumentService.generate(reference, format);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFilename() + "\"")
                .body(doc.getData());
    }

    @GetMapping("/{reference}/documents/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String reference,
            @RequestParam(defaultValue = "PDF") String format) {

        TicketDocumentResponse doc = ticketDocumentService.generate(reference, format);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFilename() + "\"")
                .body(doc.getData());
    }
}
