package com.projectmanagement.controller;

import com.projectmanagement.dao.TaskDAO;
import com.projectmanagement.dao.TaskDAOImpl;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Task;
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
 * TaskServlet handles Task lifecycle, assignments, and status transitions.
 */
@WebServlet(name = "TaskServlet", urlPatterns = {"/tasks", "/manager/tasks", "/member/tasks"})
public class TaskServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private TaskDAO taskDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        this.taskDAO = new TaskDAOImpl();
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
                    handleDeleteTask(request, response);
                    break;
                case "updateStatus":
                    handleUpdateStatus(request, response);
                    break;
                case "list":
                default:
                    handleListTasks(request, response);
                    break;
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Task error: " + e.getMessage());
            request.getRequestDispatcher("/manager/tasks.jsp").forward(request, response);
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
            if ("updateStatus".equalsIgnoreCase(action)) {
                handleUpdateStatus(request, response);
            } else if ("update".equalsIgnoreCase(action)) {
                handleUpdateTask(request, response);
            } else {
                handleCreateTask(request, response);
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Task operation failed: " + e.getMessage());
            request.getRequestDispatcher("/manager/tasks.jsp").forward(request, response);
        }
    }

    private void handleListTasks(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, ServletException, IOException {
        HttpSession session = request.getSession(false);
        String role = (String) session.getAttribute("userRole");
        int userId = (int) session.getAttribute("userId");

        String status = request.getParameter("status");
        String priority = request.getParameter("priority");
        String query = request.getParameter("query");

        List<Task> tasks;
        if ("TEAM_MEMBER".equalsIgnoreCase(role)) {
            // Filter tasks assigned to current member
            tasks = taskDAO.filterTasks(query, status, priority, null, userId);
            request.setAttribute("tasks", tasks);
            request.getRequestDispatcher("/member/tasks.jsp").forward(request, response);
        } else {
            // PM and Admin view
            tasks = taskDAO.filterTasks(query, status, priority, null, null);
            request.setAttribute("tasks", tasks);
            request.getRequestDispatcher("/manager/tasks.jsp").forward(request, response);
        }
    }

    private void handleCreateTask(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int currentUserId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        String title = request.getParameter("title");
        String description = request.getParameter("description");
        int projectId = Integer.parseInt(request.getParameter("projectId"));
        int assignedTo = Integer.parseInt(request.getParameter("assignedTo"));
        String priority = request.getParameter("priority");
        Date deadline = Date.valueOf(request.getParameter("deadline"));
        String status = request.getParameter("status");

        Task task = new Task(0, title, description, projectId, assignedTo, priority, deadline, status != null ? status : "Pending");
        taskDAO.createTask(task);

        AuditLogThread.logAsync(currentUserId, role + " created task '" + title + "' for project ID " + projectId);
        response.sendRedirect(request.getContextPath() + "/tasks?success=Task+created+successfully");
    }

    private void handleUpdateTask(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int currentUserId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        int id = Integer.parseInt(request.getParameter("id"));
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        int projectId = Integer.parseInt(request.getParameter("projectId"));
        int assignedTo = Integer.parseInt(request.getParameter("assignedTo"));
        String priority = request.getParameter("priority");
        Date deadline = Date.valueOf(request.getParameter("deadline"));
        String status = request.getParameter("status");

        Task task = new Task(id, title, description, projectId, assignedTo, priority, deadline, status);
        taskDAO.updateTask(task);

        AuditLogThread.logAsync(currentUserId, role + " updated task ID " + id + " ('" + title + "')");
        response.sendRedirect(request.getContextPath() + "/tasks?success=Task+updated+successfully");
    }

    private void handleUpdateStatus(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int currentUserId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        int id = Integer.parseInt(request.getParameter("id"));
        String newStatus = request.getParameter("status");

        taskDAO.updateTaskStatus(id, newStatus);
        AuditLogThread.logAsync(currentUserId, role + " updated status of task ID " + id + " to " + newStatus);

        String redirectUrl = "TEAM_MEMBER".equalsIgnoreCase(role) ? "/member/tasks.jsp?success=Status+updated" : "/tasks?success=Status+updated";
        response.sendRedirect(request.getContextPath() + redirectUrl);
    }

    private void handleDeleteTask(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        HttpSession session = request.getSession(false);
        int currentUserId = (int) session.getAttribute("userId");
        String role = (String) session.getAttribute("userRole");

        int id = Integer.parseInt(request.getParameter("id"));
        taskDAO.deleteTask(id);

        AuditLogThread.logAsync(currentUserId, role + " deleted task ID " + id);
        response.sendRedirect(request.getContextPath() + "/tasks?success=Task+deleted+successfully");
    }
}
