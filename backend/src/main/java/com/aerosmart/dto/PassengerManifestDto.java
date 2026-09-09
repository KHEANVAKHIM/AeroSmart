package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerManifestDto {

    private Long flightId;
    private String flightNumber;
    private String airline;
    private String origin;
    private String destination;
    private String departureTime;
    private int totalPassengers;

    @Builder.Default
    private List<PassengerDto> passengers = new ArrayList<>();
}
