package com.aerosmart.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CountrySpotlightDto {
    private Long id;

    @NotBlank(message = "Country code is required (e.g. gb, fr, kh, vn)")
    private String countryCode;

    @NotBlank(message = "English name is required")
    private String nameEn;

    private String nameVi;
    private String nameKm;

    @NotBlank(message = "Target destination airport code is required")
    private String targetDestination;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Integer displayOrder = 0;
}
