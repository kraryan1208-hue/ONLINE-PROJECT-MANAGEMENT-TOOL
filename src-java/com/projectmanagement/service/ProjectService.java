package com.projectmanagement.service;

import com.projectmanagement.dao.ProjectDAO;
import com.projectmanagement.dao.ProjectDAOImpl;
import com.projectmanagement.dao.TaskDAO;
import com.projectmanagement.dao.TaskDAOImpl;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.ProjectProgress;
import com.projectmanagement.model.Task;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProjectService handles business rules and dynamic calculations.
 * Demonstrates:
 * - Core Java Collections (ArrayList, HashMap, Map, List)
 * - Dynamic Progress Formula: (Completed Tasks / Total Tasks) * 100
 * - Exception Handling propagation
 */
public class ProjectService {

    private final ProjectDAO projectDAO;
    private final TaskDAO taskDAO;

    public ProjectService() {
        this.projectDAO = new ProjectDAOImpl();
        this.taskDAO = new TaskDAOImpl();
    }

    public ProjectService(ProjectDAO projectDAO, TaskDAO taskDAO) {
        this.projectDAO = projectDAO;
        this.taskDAO = taskDAO;
    }

    /**
     * Dynamically calculates project completion metrics.
     * Guaranteed NO fake or static values.
     */
    public ProjectProgress calculateProjectProgress(int projectId) throws DatabaseException {
        Project project = projectDAO.getProjectById(projectId);
        if (project == null) {
            return null;
        }

        List<Task> tasks = taskDAO.getTasksByProject(projectId);
        int total = tasks.size();
        int completed = 0;
        int inProgress = 0;
        int pending = 0;

        for (Task t : tasks) {
            if ("Completed".equalsIgnoreCase(t.getStatus())) {
                completed++;
            } else if ("In Progress".equalsIgnoreCase(t.getStatus())) {
                inProgress++;
            } else {
                pending++;
            }
        }

        return new ProjectProgress(project.getId(), project.getTitle(), total, completed, inProgress, pending);
    }

    /**
     * Aggregates all project reports with percentage progress calculations.
     */
    public List<ProjectProgress> getAllProjectProgressReports() throws DatabaseException {
        List<Project> projects = projectDAO.getAllProjects();
        List<ProjectProgress> reports = new ArrayList<>();

        for (Project p : projects) {
            reports.add(new ProjectProgress(
                p.getId(),
                p.getTitle(),
                p.getTotalTasks(),
                p.getCompletedTasks(),
                p.getInProgressTasks(),
                p.getPendingTasks()
            ));
        }

        return reports;
    }

    /**
     * Calculates task status distribution for Doughnut / Pie Chart.
     * Returns Map with keys: "Completed", "In Progress", "Pending"
     */
    public Map<String, Integer> getPieChartDistribution(Integer projectId) throws DatabaseException {
        return taskDAO.getTaskStatusDistribution(projectId);
    }

    /**
     * Returns overall system summary metrics.
     */
    public Map<String, Object> getSystemSummary() throws DatabaseException {
        Map<String, Object> summary = new HashMap<>();
        int totalProjects = projectDAO.getTotalProjectsCount();
        int activeProjects = projectDAO.getActiveProjectsCount();
        int totalTasks = taskDAO.getTotalTasksCount();
        int completedTasks = taskDAO.getCompletedTasksCount();
        int pendingTasks = taskDAO.getPendingTasksCount();

        double overallProgress = totalTasks > 0 ? Math.round(((double) completedTasks / totalTasks) * 100.0 * 10.0) / 10.0 : 0.0;

        summary.put("totalProjects", totalProjects);
        summary.put("activeProjects", activeProjects);
        summary.put("totalTasks", totalTasks);
        summary.put("completedTasks", completedTasks);
        summary.put("pendingTasks", pendingTasks);
        summary.put("overallProgress", overallProgress);

        return summary;
    }
}
