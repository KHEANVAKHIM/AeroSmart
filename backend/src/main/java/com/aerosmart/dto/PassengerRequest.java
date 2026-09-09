package com.aerosmart.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** One traveller on a hold-seat request, bound to a specific seat number. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerRequest {

    @NotBlank(message = "Passenger full name is required")
    private String fullName;

    @NotBlank(message = "Passport number is required")
    private String passportNumber;

    @NotBlank(message = "Seat number is required")
    private String seatNumber;
}
