package com.projectmanagement.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * Task Model representing tasks table in MySQL database.
 */
public class Task implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String title;
    private String description;
    private int projectId;
    private String projectTitle;
    private int assignedTo;
    private String assigneeName;
    private String priority; // Low, Medium, High
    private Date deadline;
    private String status; // Pending, In Progress, Completed
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Task() {
    }

    public Task(int id, String title, String description, int projectId, int assignedTo, String priority, Date deadline, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.assignedTo = assignedTo;
        this.priority = priority;
        this.deadline = deadline;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public int getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(int assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
