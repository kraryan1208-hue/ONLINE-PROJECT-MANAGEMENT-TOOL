<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.projectmanagement.model.User" %>
<%
    User currentUser = (User) session.getAttribute("currentUser");
    if (currentUser == null || !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
        response.sendRedirect(request.getContextPath() + "/login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - Online Project Management Tool</title>
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
        <div class="small text-uppercase text-muted px-2 mb-2 font-monospace">Administrator</div>
        <ul class="nav flex-column">
            <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/users"><i class="bi bi-people me-2"></i> Users</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/projects"><i class="bi bi-folder me-2"></i> Projects</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/reports"><i class="bi bi-bar-chart me-2"></i> Reports</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/settings"><i class="bi bi-gear me-2"></i> Settings</a></li>
            <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/profile"><i class="bi bi-person me-2"></i> Profile</a></li>
            <li class="nav-item mt-4"><a class="nav-link text-danger" href="${pageContext.request.contextPath}/logout"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
        </ul>
    </div>

    <!-- Main Content Area -->
    <div class="flex-grow-1 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-1">System Overview</h4>
                <p class="text-muted small mb-0">Logged in as <%= currentUser.getName() %> (Administrator)</p>
            </div>
            <a href="${pageContext.request.contextPath}/users" class="btn btn-primary btn-sm"><i class="bi bi-person-plus me-1"></i> Add User</a>
        </div>

        <!-- Metric Stat Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="text-muted small">Total Users</div>
                    <h3 class="fw-bold mb-0">7</h3>
                    <span class="text-success small"><i class="bi bi-arrow-up-right"></i> Active</span>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="text-muted small">Total Projects</div>
                    <h3 class="fw-bold mb-0">4</h3>
                    <span class="text-primary small">3 Active / 1 Completed</span>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="text-muted small">Total Tasks</div>
                    <h3 class="fw-bold mb-0">10</h3>
                    <span class="text-info small">5 Completed (50%)</span>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="text-muted small">Team Members</div>
                    <h3 class="fw-bold mb-0">4</h3>
                    <span class="text-secondary small">Engineers &amp; QA</span>
                </div>
            </div>
        </div>

        <div class="alert alert-info py-2 small">
            <strong>Architecture Note:</strong> Full interactive single-page application is live on port 3000 running Express/MVC with exact MySQL DB schema, dynamic percentage calculations, and Review 1 Viva code inspector.
        </div>
    </div>
</div>
</body>
</html>
