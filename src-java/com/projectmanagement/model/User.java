package com.projectmanagement.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Base Abstract User Class demonstrating OOP Encapsulation,
 * Inheritance, and Polymorphism for B.Tech CSE Review 1.
 */
public abstract class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String name;
    private String email;
    private String password;
    private String role;
    private Timestamp createdAt;

    public User() {
    }

    public User(int id, String name, String email, String password, String role, Timestamp createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    // Encapsulation: Public getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Polymorphic method overridden by subclasses (Admin, ProjectManager, TeamMember)
     * demonstrating Run-time Polymorphism.
     */
    public abstract String getDashboardUrl();

    public abstract boolean hasPermission(String action);

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
