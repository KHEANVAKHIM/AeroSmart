package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "attractions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String titleEn;
    private String titleKm;
    private String city;
    private String country;
    private String category;
    private String categoryLabel;
    private Double rating;
    private Integer reviewsCount;
    private String duration;
    private Long price;
    private Long originalPrice;

    @Column(length = 1000)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String howToRedeem;

    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "attraction", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AttractionTicket> tickets = new ArrayList<>();
}
