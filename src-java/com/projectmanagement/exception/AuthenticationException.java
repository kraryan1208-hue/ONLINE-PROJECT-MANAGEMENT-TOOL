package com.projectmanagement.exception;

/**
 * Custom Exception thrown for invalid credentials or session expiration.
 */
public class AuthenticationException extends AppException {
    private static final long serialVersionUID = 1L;

    public AuthenticationException(String message) {
        super(message);
    }
}
