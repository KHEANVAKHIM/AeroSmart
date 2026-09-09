package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Full seat map for one flight, ordered by seat number. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightSeatMapDto {

    private Long flightId;
    private String flightNumber;
    private List<SeatDto> seats;
}
