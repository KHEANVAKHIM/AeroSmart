package com.aerosmart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDealDto {
    private Long id;

    @NotBlank(message = "Origin airport code is required")
    private String origin;

    @NotBlank(message = "Destination airport code is required")
    private String destination;

    @NotBlank(message = "English title is required")
    private String titleEn;

    private String titleVi;
    private String titleKm;

    @NotBlank(message = "Category is required (INTERNATIONAL or DOMESTIC)")
    private String category;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String datesEn;
    private String datesVi;
    private String datesKm;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Integer displayOrder = 0;
}
