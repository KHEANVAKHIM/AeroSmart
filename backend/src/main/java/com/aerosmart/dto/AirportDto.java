package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Airport projection returned by the public airport and flight endpoints. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AirportDto {

    private String code;
    private String name;
    private String city;
    private String country;
}
