package com.aerosmart.dto.checkin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInLookupRequest {

    @NotBlank(message = "Mã đặt chỗ (PNR) không được để trống")
    private String bookingReference;

    private String passengerName;
}
