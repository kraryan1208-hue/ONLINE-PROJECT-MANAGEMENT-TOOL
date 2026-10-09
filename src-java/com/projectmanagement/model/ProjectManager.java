package com.projectmanagement.model;

import java.sql.Timestamp;

/**
 * Concrete ProjectManager Model demonstrating OOP Inheritance and Polymorphism.
 */
public class ProjectManager extends User {
    private static final long serialVersionUID = 1L;

    public ProjectManager() {
        super();
        setRole("PROJECT_MANAGER");
    }

    public ProjectManager(int id, String name, String email, String password, Timestamp createdAt) {
        super(id, name, email, password, "PROJECT_MANAGER", createdAt);
    }

    @Override
    public String getDashboardUrl() {
        return "/manager/dashboard.jsp";
    }

    @Override
    public boolean hasPermission(String action) {
        if ("MANAGE_USERS".equals(action) || "SYSTEM_SETTINGS".equals(action)) {
            return false;
        }
        return true;
    }
}
