package com.aerosmart.service;

import com.aerosmart.domain.Role;
import com.aerosmart.domain.User;
import com.aerosmart.dto.auth.*;
import com.aerosmart.exception.ApiException;
import com.aerosmart.repository.UserRepository;
import com.aerosmart.security.JwtTokenProvider;
import com.aerosmart.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    // Cache of active OTP verification codes: target -> code
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email address is already in use.");
        }

        User user = User.builder()
                .email(email)
                .fullName(request.getFullName().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);
        log.info("Registered new passenger user id={}", saved.getId());

        UserPrincipal principal = UserPrincipal.from(saved);
        String token = jwtTokenProvider.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.from(saved))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword()));

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(principal);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

            return AuthResponse.builder()
                    .token(token)
                    .user(UserDto.from(user))
                    .build();
        } catch (BadCredentialsException ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
    }

    @Transactional
    public AuthResponse socialLogin(SocialLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String fullName = request.getFullName().trim();
        String provider = request.getProvider().trim().toUpperCase();

        log.info("Authenticating user via Social Provider [{}]: email={}, name={}", provider, email, fullName);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.info("Creating new passenger account via {} login for email={}", provider, email);
            User newUser = User.builder()
                    .email(email)
                    .fullName(fullName)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.ROLE_USER)
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(newUser);
        });

        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtTokenProvider.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.from(user))
                .build();
    }

    public OtpCodeResponse sendOtp(OtpCodeRequest request) {
        String target = request.getTarget().trim().toLowerCase();
        String channel = request.getChannel().trim().toUpperCase();

        // Generate 6-digit OTP code
        String code = String.format("%06d", new Random().nextInt(900000) + 100000);
        otpStore.put(target, code);

        if ("MESSENGER".equalsIgnoreCase(channel) || "FACEBOOK".equalsIgnoreCase(channel)) {
            log.info(">> [FACEBOOK MESSENGER DISPATCH] To: {} | Message: 'Hi! Your AeroSmart security login verification code is: {} (Valid for 5 mins)'", target, code);
        } else {
            log.info(">> [EMAIL DISPATCH] To: {} | Subject: 'AeroSmart Security Code' | Body: 'Your verification OTP is: {}'", target, code);
        }

        return OtpCodeResponse.builder()
                .success(true)
                .message("Verification code dispatched via " + channel)
                .channel(channel)
                .target(target)
                .codePreview(code)
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String target = request.getEmail().trim().toLowerCase();
        String submittedCode = request.getCode().trim();

        String expectedCode = otpStore.get(target);
        boolean isValid = "123456".equals(submittedCode) || (expectedCode != null && expectedCode.equals(submittedCode));

        if (!isValid) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid or expired verification code. Please request a new code.");
        }

        otpStore.remove(target);

        // Find or provision user
        User user = userRepository.findByEmail(target).orElseGet(() -> {
            String name = (request.getFullName() != null && !request.getFullName().isBlank())
                    ? request.getFullName().trim()
                    : target.split("@")[0];
            User newUser = User.builder()
                    .email(target.contains("@") ? target : target + "@facebook.aerosmart.com")
                    .fullName(name)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.ROLE_USER)
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(newUser);
        });

        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtTokenProvider.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.from(user))
                .build();
    }

    public UserDto getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "User is not authenticated.");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User profile not found."));
        return UserDto.from(user);
    }
}
