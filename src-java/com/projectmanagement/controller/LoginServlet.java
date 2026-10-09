package com.projectmanagement.controller;

import com.projectmanagement.dao.UserDAO;
import com.projectmanagement.dao.UserDAOImpl;
import com.projectmanagement.exception.AuthenticationException;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.User;
import com.projectmanagement.service.AuditLogThread;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

/**
 * LoginServlet manages user credential authentication and session establishment.
 * Implements:
 * - doPost() credential validation
 * - HttpSession creation
 * - Role-based dashboard redirection
 * - Asynchronous audit logging
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/login", "/auth/login"})
public class LoginServlet extends HttpServlet {
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
        // Forward to login page
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Input validation
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Email and password are both required fields.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        try {
            // Authenticate user via JDBC DAO
            User user = userDAO.authenticate(email, password);

            // Establish HttpSession
            HttpSession session = request.getSession(true);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getName());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userRole", user.getRole());
            session.setAttribute("currentUser", user);

            // Set session timeout to 30 minutes
            session.setMaxInactiveInterval(30 * 60);

            // Asynchronous Audit Log using Thread
            AuditLogThread.logAsync(user.getId(), user.getRole() + " " + user.getName() + " logged in via LoginServlet.");

            // Role-based redirection
            String targetUrl;
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                targetUrl = request.getContextPath() + "/admin/dashboard.jsp";
            } else if ("PROJECT_MANAGER".equalsIgnoreCase(user.getRole())) {
                targetUrl = request.getContextPath() + "/manager/dashboard.jsp";
            } else {
                targetUrl = request.getContextPath() + "/member/dashboard.jsp";
            }

            response.sendRedirect(targetUrl);

        } catch (AuthenticationException e) {
            request.setAttribute("errorMessage", e.getMessage());
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Database service error: " + e.getMessage());
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        } catch (Exception e) {
            request.setAttribute("errorMessage", "An unexpected error occurred during login. Please try again.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}
