package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "car_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private RentalCar car;

    private LocalDate pickupDate;
    private String pickupTime;
    private LocalDate returnDate;
    private String returnTime;

    private String pickupLocation;
    private String renterName;
    private String renterPhone;
    private String renterEmail;

    @Builder.Default
    private Boolean hasInsuranceUpgrade = false;

    private Long totalPrice;

    @Builder.Default
    private String status = "CONFIRMED";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
