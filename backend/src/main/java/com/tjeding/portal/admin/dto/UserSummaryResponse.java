package com.tjeding.portal.admin.dto;

import com.tjeding.portal.user.UserRole;

import java.time.Instant;

public record UserSummaryResponse(
        Long id,
        String email,
        UserRole role,
        boolean active,
        boolean verified,
        String displayName,
        Instant lastLoginAt,
        Instant createdAt
) {
}
