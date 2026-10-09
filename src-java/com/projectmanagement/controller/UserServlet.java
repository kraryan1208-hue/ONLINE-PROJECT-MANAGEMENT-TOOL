package com.projectmanagement.controller;

import com.projectmanagement.dao.UserDAO;
import com.projectmanagement.dao.UserDAOImpl;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Admin;
import com.projectmanagement.model.ProjectManager;
import com.projectmanagement.model.TeamMember;
import com.projectmanagement.model.User;
import com.projectmanagement.service.AuditLogThread;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

/**
 * UserServlet coordinates User CRUD operations for Administrator.
 * Implements:
 * - doGet() for viewing, searching, and filtering users
 * - doPost() for creating, editing, and deleting users
 */
@WebServlet(name = "UserServlet", urlPatterns = {"/users", "/admin/users"})
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        this.userDAO = new UserDAOImpl();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equalsIgnoreCase((String) session.getAttribute("userRole"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Only Administrators may access User Management.");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) action = "list";

        try {
            switch (action) {
                case "delete":
                    handleDeleteUser(request, response);
                    break;
                case "edit":
                    handleGetEditUser(request, response);
                    break;
                case "search":
                case "list":
                default:
                    handleListUsers(request, response);
                    break;
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Database operation failed: " + e.getMessage());
            request.getRequestDispatcher("/admin/users.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equalsIgnoreCase((String) session.getAttribute("userRole"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied.");
            return;
        }

        String action = request.getParameter("action");
        if (action == null) action = "create";

        try {
            if ("update".equalsIgnoreCase(action)) {
                handleUpdateUser(request, response);
            } else {
                handleCreateUser(request, response);
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Failed to save user: " + e.getMessage());
            request.getRequestDispatcher("/admin/users.jsp").forward(request, response);
        }
    }

    private void handleListUsers(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, ServletException, IOException {
        String query = request.getParameter("query");
        String role = request.getParameter("role");

        List<User> userList = userDAO.searchUsers(query, role);
        request.setAttribute("users", userList);
        request.setAttribute("searchQuery", query);
        request.setAttribute("selectedRole", role);
        request.getRequestDispatcher("/admin/users.jsp").forward(request, response);
    }

    private void handleGetEditUser(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        User user = userDAO.getUserById(id);
        request.setAttribute("editUser", user);
        request.getRequestDispatcher("/admin/edit-user.jsp").forward(request, response);
    }

    private void handleCreateUser(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String role = request.getParameter("role");

        User user;
        if ("ADMIN".equalsIgnoreCase(role)) {
            user = new Admin(0, name, email, password, null);
        } else if ("PROJECT_MANAGER".equalsIgnoreCase(role)) {
            user = new ProjectManager(0, name, email, password, null);
        } else {
            user = new TeamMember(0, name, email, password, null);
        }

        userDAO.createUser(user);

        HttpSession session = request.getSession(false);
        int adminId = (int) session.getAttribute("userId");
        AuditLogThread.logAsync(adminId, "Admin created new user '" + name + "' with role " + role);

        response.sendRedirect(request.getContextPath() + "/users?success=User+created+successfully");
    }

    private void handleUpdateUser(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String role = request.getParameter("role");

        User user;
        if ("ADMIN".equalsIgnoreCase(role)) {
            user = new Admin(id, name, email, password, null);
        } else if ("PROJECT_MANAGER".equalsIgnoreCase(role)) {
            user = new ProjectManager(id, name, email, password, null);
        } else {
            user = new TeamMember(id, name, email, password, null);
        }

        userDAO.updateUser(user);

        HttpSession session = request.getSession(false);
        int adminId = (int) session.getAttribute("userId");
        AuditLogThread.logAsync(adminId, "Admin updated user details for ID " + id);

        response.sendRedirect(request.getContextPath() + "/users?success=User+updated+successfully");
    }

    private void handleDeleteUser(HttpServletRequest request, HttpServletResponse response)
            throws DatabaseException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        HttpSession session = request.getSession(false);
        int adminId = (int) session.getAttribute("userId");

        if (id == adminId) {
            response.sendRedirect(request.getContextPath() + "/users?error=Cannot+delete+own+admin+account");
            return;
        }

        userDAO.deleteUser(id);
        AuditLogThread.logAsync(adminId, "Admin deleted user ID " + id);
        response.sendRedirect(request.getContextPath() + "/users?success=User+deleted+successfully");
    }
}
