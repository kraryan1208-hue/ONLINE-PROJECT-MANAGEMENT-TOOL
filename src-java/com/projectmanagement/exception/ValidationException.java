package com.projectmanagement.exception;

/**
 * Custom Exception thrown when input data validation fails.
 */
public class ValidationException extends AppException {
    private static final long serialVersionUID = 1L;

    public ValidationException(String message) {
        super(message);
    }
}
