package com.aerosmart.controller;

import com.aerosmart.dto.auth.ChangePasswordRequest;
import com.aerosmart.dto.auth.UpdateProfileRequest;
import com.aerosmart.dto.auth.UserDto;
import com.aerosmart.security.UserPrincipal;
import com.aerosmart.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto profile = userService.getProfile(principal);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updated = userService.updateProfile(principal, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal, request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }
}
