package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

/** A tool (function call) that AeroMate executed while answering, echoed back for transparency. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ToolCallDto {

    /** Tool name, e.g. {@code searchFlights} or {@code checkFlightStatus}. */
    private String tool;

    @Builder.Default
    private Map<String, String> arguments = new LinkedHashMap<>();
}
