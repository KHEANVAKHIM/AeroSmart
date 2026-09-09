package com.aerosmart.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {

    @NotBlank(message = "Target email or identifier is required")
    private String email;

    @NotBlank(message = "6-digit OTP code is required")
    private String code;

    private String fullName;

    private String channel; // EMAIL or MESSENGER
}
