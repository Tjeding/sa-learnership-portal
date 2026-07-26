package com.tjeding.portal.auth;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Maps "refresh_tokens" (V9 migration). Stores a SHA-256 hash of the
 * refresh token JWT, never the raw token, so a leaked DB dump doesn't
 * hand out usable tokens.
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    @Transient
    public boolean isActive() {
        return revokedAt == null && expiresAt.isAfter(Instant.now());
    }
}
