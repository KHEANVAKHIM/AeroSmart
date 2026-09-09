package com.aerosmart.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "country_spotlights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CountrySpotlight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5)
    private String countryCode; // e.g. "gb", "fr", "kh", "sg", "vn", "th", "jp", "kr"

    @Column(nullable = false)
    private String nameEn;

    @Column(nullable = false)
    private String nameVi;

    @Column(nullable = false)
    private String nameKm;

    @Column(nullable = false, length = 10)
    private String targetDestination; // e.g. "LHR", "CDG", "SAI", "SIN", "DAD", "BKK", "NRT"

    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Integer displayOrder = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
