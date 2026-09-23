package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attraction_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttractionBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id")
    private Attraction attraction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private AttractionTicket ticket;

    private LocalDate visitDate;
    private Integer ticketQuantity;

    private String visitorName;
    private String visitorPhone;
    private String visitorEmail;

    private String qrCodeToken;
    private Long totalPrice;

    @Builder.Default
    private String status = "CONFIRMED";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
