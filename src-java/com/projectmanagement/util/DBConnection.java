package com.projectmanagement.util;

import com.projectmanagement.exception.DatabaseException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Reusable JDBC Database Connection Utility for MySQL.
 * Configured for MySQL database: project_management
 * Host: localhost:3306
 * Default user: root
 * Password: Fully configurable via DB_PASSWORD env var, -Ddb.password property, or setPassword()
 * Driver: com.mysql.cj.jdbc.Driver (MySQL Connector/J)
 */
public class DBConnection {

    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/project_management?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String DEFAULT_USERNAME = "root";
    private static final String DEFAULT_PASSWORD = "root";

    private static String customUrl = null;
    private static String customUsername = null;
    private static String customPassword = null;

    private static boolean driverLoaded = false;

    static {
        loadDriver();
    }

    private static synchronized void loadDriver() {
        try {
            // Load MySQL Connector/J Type-4 JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            driverLoaded = true;
        } catch (ClassNotFoundException e) {
            driverLoaded = false;
            throw new RuntimeException("Fatal: MySQL JDBC Driver (com.mysql.cj.jdbc.Driver) not found in classpath. Ensure mysql-connector-j jar is present in pom.xml.", e);
        }
    }

    private DBConnection() {
        // Prevent external instantiation
    }

    /**
     * Resolves the active MySQL JDBC URL.
     */
    public static String getUrl() {
        if (customUrl != null && !customUrl.trim().isEmpty()) {
            return customUrl;
        }
        String env = System.getenv("DB_URL");
        if (env != null && !env.trim().isEmpty()) {
            return env;
        }
        return System.getProperty("db.url", DEFAULT_URL);
    }

    /**
     * Resolves the active MySQL database username (defaults to 'root').
     */
    public static String getUsername() {
        if (customUsername != null && !customUsername.trim().isEmpty()) {
            return customUsername;
        }
        String env = System.getenv("DB_USER");
        if (env != null && !env.trim().isEmpty()) {
            return env;
        }
        return System.getProperty("db.username", DEFAULT_USERNAME);
    }

    /**
     * Resolves the active MySQL database password.
     * Checks custom setting, DB_PASSWORD or MYSQL_PASSWORD env vars, system property -Ddb.password,
     * and falls back to DEFAULT_PASSWORD.
     */
    public static String getPassword() {
        if (customPassword != null) {
            return customPassword;
        }
        String env = System.getenv("DB_PASSWORD");
        if (env != null) {
            return env;
        }
        String mysqlEnv = System.getenv("MYSQL_PASSWORD");
        if (mysqlEnv != null) {
            return mysqlEnv;
        }
        return System.getProperty("db.password", DEFAULT_PASSWORD);
    }

    /**
     * Programmatically override the MySQL JDBC URL.
     */
    public static void setUrl(String url) {
        customUrl = url;
    }

    /**
     * Programmatically override the MySQL username.
     */
    public static void setUsername(String username) {
        customUsername = username;
    }

    /**
     * Programmatically override the MySQL password.
     */
    public static void setPassword(String password) {
        customPassword = password;
    }

    /**
     * Checks if MySQL Connector/J driver is loaded successfully.
     */
    public static boolean isDriverLoaded() {
        return driverLoaded;
    }

    /**
     * Obtains a dedicated JDBC Connection to MySQL project_management database.
     * @return java.sql.Connection
     * @throws DatabaseException on connection failure
     */
    public static Connection getConnection() throws DatabaseException {
        if (!driverLoaded) {
            loadDriver();
        }
        String url = getUrl();
        String user = getUsername();
        String pass = getPassword();

        try {
            return DriverManager.getConnection(url, user, pass);
        } catch (SQLException e) {
            throw new DatabaseException(
                "Failed to establish JDBC Connection to MySQL database.\n" +
                "URL: " + url + "\n" +
                "Username: " + user + "\n" +
                "Error code: " + e.getErrorCode() + "\n" +
                "SQL State: " + e.getSQLState() + "\n" +
                "Message: " + e.getMessage(),
                e
            );
        }
    }

    /**
     * Safely closes open AutoCloseable resources (Connection, Statement, PreparedStatement, ResultSet)
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

    /**
     * Standalone CLI diagnostic runner to verify MySQL driver loading and JDBC connectivity.
     */
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println(" Online Project Management Tool - DB Diagnostic ");
        System.out.println("=================================================");
        System.out.println("1. MySQL Connector/J JDBC Driver: " + (isDriverLoaded() ? "LOADED (com.mysql.cj.jdbc.Driver)" : "NOT LOADED"));
        System.out.println("2. Target JDBC URL: " + getUrl());
        System.out.println("3. Target Username: " + getUsername());
        System.out.println("4. Password configured: " + (getPassword() != null && !getPassword().isEmpty() ? "YES (" + getPassword().length() + " chars)" : "EMPTY / NONE"));
        System.out.println("\nAttempting real JDBC connection to MySQL localhost:3306/project_management...");

        try (Connection conn = getConnection()) {
            System.out.println("\n[SUCCESS] Connected to MySQL database successfully!");
            System.out.println("Database Product: " + conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion());
            System.out.println("Driver Version:   " + conn.getMetaData().getDriverName() + " " + conn.getMetaData().getDriverVersion());
            System.out.println("All JDBC tables in schema:");
            try (java.sql.ResultSet rs = conn.getMetaData().getTables("project_management", null, "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    System.out.println(" - " + rs.getString("TABLE_NAME") + " (" + rs.getString("TABLE_TYPE") + ")");
                }
            }
            System.out.println("\nDatabase verification complete. The application is ready to run!");
        } catch (Exception e) {
            System.err.println("\n[NOTICE] Connection attempt result: " + e.getMessage());
            System.out.println("\nTip: If your local MySQL root password differs, you can pass it via:");
            System.out.println("  java -Ddb.password=YOUR_PASSWORD -jar ... or set DB_PASSWORD=YOUR_PASSWORD");
        }
    }
}

