package com.tjeding.portal.common.exception;

/**
 * Thrown when an authenticated user is not permitted to perform an
 * action on a given resource (e.g. a provider trying to edit another
 * provider's opportunity). Mapped to HTTP 403 by GlobalExceptionHandler.
 */
public class ForbiddenActionException extends RuntimeException {

    public ForbiddenActionException(String message) {
        super(message);
    }
}
