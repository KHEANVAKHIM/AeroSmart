package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "taxi_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxiBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taxi_id")
    private AirportTaxi taxi;

    private String tripDirection; // FROM_AIRPORT, TO_AIRPORT
    private String airportCode;
    private String destinationAddress;
    private String flightNumber;
    private String pickupDateTime;

    private String passengerName;
    private String passengerPhone;
    private String passengerEmail;

    private Long totalPrice;

    @Builder.Default
    private String status = "CONFIRMED";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
