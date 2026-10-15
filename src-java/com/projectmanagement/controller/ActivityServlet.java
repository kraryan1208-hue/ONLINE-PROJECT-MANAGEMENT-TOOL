package com.projectmanagement.controller;

import com.projectmanagement.dao.ActivityDAO;
import com.projectmanagement.dao.ActivityDAOImpl;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Activity;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * ActivityServlet provides recent audit logs from MySQL activities table.
 */
@WebServlet(name = "ActivityServlet", urlPatterns = {"/activities", "/api/activities"})
public class ActivityServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ActivityDAO activityDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        this.activityDAO = new ActivityDAOImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        try {
            int limit = 50;
            String limitParam = request.getParameter("limit");
            if (limitParam != null && !limitParam.trim().isEmpty()) {
                try {
                    limit = Integer.parseInt(limitParam);
                } catch (NumberFormatException ignored) {}
            }

            List<Activity> activities = activityDAO.getRecentActivities(limit);

            if (request.getRequestURI().endsWith("/api/activities")) {
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < activities.size(); i++) {
                    Activity a = activities.get(i);
                    json.append("{")
                        .append("\"id\":").append(a.getId()).append(",")
                        .append("\"userId\":").append(a.getUserId()).append(",")
                        .append("\"userName\":\"").append(a.getUserName() != null ? a.getUserName().replace("\"", "\\\"") : "System").append("\",")
                        .append("\"userRole\":\"").append(a.getUserRole() != null ? a.getUserRole() : "SYSTEM").append("\",")
                        .append("\"activity\":\"").append(a.getActivity() != null ? a.getActivity().replace("\"", "\\\"") : "").append("\",")
                        .append("\"createdAt\":\"").append(a.getCreatedAt() != null ? a.getCreatedAt().toString() : "").append("\"")
                        .append("}");
                    if (i < activities.size() - 1) json.append(",");
                }
                json.append("]");
                out.print(json.toString());
                out.flush();
                return;
            }

            request.setAttribute("activities", activities);
            request.getRequestDispatcher("/common/activities.jsp").forward(request, response);

        } catch (DatabaseException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            if (request.getRequestURI().endsWith("/api/activities")) {
                response.getWriter().print("{\"error\":\"Database error: " + e.getMessage() + "\"}");
            } else {
                request.setAttribute("errorMessage", "Error loading activities: " + e.getMessage());
                request.getRequestDispatcher("/login.jsp").forward(request, response);
            }
        }
    }
}
