package com.aerosmart.controller;

import com.aerosmart.dto.AiChatRequest;
import com.aerosmart.dto.AiChatResponse;
import com.aerosmart.service.AiConciergeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiConciergeService aiConciergeService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiConciergeService.chat(request);
        return ResponseEntity.ok(response);
    }
}
