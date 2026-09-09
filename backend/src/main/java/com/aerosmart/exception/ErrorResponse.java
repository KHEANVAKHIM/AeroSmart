package com.aerosmart.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Uniform error payload:
 * <pre>
 * {"timestamp":"...","status":400,"error":"Bad Request","message":"...","fieldErrors":{"email":"must not be blank"}}
 * </pre>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private LocalDateTime timestamp;

    private int status;

    private String error;

    private String message;

    /** Field name to violation message; empty for non-validation errors. */
    @Builder.Default
    private Map<String, String> fieldErrors = new LinkedHashMap<>();

    public static ErrorResponse of(int status, String error, String message) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .error(error)
                .message(message)
                .fieldErrors(new LinkedHashMap<>())
                .build();
    }
}
