package com.aerosmart.dto.auth;

import com.aerosmart.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest {

    private String fullName;

    private String email;

    private String password;

    private Role role;

    private String phone;

    private String passportNo;

    private String avatarUrl;

    private String provider;

    private Boolean active;
}
