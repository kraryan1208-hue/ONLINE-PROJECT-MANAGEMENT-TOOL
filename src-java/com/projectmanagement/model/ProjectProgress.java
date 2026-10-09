package com.projectmanagement.model;

import java.io.Serializable;

/**
 * ProjectProgress encapsulates dynamic progress math and task breakdowns
 * strictly satisfying Section 13 & 15 of Project Review 1 Requirements:
 * Formula: Project Completion Percentage = (Completed Tasks / Total Tasks) * 100
 */
public class ProjectProgress implements Serializable {
    private static final long serialVersionUID = 1L;

    private int projectId;
    private String projectTitle;
    private int totalTasks;
    private int completedTasks;
    private int inProgressTasks;
    private int pendingTasks;
    private double completionPercentage;

    public ProjectProgress(int projectId, String projectTitle, int totalTasks, int completedTasks, int inProgressTasks, int pendingTasks) {
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.inProgressTasks = inProgressTasks;
        this.pendingTasks = pendingTasks;
        this.completionPercentage = calculateProgress();
    }

    /**
     * Core dynamic formula: Completed Tasks / Total Tasks * 100
     */
    private double calculateProgress() {
        if (this.totalTasks == 0) {
            return 0.0;
        }
        return Math.round(((double) this.completedTasks / this.totalTasks) * 100.0 * 10.0) / 10.0;
    }

    public int getProjectId() {
        return projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public int getTotalTasks() {
        return totalTasks;
    }

    public int getCompletedTasks() {
        return completedTasks;
    }

    public int getInProgressTasks() {
        return inProgressTasks;
    }

    public int getPendingTasks() {
        return pendingTasks;
    }

    public double getCompletionPercentage() {
        return completionPercentage;
    }
}
