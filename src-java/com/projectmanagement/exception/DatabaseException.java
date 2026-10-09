package com.projectmanagement.exception;

/**
 * Custom Exception thrown during JDBC / SQL database execution failures.
 */
public class DatabaseException extends AppException {
    private static final long serialVersionUID = 1L;

    public DatabaseException(String message) {
        super(message);
    }

    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
