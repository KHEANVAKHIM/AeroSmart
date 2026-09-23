package com.aerosmart.dto.auth;

import com.aerosmart.domain.Role;
import com.aerosmart.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Public view of a {@link User}; never exposes the password hash.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String phone;
    private String passportNo;
    private String avatarUrl;
    private String provider;
    private Boolean active;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        if (user == null) {
            return null;
        }
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .passportNo(user.getPassportNo())
                .avatarUrl(user.getAvatarUrl())
                .provider(user.getProvider() != null ? user.getProvider() : "LOCAL")
                .active(user.getActive() != null ? user.getActive() : true)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
