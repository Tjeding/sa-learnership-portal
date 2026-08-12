package com.tjeding.portal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binds "app.storage.*" from application.yml. Local-disk storage for
 * now; swap FileStorageService's implementation for an S3/GCS client
 * later without touching callers.
 */
@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(
        String uploadDir,
        long maxCvSizeBytes,
        long maxImageSizeBytes
) {
}
