package com.tjeding.portal.profile.dto;

import java.time.Instant;

public record FileUploadResponse(
        String fileUrl,
        String originalFilename,
        long sizeBytes,
        Instant uploadedAt
) {
}
