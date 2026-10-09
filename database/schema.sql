-- ============================================================================
-- ONLINE PROJECT MANAGEMENT TOOL (OPMT)
-- Database Name: project_management
-- Technology: MySQL 8.0+ / InnoDB Engine
-- Course: B.Tech CSE College Review 1 (GUVI / HCL / Galgotias University)
-- Author: CSE Project Team
-- ============================================================================

DROP DATABASE IF EXISTS project_management;
CREATE DATABASE project_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE project_management;

-- ----------------------------------------------------------------------------
-- Table 1: USERS
-- Stores credentials and Role-Based Access Control (RBAC) levels
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER') NOT NULL DEFAULT 'TEAM_MEMBER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 2: PROJECTS
-- Stores projects managed by Project Managers or created by Admins
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Planning', 'In Progress', 'Completed', 'On Hold') NOT NULL DEFAULT 'Planning',
    manager_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_manager FOREIGN KEY (manager_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_project_status (status),
    INDEX idx_project_manager (manager_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 3: TASKS
-- Core work units with priority, deadline, status, and assigned team member
-- ----------------------------------------------------------------------------
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    project_id INT NOT NULL,
    assigned_to INT NULL,
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    deadline DATE NOT NULL,
    status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_task_assignee FOREIGN KEY (assigned_to) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_task_status (status),
    INDEX idx_task_priority (priority),
    INDEX idx_task_assigned_to (assigned_to),
    INDEX idx_task_project (project_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 4: PROJECT_MEMBERS
-- Relational mapping table for many-to-many project allocation
-- ----------------------------------------------------------------------------
CREATE TABLE project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pm_project FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_project_user (project_id, user_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 5: ACTIVITIES
-- Audit feed logging every significant system operation
-- ----------------------------------------------------------------------------
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    activity VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_created (created_at DESC)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Table 6: SYSTEM_SETTINGS
-- Global application configurations accessible by Administrator
-- ----------------------------------------------------------------------------
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- SEED SAMPLE DATA (For Evaluation & Demo Verification)
-- ============================================================================

-- 1. Insert Initial Users
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Dr. Rajesh Sharma (Admin)', 'admin@example.com', 'admin123', 'ADMIN', '2026-09-01 09:00:00'),
(2, 'Priya Verma (Project Manager)', 'manager@example.com', 'manager123', 'PROJECT_MANAGER', '2026-09-02 10:15:00'),
(3, 'Amit Kumar (Project Manager)', 'amit.manager@example.com', 'manager123', 'PROJECT_MANAGER', '2026-09-03 11:30:00'),
(4, 'Rahul Patel (Developer)', 'member@example.com', 'member123', 'TEAM_MEMBER', '2026-09-04 12:00:00'),
(5, 'Sneha Reddy (Frontend Engineer)', 'sneha@example.com', 'member123', 'TEAM_MEMBER', '2026-09-05 14:20:00'),
(6, 'Vikram Singh (Backend Engineer)', 'vikram@example.com', 'member123', 'TEAM_MEMBER', '2026-09-06 15:45:00'),
(7, 'Ananya Gupta (QA Analyst)', 'ananya@example.com', 'member123', 'TEAM_MEMBER', '2026-09-07 16:10:00');

-- 2. Insert Initial Projects
INSERT INTO projects (id, title, description, start_date, end_date, status, manager_id, created_at) VALUES
(101, 'Online Shopping Portal Redesign', 'Enterprise e-commerce redesign with secure checkout, inventory sync, and real-time order tracking.', '2026-09-15', '2026-11-30', 'In Progress', 2, '2026-09-15 10:00:00'),
(102, 'Hospital Management & EHR System', 'Automated patient admission, doctor scheduling, electronic health records, and billing system.', '2026-08-01', '2026-10-25', 'In Progress', 2, '2026-08-01 09:30:00'),
(103, 'University Examination & Result ERP', 'Secure student portal for hall tickets, GPA calculation, online grading, and transcript issuance.', '2026-07-10', '2026-09-20', 'Completed', 3, '2026-07-10 11:00:00'),
(104, 'AI Smart Traffic Monitoring System', 'IoT sensor and camera-based traffic density optimizer for urban junction management.', '2026-10-01', '2026-12-31', 'Planning', 3, '2026-10-01 08:45:00');

-- 3. Map Project Members
INSERT INTO project_members (project_id, user_id) VALUES
(101, 4), (101, 5), (101, 6), (101, 7),
(102, 4), (102, 5), (102, 6),
(103, 4), (103, 6),
(104, 4);

-- 4. Insert Initial Tasks
INSERT INTO tasks (id, title, description, project_id, assigned_to, priority, deadline, status, created_at, updated_at) VALUES
(1001, 'Implement User Authentication & Session Security', 'Build robust login flow with role-based session control and timeout validation.', 101, 4, 'High', '2026-10-15', 'Completed', '2026-09-16 10:00:00', '2026-09-25 14:00:00'),
(1002, 'Design Responsive Shopping Cart UI', 'Create modern shopping cart page using Tailwind / Bootstrap with smooth transitions.', 101, 5, 'High', '2026-10-20', 'In Progress', '2026-09-17 11:30:00', '2026-10-02 16:30:00'),
(1003, 'Integrate Payment Gateway & Webhook listener', 'Setup Stripe / Razorpay API integration with HMAC signature verification.', 101, 6, 'High', '2026-10-28', 'Pending', '2026-09-18 09:15:00', '2026-09-18 09:15:00'),
(1004, 'Cart & Checkout Integration Testing', 'Perform end-to-end integration and regression test suites for checkout flow.', 101, 7, 'Medium', '2026-11-05', 'Pending', '2026-09-20 13:00:00', '2026-09-20 13:00:00'),
(1005, 'Doctor Appointment Slot Booking API', 'RESTful endpoint with concurrency lock to prevent double booking of time slots.', 102, 6, 'High', '2026-10-12', 'Completed', '2026-08-05 10:00:00', '2026-08-28 17:00:00'),
(1006, 'Patient Electronic Prescription PDF Generator', 'Generate digitally signed prescription documents using iText library.', 102, 4, 'Medium', '2026-10-18', 'Completed', '2026-08-10 14:00:00', '2026-09-05 11:20:00'),
(1007, 'Billing Module & Insurance Claim Sync', 'Implement automated deductible calculation and insurer EDI submission.', 102, 5, 'High', '2026-10-24', 'In Progress', '2026-08-15 11:00:00', '2026-10-04 15:40:00'),
(1008, 'Student Transcript Cryptographic Verification', 'QR code verification generator for official grade transcripts.', 103, 6, 'High', '2026-09-10', 'Completed', '2026-07-15 09:00:00', '2026-09-08 12:00:00'),
(1009, 'Grade Point Average (GPA) Automated Batch Processor', 'Nightly batch job executing credit-hour weighted average computation.', 103, 4, 'Medium', '2026-09-18', 'Completed', '2026-07-20 10:30:00', '2026-09-15 16:30:00'),
(1010, 'Camera Feed Object Detection Model Integration', 'RTSP stream ingestion pipeline with OpenCV vehicle count classifier.', 104, 4, 'Medium', '2026-11-15', 'Pending', '2026-10-02 09:00:00', '2026-10-02 09:00:00');

-- 5. Insert Activities
INSERT INTO activities (id, user_id, activity, created_at) VALUES
(501, 1, 'Admin Dr. Rajesh Sharma logged into the system.', '2026-10-08 08:00:00'),
(502, 2, 'Project Manager Priya Verma updated task "Design Responsive Shopping Cart UI" to In Progress.', '2026-10-07 14:30:00'),
(503, 4, 'Team Member Rahul Patel completed task "Implement User Authentication & Session Security".', '2026-10-06 17:15:00'),
(504, 3, 'Project Manager Amit Kumar created project "AI Smart Traffic Monitoring System".', '2026-10-01 08:45:00'),
(505, 1, 'Admin configured system setting: Notification Daemon Thread set to ENABLED.', '2026-09-28 10:10:00');

-- 6. Insert System Settings
INSERT INTO system_settings (id, setting_name, setting_value) VALUES
(1, 'app_name', 'Online Project Management Tool (OPMT Enterprise)'),
(2, 'institution_name', 'Galgotias University / GUVI CSE Review'),
(3, 'academic_session', '2026-2027'),
(4, 'session_timeout_minutes', '30'),
(5, 'allow_member_self_registration', 'false'),
(6, 'background_thread_daemon', 'ENABLED'),
(7, 'default_task_deadline_days', '14');

-- ----------------------------------------------------------------------------
-- VERIFICATION VIEW: Dynamic Project Completion Formula
-- Progress = (Completed Tasks / Total Tasks) * 100
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_project_progress AS
SELECT 
    p.id AS project_id,
    p.title AS project_title,
    p.status AS project_status,
    u.name AS manager_name,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
    SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) AS pending_tasks,
    CASE 
        WHEN COUNT(t.id) = 0 THEN 0.0
        ELSE ROUND((SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) / COUNT(t.id)) * 100, 2)
    END AS completion_percentage
FROM projects p
JOIN users u ON p.manager_id = u.id
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.title, p.status, u.name;
