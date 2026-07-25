package com.tjeding.portal.common.exception;

/**
 * Thrown for invalid client input or a violated business rule
 * (e.g. applying to a closed opportunity). Mapped to HTTP 400 by
 * GlobalExceptionHandler.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
