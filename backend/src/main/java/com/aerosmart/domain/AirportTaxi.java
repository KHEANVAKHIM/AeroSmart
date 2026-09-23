package com.aerosmart.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airport_taxis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AirportTaxi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String code;
    private String category;
    private String categoryLabel;
    private Integer seats;
    private Integer bags;
    private Long baseFare;
    private Long originalFare;

    @Column(length = 1000)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Builder.Default
    private Boolean isAvailable = true;
}
