package com.projectmanagement.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Activity Model representing activities audit feed in MySQL database.
 */
public class Activity implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private String userName;
    private String userRole;
    private String activity;
    private Timestamp createdAt;

    public Activity() {
    }

    public Activity(int id, int userId, String activity, Timestamp createdAt) {
        this.id = id;
        this.userId = userId;
        this.activity = activity;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
