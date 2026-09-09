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
public class OtpCodeRequest {

    @NotBlank(message = "Channel is required (EMAIL or MESSENGER)")
    private String channel;

    @NotBlank(message = "Destination target (email or Facebook handle) is required")
    private String target;

    private String purpose; // LOGIN or REGISTER
}
