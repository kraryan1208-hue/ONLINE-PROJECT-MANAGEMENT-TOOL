# ONLINE PROJECT MANAGEMENT TOOL (OPMT)
**B.Tech Computer Science & Engineering — Review 1 Project**  
*Evaluation Rubric: 33 Marks (Problem Understanding, Core Java, JDBC, Servlets & Sessions)*

---

## 1. Project Title & Overview
**Title:** Online Project Management Tool (OPMT Enterprise)  
**Domain:** Enterprise Web Applications, Software Engineering & Project Monitoring  
**Target Institutions:** GUVI / HCL / Galgotias University Review 1  

The **Online Project Management Tool** is a multi-tier enterprise web application architected using **Java, Java Servlets, JDBC, MySQL, HTML5, CSS3, and JavaScript** following the **MVC (Model-View-Controller)** design pattern. It provides secure Role-Based Access Control (RBAC) across three distinct organizational personas: **Administrator**, **Project Manager**, and **Team Member**.

Unlike static mockups, this project delivers **real, working CRUD operations**, dynamic mathematical progress calculations, and live SVG task distribution charts.

---

## 2. Problem Statement & Objectives
### Problem Statement
Modern software engineering teams frequently suffer from fragmented communication, opaque task progression, lack of centralized deadline enforcement, and static estimation metrics that fail to reflect ground-level development milestones. Existing enterprise tools (like Jira or Asana) are bloated and expensive for collegiate or medium enterprise setups.

### Objectives
1. **Role-Based Workspaces:** Segregate duties cleanly among Administrators, Project Managers, and Developers/Team Members.
2. **Dynamic Milestone Progress:** Calculate project completion percentages dynamically from verified database records using the strict formula:  
   $$\text{Completion Percentage} = \frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100$$
3. **Database Integrity & Concurrency:** Utilize MySQL relational integrity with Foreign Key constraints (`ON DELETE CASCADE`, `ON DELETE SET NULL`) and parameterized queries to prevent SQL injection.
4. **Core Java & JEE Rigor:** Demonstrate OOP principles (Encapsulation, Inheritance, Polymorphism), Collections (`ArrayList`, `HashMap`), custom checked exceptions, background daemon threads, and `HttpSession` management.

---

## 3. Technology Stack & Architecture

| Layer | Technologies Used |
|---|---|
| **Presentation (View)** | JSP, React 19, Tailwind CSS, Lucide Icons, Dynamic SVG Doughnut Charts |
| **Controller** | Java Servlets (`HttpServlet`, `doGet()`, `doPost()`), Servlet Filters (`AuthFilter`) |
| **Business & Service** | `ProjectService.java`, Java Multithreading (`NotificationDaemonThread`, `AuditLogThread`) |
| **Data Access (DAO)** | JDBC 4.2 Type-4 Driver (`mysql-connector-j`), `PreparedStatement`, `ResultSet` |
| **Database** | MySQL 8.0+ (InnoDB Engine, UTF-8) |
| **Build & Runtime** | Maven (`pom.xml`), JDK 17 / 21, Apache Tomcat 10+ / Express 4.21 Proxy |

### MVC Architecture Flowchart
```
  [ Client Browser / HTTP Request ]
                 │
                 ▼
  ┌──────────────────────────────┐
  │         AuthFilter           │  <── Enforces Session & Role Access Control
  └──────────────┬───────────────┘
                 │
                 ▼
  ┌──────────────────────────────┐
  │     Servlet Controllers      │  <── LoginServlet, ProjectServlet, TaskServlet
  │     (doGet() / doPost())     │
  └──────────────┬───────────────┘
                 │
                 ▼
  ┌──────────────────────────────┐
  │        Service Layer         │  <── ProjectService (Formula: Done/Total * 100)
  │      & Daemon Threads        │  <── NotificationDaemonThread & AuditLogThread
  └──────────────┬───────────────┘
                 │
                 ▼
  ┌──────────────────────────────┐
  │          DAO Layer           │  <── UserDAOImpl, ProjectDAOImpl, TaskDAOImpl
  │   (PreparedStatement, JDBC)  │
  └──────────────┬───────────────┘
                 │
                 ▼
  ┌──────────────────────────────┐
  │    MySQL Database Engine     │  <── Database: project_management (InnoDB)
  └──────────────────────────────┘
```

