package com.tjeding.portal.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds,
        UserMeResponse user
) {
    public static AuthResponse of(String accessToken, String refreshToken, long expiresInSeconds, UserMeResponse user) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresInSeconds, user);
    }
}
