package com.aerosmart.dto.auth;

import com.aerosmart.domain.Role;
import com.aerosmart.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Public view of a {@link User}; never exposes the password hash.
 * Serialises as {@code {"id":1,"fullName":"..","email":"..","role":"ROLE_USER"}}.
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

    public static UserDto from(User user) {
        if (user == null) {
            return null;
        }
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
