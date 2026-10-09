package com.projectmanagement.model;

import java.sql.Timestamp;

/**
 * Concrete TeamMember Model demonstrating OOP Inheritance and Polymorphism.
 */
public class TeamMember extends User {
    private static final long serialVersionUID = 1L;

    public TeamMember() {
        super();
        setRole("TEAM_MEMBER");
    }

    public TeamMember(int id, String name, String email, String password, Timestamp createdAt) {
        super(id, name, email, password, "TEAM_MEMBER", createdAt);
    }

    @Override
    public String getDashboardUrl() {
        return "/member/dashboard.jsp";
    }

    @Override
    public boolean hasPermission(String action) {
        // Team member can only view assigned projects, view assigned tasks, update task status, update own profile
        return "VIEW_TASKS".equals(action) || "UPDATE_TASK_STATUS".equals(action) || "UPDATE_PROFILE".equals(action) || "VIEW_PROJECTS".equals(action);
    }
}
