package com.aerosmart.dto.checkin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInSubmitRequest {

    @NotBlank(message = "Mã đặt chỗ (PNR) không được để trống")
    private String bookingReference;

    @NotNull(message = "Passenger ID không được để trống")
    private Long passengerId;

    private String newSeatNumber;

    private Boolean dangerousGoodsAccepted;
}
