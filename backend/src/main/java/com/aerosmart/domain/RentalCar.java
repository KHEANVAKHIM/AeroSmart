package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rental_cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalCar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String code;
    private String category;
    private String categoryLabel;
    private Integer seats;
    private Integer doors;
    private Integer bags;
    private String transmission;
    private String fuelType;
    private Long pricePerDay;
    private Long originalPrice;

    @Column(length = 1000)
    private String imageUrl;

    private String type; // SELF_DRIVE, WITH_DRIVER
    private Long depositAmount;
    private Double rating;
    private Integer reviewsCount;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Column(columnDefinition = "TEXT")
    private String pickupLocations;

    @Builder.Default
    private Boolean isAvailable = true;
}