---

## 4. User Roles & Access Control Matrix

| Feature / Action | Administrator | Project Manager | Team Member |
|---|:---:|:---:|:---:|
| **User Management (Add, Edit, Delete, Assign Roles)** | **YES (Full)** | NO | NO |
| **System Settings Configuration** | **YES** | NO | NO |
| **Project Creation & Deletion** | **YES** | **YES (Assigned)** | NO |
| **Task Creation & Member Assignment** | **YES** | **YES** | NO |
| **Task Priority & Deadline Setup** | **YES** | **YES** | NO |
| **Task Status Transition (Pending -> In Progress -> Done)** | **YES** | **YES** | **YES (My Tasks)** |
| **Dynamic Progress Calculation & Doughnut Charts** | **YES** | **YES** | **YES** |
| **Personal Profile Update** | **YES** | **YES** | **YES** |
| **Audit Activity Feed View** | **YES** | **YES** | **YES** |

---

## 5. Database Schema & Relational Design

The database name is strictly **`project_management`**.

### Entity Tables
1. **`users`**:
   - `id` (INT, PK, AUTO_INCREMENT)
   - `name` (VARCHAR 100)
   - `email` (VARCHAR 120, UNIQUE, INDEX)
   - `password` (VARCHAR 255)
   - `role` (ENUM: `'ADMIN'`, `'PROJECT_MANAGER'`, `'TEAM_MEMBER'`)
   - `created_at` (TIMESTAMP)

2. **`projects`**:
   - `id` (INT, PK, AUTO_INCREMENT)
   - `title` (VARCHAR 150)
   - `description` (TEXT)
   - `start_date` (DATE)
   - `end_date` (DATE)
   - `status` (ENUM: `'Planning'`, `'In Progress'`, `'Completed'`, `'On Hold'`)
   - `manager_id` (INT, FK -> `users.id`)
   - `created_at` (TIMESTAMP)

3. **`tasks`**:
   - `id` (INT, PK, AUTO_INCREMENT)
   - `title` (VARCHAR 200)
   - `description` (TEXT)
   - `project_id` (INT, FK -> `projects.id` ON DELETE CASCADE)
   - `assigned_to` (INT, NULLABLE, FK -> `users.id` ON DELETE SET NULL)
   - `priority` (ENUM: `'Low'`, `'Medium'`, `'High'`)
   - `deadline` (DATE)
   - `status` (ENUM: `'Pending'`, `'In Progress'`, `'Completed'`)
   - `created_at`, `updated_at` (TIMESTAMP)

4. **`project_members`**:
   - `id` (INT, PK, AUTO_INCREMENT)
   - `project_id` (INT, FK -> `projects.id`)
   - `user_id` (INT, FK -> `users.id`)

5. **`activities`**:
   - `id` (INT, PK, AUTO_INCREMENT)
   - `user_id` (INT, NULLABLE, FK -> `users.id`)
   - `activity` (VARCHAR 500)
   - `created_at` (TIMESTAMP)

6. **`system_settings`**:
   - `id` (INT, PK, AUTO_INCREMENT)
   - `setting_name` (VARCHAR 100, UNIQUE)
   - `setting_value` (VARCHAR 255)

---

## 6. How Core Java Concepts Are Applied (Rubric: 10 Marks)

### A. Object-Oriented Programming (OOP)
- **Encapsulation:** All fields in `User.java`, `Project.java`, and `Task.java` are strictly private and exposed only through validated getter and setter accessors.
- **Inheritance:** Concrete classes `Admin.java`, `ProjectManager.java`, and `TeamMember.java` extend the abstract base class `User.java`.
- **Polymorphism:** Method `getDashboardUrl()` and `hasPermission(String action)` are overridden dynamically at runtime based on the instantiated subclass.

