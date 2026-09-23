package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hotel_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private HotelRoom room;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer nights;

    private String guestName;
    private String guestPhone;
    private String guestEmail;

    private Long totalPrice;

    @Builder.Default
    private String status = "CONFIRMED";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
