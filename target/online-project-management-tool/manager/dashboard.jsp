<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.projectmanagement.model.User" %>
<%
    User currentUser = (User) session.getAttribute("currentUser");
    if (currentUser == null || (!"PROJECT_MANAGER".equalsIgnoreCase(currentUser.getRole()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole()))) {
        response.sendRedirect(request.getContextPath() + "/login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Manager Dashboard - OPMT</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .sidebar { min-height: 100vh; background-color: #0F172A; color: #94A3B8; }
        .sidebar .nav-link { color: #94A3B8; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 0.25rem; }
        .sidebar .nav-link.active, .sidebar .nav-link:hover { color: #FFFFFF; background-color: #1E293B; }
        .stat-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1.25rem; }
    </style>
</head>
<body>
<div class="d-flex">
    <!-- Sidebar -->
    <div class="sidebar p-3" style="width: 260px;">
        <h5 class="text-white fw-bold px-2 mb-4">OPMT Enterprise</h5>
        <div class="small text-uppercase text-muted px-2 mb-2 font-monospace">Project Manager</div>
        <ul class="nav flex-column">
            <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/projects"><i class="bi bi-folder me-2"></i> My Projects</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/tasks"><i class="bi bi-check2-square me-2"></i> Tasks</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/reports"><i class="bi bi-pie-chart me-2"></i> Progress Reports</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/profile"><i class="bi bi-person me-2"></i> Profile</a></li>
            <li class="nav-item mt-4"><a class="nav-link text-danger" href="${pageContext.request.contextPath}/logout"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
        </ul>
    </div>

    <!-- Main Content Area -->
    <div class="flex-grow-1 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">Project Management Workspace</h4>
                <p class="text-muted small mb-0">Manager: <%= currentUser.getName() %></p>
            </div>
            <a href="${pageContext.request.contextPath}/tasks?action=new" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg me-1"></i> Create Task</a>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-md-3"><div class="stat-card"><div class="text-muted small">Managed Projects</div><h3 class="fw-bold mb-0">2</h3></div></div>
            <div class="col-md-3"><div class="stat-card"><div class="text-muted small">Active Tasks</div><h3 class="fw-bold mb-0">7</h3></div></div>
            <div class="col-md-3"><div class="stat-card"><div class="text-muted small">Completed Tasks</div><h3 class="fw-bold mb-0">3</h3></div></div>
            <div class="col-md-3"><div class="stat-card"><div class="text-muted small">Team Assigned</div><h3 class="fw-bold mb-0">4</h3></div></div>
        </div>
    </div>
</div>
</body>
</html>
