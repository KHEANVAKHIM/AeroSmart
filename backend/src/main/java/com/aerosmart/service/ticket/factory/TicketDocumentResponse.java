package com.aerosmart.service.ticket.factory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDocumentResponse {

    private String format; // PDF, WALLET, HTML
    private String filename;
    private String contentType;
    private byte[] data;
    private String previewUrl;
}
