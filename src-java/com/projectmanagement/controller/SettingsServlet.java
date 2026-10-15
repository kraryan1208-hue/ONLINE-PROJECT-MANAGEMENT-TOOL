package com.projectmanagement.controller;

import com.projectmanagement.dao.SystemSettingDAO;
import com.projectmanagement.dao.SystemSettingDAOImpl;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.SystemSetting;
import com.projectmanagement.service.AuditLogThread;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * SettingsServlet manages global application configuration (system_settings table).
 * Restricts modifications to ADMIN role.
 */
@WebServlet(name = "SettingsServlet", urlPatterns = {"/settings", "/admin/settings", "/api/settings"})
public class SettingsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private SystemSettingDAO systemSettingDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        this.systemSettingDAO = new SystemSettingDAOImpl();
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
            List<SystemSetting> settingsList = systemSettingDAO.getAllSettings();

            if (request.getRequestURI().endsWith("/api/settings")) {
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                StringBuilder json = new StringBuilder("{");
                for (int i = 0; i < settingsList.size(); i++) {
                    SystemSetting s = settingsList.get(i);
                    json.append("\"").append(s.getSettingName()).append("\":\"")
                        .append(s.getSettingValue() != null ? s.getSettingValue().replace("\"", "\\\"") : "")
                        .append("\"");
                    if (i < settingsList.size() - 1) json.append(",");
                }
                json.append("}");
                out.print(json.toString());
                out.flush();
                return;
            }

            request.setAttribute("settings", settingsList);
            request.getRequestDispatcher("/admin/settings.jsp").forward(request, response);

        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Error loading system settings: " + e.getMessage());
            request.getRequestDispatcher("/admin/settings.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equalsIgnoreCase((String) session.getAttribute("userRole"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Only Administrators can modify system settings.");
            return;
        }

        int adminId = (int) session.getAttribute("userId");
        Map<String, String[]> paramMap = request.getParameterMap();
        Map<String, String> settingsToUpdate = new HashMap<>();

        for (Map.Entry<String, String[]> entry : paramMap.entrySet()) {
            String key = entry.getKey();
            if (!"action".equalsIgnoreCase(key) && entry.getValue() != null && entry.getValue().length > 0) {
                settingsToUpdate.put(key, entry.getValue()[0]);
            }
        }

        try {
            systemSettingDAO.updateSettings(settingsToUpdate);
            AuditLogThread.logAsync(adminId, "Administrator updated global system settings.");

            String referer = request.getHeader("Referer");
            if (referer != null && !referer.isEmpty()) {
                response.sendRedirect(referer + (referer.contains("?") ? "&" : "?") + "success=Settings+updated");
            } else {
                response.sendRedirect(request.getContextPath() + "/settings?success=Settings+updated");
            }
        } catch (DatabaseException e) {
            request.setAttribute("errorMessage", "Failed to update settings: " + e.getMessage());
            request.getRequestDispatcher("/admin/settings.jsp").forward(request, response);
        }
    }
}
