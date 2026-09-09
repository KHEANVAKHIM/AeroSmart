package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Passenger projection including the seat assigned to them. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerDto {

    private Long id;
    private String fullName;
    private String passportNumber;
    private String seatNumber;
    /** {@code ECONOMY} or {@code BUSINESS}. */
    private String seatClass;
}
