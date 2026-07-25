package com.tjeding.portal.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * Standard response envelope for every API endpoint, success or error,
 * so frontend clients always parse the same shape:
 *
 * {
 *   "success": true,
 *   "data": { ... },
 *   "error": null,
 *   "timestamp": "2026-07-25T10:15:30Z"
 * }
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        T data,
        ApiError error,
        Instant timestamp
) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, Instant.now());
    }

    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(true, null, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, new ApiError(code, message, null), Instant.now());
    }

    public static <T> ApiResponse<T> error(String code, String message, Object details) {
        return new ApiResponse<>(false, null, new ApiError(code, message, details), Instant.now());
    }

    public record ApiError(String code, String message, Object details) {
    }
}
