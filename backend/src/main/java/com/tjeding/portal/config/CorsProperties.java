package com.tjeding.portal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Binds "app.cors.*" from application.yml.
 * allowedOrigins is a comma-separated list, e.g.
 * "http://localhost:5173,https://portal.example.co.za"
 */
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(String allowedOrigins) {

    public List<String> allowedOriginsList() {
        if (allowedOrigins == null || allowedOrigins.isBlank()) {
            return List.of();
        }
        return List.of(allowedOrigins.split(","));
    }
}
