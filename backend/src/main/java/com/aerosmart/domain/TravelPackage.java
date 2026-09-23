package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "travel_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String titleEn;
    private String origin;
    private String destination;
    private String flightRoute;
    private String hotelName;
    private String roomType;
    private String duration;
    private Double rating;
    private Integer reviewsCount;
    private Long pricePerPerson;
    private Long originalPrice;
    private String savingBadge;

    @Column(length = 1000)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String inclusions;

    @Column(columnDefinition = "TEXT")
    private String itinerary;

    @Builder.Default
    private Boolean isActive = true;
}
