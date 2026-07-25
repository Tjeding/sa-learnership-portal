package com.tjeding.portal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds "app.jwt.*" from application.yml.
 *
 * This is configuration scaffolding only for Phase 1 - actual token
 * issuing/parsing endpoints land with the auth feature in Phase 2.
 *
 * secret must be at least 32 characters for HS256; override via the
 * JWT_SECRET environment variable in every real deployment (see .env.example).
 */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        long expirationMs,
        long refreshExpirationMs
) {
}
