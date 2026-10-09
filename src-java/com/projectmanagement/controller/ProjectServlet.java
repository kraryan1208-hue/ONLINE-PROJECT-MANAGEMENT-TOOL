package com.projectmanagement.controller;

import com.projectmanagement.dao.ProjectDAO;
import com.projectmanagement.dao.ProjectDAOImpl;
import com.projectmanagement.dao.UserDAO;
import com.projectmanagement.dao.UserDAOImpl;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Project;
import com.projectmanagement.service.AuditLogThread;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Date;
import java.util.List;

/**
 * ProjectServlet coordinates Project CRUD operations.
 */
@WebServlet(name = "ProjectServlet", urlPatterns = {"/projects", "/manager/projects", "/admin/projects"})
public class ProjectServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private ProjectDAO projectDAO;
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        this.projectDAO = new ProjectDAOImpl();
        this.userDAO = new UserDAOImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) action = "list";

        try {
            switch (action) {
                case "delete":
                    handleDeleteProject(request, response);
                    break;
                case "list":
                default:
                    handleListProjects(request, response);
                    break;
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Project query error: " + e.getMessage());
            request.getRequestDispatcher("/manager/projects.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) action = "create";

        try {
            if ("update".equalsIgnoreCase(action)) {
                handleUpdateProject(request, response);
            } else {
                handleCreateProject(request, response);
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Failed to save project: " + e.getMessage());
            request.getRequestDispatcher("/manager/projects.jsp").forward(request, response);
        }
    }

    private void handleListProjects(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, ServletException, IOException {
        HttpSession session = request.getSession(false);
        String role = (String) session.getAttribute("userRole");
        int userId = (int) session.getAttribute("userId");

        String query = request.getParameter("query");
        String status = request.getParameter("status");

        List<Project> projectList;
        if ("ADMIN".equalsIgnoreCase(role)) {
            projectList = projectDAO.searchProjects(query, status);
        } else if ("PROJECT_MANAGER".equalsIgnoreCase(role)) {
            projectList = projectDAO.getProjectsByManager(userId);
        } else {
            projectList = projectDAO.getAllProjects();
        }

        request.setAttribute("projects", projectList);
        request.getRequestDispatcher("/manager/projects.jsp").forward(request, response);
    }

    private void handleCreateProject(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        String title = request.getParameter("title");
        String description = request.getParameter("description");
        Date startDate = Date.valueOf(request.getParameter("startDate"));
        Date endDate = Date.valueOf(request.getParameter("endDate"));
        String status = request.getParameter("status");

        int managerId = userId;
        if ("ADMIN".equalsIgnoreCase(role) && request.getParameter("managerId") != null) {
            managerId = Integer.parseInt(request.getParameter("managerId"));
        }

        Project project = new Project(0, title, description, startDate, endDate, status, managerId);
        projectDAO.createProject(project);

        AuditLogThread.logAsync(userId, role + " created project: '" + title + "'");
        response.sendRedirect(request.getContextPath() + "/projects?success=Project+created+successfully");
    }

    private void handleUpdateProject(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        int id = Integer.parseInt(request.getParameter("id"));
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        Date startDate = Date.valueOf(request.getParameter("startDate"));
        Date endDate = Date.valueOf(request.getParameter("endDate"));
        String status = request.getParameter("status");

        Project existing = projectDAO.getProjectById(id);
        if (existing == null) {
            response.sendRedirect(request.getContextPath() + "/projects?error=Project+not+found");
            return;
        }

        existing.setTitle(title);
        existing.setDescription(description);
        existing.setStartDate(startDate);
        existing.setEndDate(endDate);
        existing.setStatus(status);

        projectDAO.updateProject(existing);
        AuditLogThread.logAsync(userId, role + " updated project ID " + id + " ('" + title + "')");

        response.sendRedirect(request.getContextPath() + "/projects?success=Project+updated+successfully");
    }

    private void handleDeleteProject(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        int id = Integer.parseInt(request.getParameter("id"));
        projectDAO.deleteProject(id);

        AuditLogThread.logAsync(userId, role + " deleted project ID " + id);
        response.sendRedirect(request.getContextPath() + "/projects?success=Project+deleted+successfully");
    }
}
