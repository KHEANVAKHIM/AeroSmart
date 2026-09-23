package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String nameEn;
    private String nameKm;
    private String location;
    private String city;
    private String country;
    private Integer stars;
    private Double rating;
    private Integer reviewsCount;
    private Long pricePerNight;
    private Long originalPrice;
    private String propertyType;

    @Column(length = 1000)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HotelRoom> rooms = new ArrayList<>();
}
