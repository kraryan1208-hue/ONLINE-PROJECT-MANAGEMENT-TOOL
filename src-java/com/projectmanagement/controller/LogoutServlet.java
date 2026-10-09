package com.projectmanagement.controller;

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
 * LogoutServlet handles user sign-out, session invalidation, and cleanup.
 */
@WebServlet(name = "LogoutServlet", urlPatterns = {"/logout", "/auth/logout"})
public class LogoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processLogout(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processLogout(request, response);
    }

    private void processLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            User user = (User) session.getAttribute("currentUser");
            if (user != null) {
                AuditLogThread.logAsync(user.getId(), user.getRole() + " " + user.getName() + " logged out. Session invalidated.");
            }
            // Invalidate session and destroy attributes
            session.invalidate();
        }
        response.sendRedirect(request.getContextPath() + "/login.jsp?logout=success");
    }
}