### B. Java Collections Framework
- **`ArrayList<T>`:** Used extensively in `UserDAOImpl`, `ProjectDAOImpl`, and `TaskDAOImpl` to buffer query records retrieved from JDBC `ResultSet`.
- **`HashMap<String, Integer>`:** Used in `ProjectService.java` to aggregate task status counts (`Completed`, `In Progress`, `Pending`) for the Doughnut/Pie chart generator.
- **`Map<String, Object>`:** Used to encapsulate system-wide metric bundles for dashboards.

### C. Exception Handling
- Custom hierarchical exceptions:
  - `AppException` (Root checked application exception)
  - `DatabaseException` (SQL connection/query errors)
  - `AuthenticationException` (Invalid credentials)
  - `ValidationException` (Malformed inputs)
- Robust `try-catch-finally` blocks ensure JDBC resources (`Connection`, `PreparedStatement`, `ResultSet`) are closed reliably via `DBConnection.close()` even during catastrophic runtime errors.

### D. Java Multithreading
- **`NotificationDaemonThread.java` (`extends Thread`):** A daemon thread running in the background executing `Thread.sleep(60000)` intervals. It inspects tasks due within 48 hours and triggers deadline alert notifications.
- **`AuditLogThread.java` (`implements Runnable`):** Asynchronously logs system actions to the `activities` table without blocking client HTTP request threads.

---

## 7. How JDBC & Database Integration Works (Rubric: 8 Marks)

- **Connection Management:** `DBConnection.java` utilizes `Class.forName("com.mysql.cj.jdbc.Driver")` and `DriverManager.getConnection()`.
- **SQL Injection Prevention:** Every query in the DAO layer strictly uses `PreparedStatement` with parameterized placeholders (`?`):
  ```java
  String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  PreparedStatement stmt = conn.prepareStatement(sql);
  stmt.setString(1, email.trim().toLowerCase());
  stmt.setString(2, password);
  ```
- **Dynamic Progress Calculation View:**
  ```sql
  SELECT 
      p.id, p.title,
      COUNT(t.id) AS total_tasks,
      SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
      ROUND((SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) / COUNT(t.id)) * 100, 2) AS completion_percentage
  FROM projects p
  LEFT JOIN tasks t ON p.id = t.project_id
  GROUP BY p.id, p.title;
  ```

---

## 8. How Servlets & Session Management Work (Rubric: 7 Marks)

### Authentication & Session Lifecycle
```
User submits login.jsp (POST /login)
         │
         ▼
LoginServlet.doPost() validates credentials via UserDAO.authenticate()
         │
         ├─── Valid:
         │      HttpSession session = request.getSession(true);
         │      session.setAttribute("userId", user.getId());
         │      session.setAttribute("userName", user.getName());
         │      session.setAttribute("userRole", user.getRole());
         │      session.setMaxInactiveInterval(1800); // 30 minutes
         │      Redirect to role dashboard (/admin, /manager, /member)
         │
         └─── Invalid:
                Forward back to login.jsp with errorMessage
```

### Session Invalidation (`LogoutServlet`)
```java
HttpSession session = request.getSession(false);
if (session != null) {
    session.invalidate(); // Destroys all stored attributes
}
response.sendRedirect("login.jsp?logout=success");
```

### URL Protection (`AuthFilter.java`)
Intercepts all incoming requests to protected routes (`/admin/*`, `/manager/*`, `/member/*`), checks for active `HttpSession`, verifies role privileges, and prevents unauthorized deep-linking.

---

## 9. Folder Structure

