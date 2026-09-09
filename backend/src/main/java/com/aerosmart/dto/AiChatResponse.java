package com.aerosmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatResponse {

    private String reply;

    private String conversationId;

    @Builder.Default
    private List<ToolCallDto> toolCalls = new ArrayList<>();

    @Builder.Default
    private List<FlightDto> flights = new ArrayList<>();

    @Builder.Default
    private List<String> suggestions = new ArrayList<>();
}
