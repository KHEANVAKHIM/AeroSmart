package com.aerosmart.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Issues and validates the stateless HS256 access tokens used by the API.
 * <p>
 * Token layout: {@code sub} = e-mail, {@code role} = {@link com.aerosmart.domain.Role} name,
 * {@code uid} = user id, {@code name} = full name.
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    public static final String CLAIM_ROLE = "role";
    public static final String CLAIM_USER_ID = "uid";
    public static final String CLAIM_FULL_NAME = "name";

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${aerosmart.jwt.secret}") String secret,
            @Value("${aerosmart.jwt.expiration-ms:86400000}") long expirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /** Milliseconds a freshly issued token stays valid. */
    public long getExpirationMs() {
        return expirationMs;
    }

    /** Issues a token for an authenticated principal. */
    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(principal.getEmail())
                .claim(CLAIM_ROLE, principal.getRole().name())
                .claim(CLAIM_USER_ID, principal.getId())
                .claim(CLAIM_FULL_NAME, principal.getFullName())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Issues a token for the result of an {@code AuthenticationManager.authenticate(..)} call.
     *
     * @throws IllegalArgumentException if the principal is not a {@link UserPrincipal}
     */
    public String generateToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            throw new IllegalArgumentException(
                    "Unsupported principal type: " + (principal == null ? "null" : principal.getClass().getName()));
        }
        return generateToken((UserPrincipal) principal);
    }

    /** @return the e-mail stored in the token subject. */
    public String getEmailFromToken(String token) {
        return parseClaims(token).getBody().getSubject();
    }

    /** @return the {@code role} claim, or {@code null} when absent. */
    public String getRoleFromToken(String token) {
        Object role = parseClaims(token).getBody().get(CLAIM_ROLE);
        return role == null ? null : role.toString();
    }

    /** @return the {@code uid} claim, or {@code null} when absent. */
    public Long getUserIdFromToken(String token) {
        Object uid = parseClaims(token).getBody().get(CLAIM_USER_ID);
        if (uid == null) {
            return null;
        }
        return uid instanceof Number ? ((Number) uid).longValue() : Long.valueOf(uid.toString());
    }

    /** @return {@code true} when the token is well formed, correctly signed and unexpired. */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {
            log.debug("Rejected expired JWT: {}", ex.getMessage());
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Rejected invalid JWT: {}", ex.getMessage());
        }
        return false;
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);
    }
}
