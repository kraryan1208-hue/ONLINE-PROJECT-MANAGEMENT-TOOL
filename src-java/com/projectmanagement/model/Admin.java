package com.projectmanagement.model;

import java.sql.Timestamp;

/**
 * Concrete Admin Model demonstrating OOP Inheritance and Polymorphism.
 */
public class Admin extends User {
    private static final long serialVersionUID = 1L;

    public Admin() {
        super();
        setRole("ADMIN");
    }

    public Admin(int id, String name, String email, String password, Timestamp createdAt) {
        super(id, name, email, password, "ADMIN", createdAt);
    }

    @Override
    public String getDashboardUrl() {
        return "/admin/dashboard.jsp";
    }

    @Override
    public boolean hasPermission(String action) {
        // Admin has superuser privileges across all actions
        return true;
    }
}