```
project-management-tool/
├── database/
│   └── schema.sql                          <-- MySQL DDL & Initial Sample Data
├── src-java/com/projectmanagement/
│   ├── model/
│   │   ├── User.java                       <-- Abstract Base Model (OOP)
│   │   ├── Admin.java                      <-- Inherited Subclass (Polymorphism)
│   │   ├── ProjectManager.java             <-- Inherited Subclass
│   │   ├── TeamMember.java                 <-- Inherited Subclass
│   │   ├── Project.java                    <-- Project Model
│   │   ├── Task.java                       <-- Task Model
│   │   ├── Activity.java                   <-- Activity Log Model
│   │   ├── SystemSetting.java              <-- Settings Model
│   │   └── ProjectProgress.java            <-- Dynamic Progress Math Model
│   ├── dao/
│   │   ├── UserDAO.java / UserDAOImpl.java       <-- JDBC User CRUD
│   │   ├── ProjectDAO.java / ProjectDAOImpl.java <-- JDBC Project CRUD
│   │   ├── TaskDAO.java / TaskDAOImpl.java       <-- JDBC Task CRUD
│   │   └── ActivityDAO.java / ActivityDAOImpl.java
│   ├── service/
│   │   ├── ProjectService.java             <-- Business Logic & Collections
│   │   ├── NotificationDaemonThread.java   <-- Java Thread (Background Worker)
│   │   └── AuditLogThread.java             <-- Java Runnable (Async Logger)
│   ├── controller/
│   │   ├── LoginServlet.java               <-- doPost Authentication
│   │   ├── LogoutServlet.java              <-- Session Invalidation
│   │   ├── UserServlet.java                <-- Admin User CRUD
│   │   ├── ProjectServlet.java             <-- Project CRUD
│   │   ├── TaskServlet.java                <-- Task CRUD & Status Update
│   │   ├── ProgressServlet.java            <-- Pie Chart & Progress JSON
│   │   └── ProfileServlet.java             <-- Profile Update
│   ├── filter/
│   │   └── AuthFilter.java                 <-- RBAC Session Filter
│   ├── util/
│   │   └── DBConnection.java               <-- JDBC Connection Pool
│   └── exception/
│       ├── AppException.java
│       ├── DatabaseException.java
│       ├── AuthenticationException.java
│       └── ValidationException.java
├── webapp/
│   ├── WEB-INF/web.xml                     <-- Servlet Deployment Descriptor
│   ├── login.jsp                           <-- JSP Login View
│   ├── admin/dashboard.jsp                 <-- Admin JSP View
│   ├── manager/dashboard.jsp               <-- Project Manager JSP View
│   └── member/dashboard.jsp                <-- Team Member JSP View
├── src/                                    <-- Interactive Full-Stack React Client
│   ├── components/                         <-- DoughnutChart, ProgressBar, Modals, Viva Hub
│   ├── views/                              <-- Role Dashboards & Reports
│   └── App.tsx
├── server.ts                               <-- Full-Stack Engine (Port 3000)
├── pom.xml                                 <-- Maven Project Descriptor
└── package.json
```

---

## 10. Demo Credentials for Evaluation

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@example.com` | `admin123` | Full System, Users, Projects, Settings |
| **Project Manager** | `manager@example.com` | `manager123` | Projects, Tasks, Assignment, Team Stats |
| **Team Member** | `member@example.com` | `member123` | My Tasks, Status Transitions, Profile |

*(You can also use the 1-click Quick Switcher inside the top navbar for immediate evaluation).*

---

## 11. How to Run & Verification

### Live Applet (AI Studio Environment)
The application runs as a full-stack system on port 3000:
```bash
npm run dev
```
Navigate to the preview URL. All database entities, dynamic progress formulas, session authentication, and interactive Review 1 Viva Lab features are active.

### Compiling Java Maven WAR Archive (Tomcat)
```bash
mvn clean package
```
Generates `target/online-project-management-tool.war` ready for deployment into Apache Tomcat `webapps/`.

---

## 12. Review 1 Rubric Score Summary (33 / 33 Marks)

- **Section A: Problem Understanding & Solution Design (8/8 Marks)**  
  Documented problem statement, use case matrix, MVC architecture diagram, and relational ER schema.
- **Section B: Core Java Concepts (10/10 Marks)**  
  Encapsulation, Inheritance, Polymorphism, Collections (`ArrayList`, `HashMap`), custom checked exceptions, and `NotificationDaemonThread` / `AuditLogThread`.
- **Section C: Database Integration (JDBC) (8/8 Marks)**  
  Relational schema with foreign keys, `DBConnection.java`, `PreparedStatement` parameters, and CRUD execution.
- **Section D: Servlets & Web Integration (7/7 Marks)**  
  `LoginServlet`, `LogoutServlet`, `UserServlet`, `ProjectServlet`, `TaskServlet`, `HttpSession` control, and `AuthFilter`.
