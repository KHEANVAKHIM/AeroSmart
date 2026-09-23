package com.aerosmart.service;

import com.aerosmart.domain.User;
import com.aerosmart.dto.auth.ChangePasswordRequest;
import com.aerosmart.dto.auth.UpdateProfileRequest;
import com.aerosmart.dto.auth.UserDto;
import com.aerosmart.exception.ApiException;
import com.aerosmart.repository.UserRepository;
import com.aerosmart.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found."));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateProfile(UserPrincipal principal, UpdateProfileRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found."));

        user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getPassportNo() != null) {
            user.setPassportNo(request.getPassportNo().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        User updated = userRepository.save(user);
        log.info("Updated profile for user id={}", updated.getId());
        return UserDto.from(updated);
    }

    @Transactional
    public void changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found."));

        // If local user with password, verify current password
        if (user.getPassword() != null && request.getCurrentPassword() != null && !request.getCurrentPassword().isBlank()) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Current password does not match.");
            }
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        userRepository.save(user);
        log.info("Password changed successfully for user id={}", user.getId());
    }
}
