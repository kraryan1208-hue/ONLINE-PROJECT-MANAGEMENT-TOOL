package com.projectmanagement.util;

import com.projectmanagement.exception.DatabaseException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Reusable JDBC Database Connection Utility.
 * Demonstrates:
 * - Singleton Connection Factory Pattern
 * - JDBC Driver Registration (com.mysql.cj.jdbc.Driver)
 * - Safe connection lifecycle management
 * - Custom Exception Handling
 */
public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/project_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root"; // Configured per MySQL installation

    static {
        try {
            // Load MySQL JDBC Type-4 Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Fatal: MySQL JDBC Driver not found in classpath. Ensure mysql-connector-j jar is present.", e);
        }
    }

    private DBConnection() {
        // Private constructor prevents external instantiation
    }

    /**
     * Obtains a dedicated JDBC Connection to MySQL database.
     * @return java.sql.Connection
     * @throws DatabaseException on connection failure
     */
    public static Connection getConnection() throws DatabaseException {
        try {
            Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            return conn;
        } catch (SQLException e) {
            throw new DatabaseException("Failed to establish JDBC Connection to MySQL database at " + URL, e);
        }
    }

    /**
     * Safely closes open AutoCloseable resources (Connection, PreparedStatement, ResultSet)
     * preventing resource leaks.
     */
    public static void close(AutoCloseable... resources) {
        for (AutoCloseable res : resources) {
            if (res != null) {
                try {
                    res.close();
                } catch (Exception ignored) {
                    // Resource closure cleanup
                }
            }
        }
    }
}
