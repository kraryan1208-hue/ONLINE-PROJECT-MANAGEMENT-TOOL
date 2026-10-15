<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Online Project Management Tool</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .login-card {
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 440px;
            padding: 2.25rem;
        }
        .brand-badge {
            display: inline-block;
            background: #EFF6FF;
            color: #1D4ED8;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            margin-bottom: 0.75rem;
        }
        .demo-chip {
            cursor: pointer;
            font-size: 0.75rem;
            padding: 0.35rem 0.65rem;
            background: #F1F5F9;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            transition: all 0.15s ease;
        }
        .demo-chip:hover {
            background: #E2E8F0;
            border-color: #CBD5E1;
        }
    </style>
</head>
<body>

<div class="login-card">
    <div class="text-center mb-4">
        <span class="brand-badge">B.Tech CSE Review 1</span>
        <h3 class="fw-bold text-slate-900 mb-1">Project Management Tool</h3>
        <p class="text-muted small">Sign in to access your role-based dashboard</p>
    </div>

    <% if (request.getAttribute("errorMessage") != null) { %>
        <div class="alert alert-danger py-2 small" role="alert">
            <%= request.getAttribute("errorMessage") %>
        </div>
    <% } %>

    <form action="${pageContext.request.contextPath}/login" method="post">
        <div class="mb-3">
            <label for="email" class="form-label small fw-semibold text-secondary">Email Address</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com" required>
        </div>

        <div class="mb-3">
            <label for="password" class="form-label small fw-semibold text-secondary">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">Sign In to Dashboard</button>
    </form>

    <div class="mt-4 pt-3 border-top">
        <div class="small fw-semibold text-secondary mb-2">Quick Demo Accounts:</div>
        <div class="d-flex flex-wrap">
            <span class="demo-chip" onclick="fillDemo('admin@example.com', 'admin123')">👑 Admin</span>
            <span class="demo-chip" onclick="fillDemo('manager@example.com', 'manager123')">📊 Project Manager</span>
            <span class="demo-chip" onclick="fillDemo('member@example.com', 'member123')">💻 Team Member</span>
        </div>
    </div>
</div>

<script>
    function fillDemo(email, pass) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = pass;
    }
</script>

</body>
</html>
