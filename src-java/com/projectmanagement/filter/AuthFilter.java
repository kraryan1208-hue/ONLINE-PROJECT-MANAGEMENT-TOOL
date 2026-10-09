package com.projectmanagement.filter;

import com.projectmanagement.model.User;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Servlet Filter implementing Role-Based Access Control (RBAC).
 * Enforces session authentication and protects URL paths:
 * - /admin/* -> Only ADMIN role
 * - /manager/* -> ADMIN or PROJECT_MANAGER
 * - /member/* -> Any authenticated role (ADMIN, PROJECT_MANAGER, TEAM_MEMBER)
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {"/admin/*", "/manager/*", "/member/*", "/users", "/projects", "/tasks"})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("[AuthFilter] Initialized RBAC Security Interceptor.");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        HttpSession session = httpRequest.getSession(false);
        String requestURI = httpRequest.getRequestURI();

        // 1. Check if user is authenticated via HttpSession
        if (session == null || session.getAttribute("currentUser") == null) {
            System.out.println("[AuthFilter Block] Unauthenticated request to " + requestURI);
            httpResponse.sendRedirect(httpRequest.getContextPath() + "/login.jsp?error=session_expired");
            return;
        }

        User currentUser = (User) session.getAttribute("currentUser");
        String role = currentUser.getRole();

        // 2. Role-based URL Authorization
        if (requestURI.contains("/admin/") && !"ADMIN".equalsIgnoreCase(role)) {
            System.out.println("[AuthFilter Block] Forbidden access attempt by " + role + " to Admin resource: " + requestURI);
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Administrator role required.");
            return;
        }

        if (requestURI.contains("/manager/") && !"ADMIN".equalsIgnoreCase(role) && !"PROJECT_MANAGER".equalsIgnoreCase(role)) {
            System.out.println("[AuthFilter Block] Forbidden access attempt by " + role + " to Project Manager resource: " + requestURI);
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Project Manager role required.");
            return;
        }

        // Pass control to next filter or servlet in chain
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        System.out.println("[AuthFilter] Destroyed.");
    }
}
