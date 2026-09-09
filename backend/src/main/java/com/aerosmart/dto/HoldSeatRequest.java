package com.aerosmart.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Request to place a temporary 15-minute hold on one or more seats. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HoldSeatRequest {

    @NotNull(message = "flightId is required")
    private Long flightId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<String> seatNumbers;

    @NotEmpty(message = "At least one passenger is required")
    @Valid
    private List<PassengerRequest> passengers;
}
