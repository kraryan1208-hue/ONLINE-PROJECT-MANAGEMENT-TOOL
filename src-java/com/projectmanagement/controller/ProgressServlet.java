package com.projectmanagement.controller;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.ProjectProgress;
import com.projectmanagement.service.ProjectService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

/**
 * ProgressServlet provides dynamic calculation metrics for Pie/Doughnut charts
 * and percentage progress bars.
 * Formula: Project Completion Percentage = (Completed Tasks / Total Tasks) * 100
 */
@WebServlet(name = "ProgressServlet", urlPatterns = {"/progress", "/api/progress-data"})
public class ProgressServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ProjectService projectService;

    @Override
    public void init() throws ServletException {
        super.init();
        this.projectService = new ProjectService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String projectIdParam = request.getParameter("projectId");
            Integer projectId = (projectIdParam != null && !projectIdParam.isEmpty()) ? Integer.parseInt(projectIdParam) : null;

            Map<String, Integer> chartDistribution = projectService.getPieChartDistribution(projectId);
            List<ProjectProgress> progressList = projectService.getAllProjectProgressReports();
            Map<String, Object> summary = projectService.getSystemSummary();

            // Build JSON output
            StringBuilder json = new StringBuilder("{");
            json.append("\"pieChart\":{");
            json.append("\"completed\":").append(chartDistribution.getOrDefault("Completed", 0)).append(",");
            json.append("\"inProgress\":").append(chartDistribution.getOrDefault("In Progress", 0)).append(",");
            json.append("\"pending\":").append(chartDistribution.getOrDefault("Pending", 0));
            json.append("},");

            json.append("\"summary\":{");
            json.append("\"totalProjects\":").append(summary.get("totalProjects")).append(",");
            json.append("\"activeProjects\":").append(summary.get("activeProjects")).append(",");
            json.append("\"totalTasks\":").append(summary.get("totalTasks")).append(",");
            json.append("\"completedTasks\":").append(summary.get("completedTasks")).append(",");
            json.append("\"pendingTasks\":").append(summary.get("pendingTasks")).append(",");
            json.append("\"overallProgress\":").append(summary.get("overallProgress"));
            json.append("},");

            json.append("\"projects\":[");
            for (int i = 0; i < progressList.size(); i++) {
                ProjectProgress pp = progressList.get(i);
                json.append("{");
                json.append("\"id\":").append(pp.getProjectId()).append(",");
                json.append("\"title\":\"").append(pp.getProjectTitle().replace("\"", "\\\"")).append("\",");
                json.append("\"totalTasks\":").append(pp.getTotalTasks()).append(",");
                json.append("\"completedTasks\":").append(pp.getCompletedTasks()).append(",");
                json.append("\"inProgressTasks\":").append(pp.getInProgressTasks()).append(",");
                json.append("\"pendingTasks\":").append(pp.getPendingTasks()).append(",");
                json.append("\"percentage\":").append(pp.getCompletionPercentage());
                json.append("}");
                if (i < progressList.size() - 1) json.append(",");
            }
            json.append("]}");

            out.print(json.toString());
            out.flush();

        } catch (DatabaseException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Database calculation error: " + e.getMessage() + "\"}");
        }
    }
}
