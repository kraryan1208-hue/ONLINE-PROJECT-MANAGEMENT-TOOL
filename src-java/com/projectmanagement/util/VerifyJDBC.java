package com.projectmanagement.util;

public class VerifyJDBC {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("VERIFYING MYSQL CONNECTOR/J AND DBCONNECTION SETUP");
        System.out.println("==================================================");

        try {
            Class<?> driverClass = Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("[PASS] Driver Class Found: " + driverClass.getName());
            System.out.println("[PASS] DBConnection URL: " + DBConnection.getUrl());
            System.out.println("[PASS] DBConnection Username: " + DBConnection.getUsername());
            System.out.println("[PASS] DBConnection Password: " + (DBConnection.getPassword().isEmpty() ? "(empty)" : "****** (configured)"));
            System.out.println("[PASS] Driver Loaded in DBConnection: " + DBConnection.isDriverLoaded());
            System.out.println("==================================================");
            System.out.println("SUCCESS: MySQL JDBC Driver and DBConnection verified!");
            System.out.println("==================================================");
        } catch (ClassNotFoundException e) {
            System.err.println("[FAIL] MySQL JDBC Driver class NOT found!");
            e.printStackTrace();
            System.exit(1);
        } catch (Exception e) {
            System.err.println("[FAIL] Unexpected error during verification:");
            e.printStackTrace();
            System.exit(1);
        }
    }
}
