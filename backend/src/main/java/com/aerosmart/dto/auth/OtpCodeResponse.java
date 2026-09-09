package com.aerosmart.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpCodeResponse {
    private boolean success;
    private String message;
    private String channel;
    private String target;
    private String codePreview; // Convenient for testing/demo presentation
}
