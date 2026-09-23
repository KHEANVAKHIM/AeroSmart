package com.aerosmart.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotel_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonIgnore
    private Hotel hotel;

    @Column(nullable = false)
    private String name;

    private String size;
    private String bedType;
    private Long price;

    @Column(columnDefinition = "TEXT")
    private String perks;

    @Builder.Default
    private Integer maxGuests = 2;

    @Builder.Default
    private Integer availableCount = 10;
}
