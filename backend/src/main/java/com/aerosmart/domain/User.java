package com.aerosmart.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * An application account. Authentication is e-mail based, so {@code email} is unique.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt hash - never store or return the raw password. */
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Role role;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String phone;

    private String passportNo;

    @Column(length = 1000)
    private String avatarUrl;

    @Column(length = 32)
    private String provider; // e.g. "LOCAL", "GOOGLE", "FACEBOOK", "APPLE", "WECHAT"

    @Builder.Default
    private Boolean active = true;
}
