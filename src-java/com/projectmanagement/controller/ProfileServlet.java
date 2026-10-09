package com.projectmanagement.controller;

import com.projectmanagement.dao.UserDAO;
import com.projectmanagement.dao.UserDAOImpl;
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
 * ProfileServlet manages user personal credentials, email and password updates.
 */
@WebServlet(name = "ProfileServlet", urlPatterns = {"/profile", "/update-profile"})
public class ProfileServlet extends HttpServlet {
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
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        request.getRequestDispatcher("/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            userDAO.updateProfile(userId, name, email, password);

            // Update session attributes
            session.setAttribute("userName", name);
            session.setAttribute("userEmail", email);

            AuditLogThread.logAsync(userId, "User '" + name + "' updated profile credentials.");
            response.sendRedirect(request.getContextPath() + "/profile?success=Profile+updated+successfully");

        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Could not update profile: " + e.getMessage());
            request.getRequestDispatcher("/profile.jsp").forward(request, response);
        }
    }
}
