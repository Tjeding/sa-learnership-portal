package com.tjeding.portal.auth.dto;

import com.tjeding.portal.user.UserRole;

public record UserMeResponse(
        Long id,
        String email,
        UserRole role,
        boolean verified,
        String displayName
) {
}
