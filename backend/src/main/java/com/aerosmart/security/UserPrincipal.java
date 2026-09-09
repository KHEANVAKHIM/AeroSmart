package com.aerosmart.security;

import com.aerosmart.domain.Role;
import com.aerosmart.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

/**
 * Authenticated principal placed in the {@code SecurityContext}.
 * <p>
 * The username is the user's e-mail. Authorities contain exactly one entry, the
 * {@link Role} name, which is already prefixed with {@code ROLE_} so
 * {@code hasRole("ADMIN")} and {@code hasAuthority("ROLE_ADMIN")} both work.
 */
public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String email;
    private final String fullName;
    private final Role role;
    private final String password;

    public UserPrincipal(Long id, String email, String fullName, Role role, String password) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.password = password;
    }

    /** Builds a principal from a persisted user, including the password hash. */
    public static UserPrincipal from(User user) {
        return new UserPrincipal(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getPassword());
    }

    /**
     * Builds a principal from JWT claims. No password hash is available in this case,
     * which is fine because the token itself is the proof of authentication.
     */
    public static UserPrincipal fromClaims(Long id, String email, String fullName, Role role) {
        return new UserPrincipal(id, email, fullName, role, "");
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public Role getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof UserPrincipal)) {
            return false;
        }
        UserPrincipal that = (UserPrincipal) other;
        return Objects.equals(id, that.id) && Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "UserPrincipal{id=" + id + ", email='" + email + "', role=" + role + '}';
    }
}
