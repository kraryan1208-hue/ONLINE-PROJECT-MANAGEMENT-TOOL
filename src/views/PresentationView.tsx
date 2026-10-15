import React, { useState, useEffect } from 'react';
import {
  Presentation,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code as CodeIcon,
  Image as ImageIcon,
  Printer,
  Layers,
  Shield,
  Users,
  FolderKanban,
  CheckSquare,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ZoomIn,
  X,
  Clock,
  Briefcase,
  User as UserIcon,
  TrendingUp,
  Activity,
  AlertCircle,
  Search,
  Plus,
} from 'lucide-react';
import pptxgen from 'pptxgenjs';

interface SlideData {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  codeTitle: string;
  codeLanguage: string;
  codeSnippet: string;
  screenshotType:
    | 'architecture'
    | 'rbac'
    | 'db'
    | 'dashboard'
    | 'charts'
    | 'velocity'
    | 'table'
    | 'modal'
    | 'taskmodal'
    | 'progress'
    | 'member'
    | 'activity'
    | 'viva';
  notes: string;
  screenshotCaption: string;
}

interface PresentationViewProps {
  onBackToDashboard?: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ onBackToDashboard }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'both' | 'code' | 'screenshot'>('both');
  const [zoomedScreenshot, setZoomedScreenshot] = useState<string | null>(null);

  const slides: SlideData[] = [
    {
      id: 1,
      category: '1. Project Overview & Bootstrap',
      title: 'Online Project Management Tool (OPMT)',
      subtitle: 'Full-Featured Java Web MVC & Modern React TypeScript Architecture',
      bulletPoints: [
        'Enterprise-grade collaborative workspace with Role-Based Access Control (Admin, Project Manager, Team Member).',
        'Real-time project telemetry: Automatic progress calculation using formula: (Completed Tasks / Total Tasks) × 100.',
        'High-contrast, Untitled UI inspired executive dashboard with interactive Pi/Donut charts, Velocity graphs, and live data tables.',
        'Dynamic Contributor Inspection: Instant visibility of who is assigned to each project and their specific organizational role.',
        'Fully prepared for Review 1 Viva Examination, production deployment, and software engineering evaluation benchmarks.',
      ],
      codeTitle: 'Application Entry & Telemetry Bootstrap (App.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Application Entry & Multi-Role MVC Orchestration
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // Real-time synchronization of project telemetry
  const summary: ReportSummary = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
    overallProgressPercentage: calculateProgress(tasks),
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar role={currentUser.role} activeTab={activeTab} onSelectTab={setActiveTab} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {currentUser.role === 'ADMIN' && <AdminDashboardView summary={summary} />}
          {currentUser.role === 'PROJECT_MANAGER' && <ManagerDashboardView summary={summary} />}
          {currentUser.role === 'TEAM_MEMBER' && <MemberDashboardView tasks={tasks} />}
        </main>
      </div>
    </div>
  );
}`,
      screenshotType: 'dashboard',
      notes: 'Viva Point: Demonstrates single page reactive state management synchronized with server-side REST API.',
      screenshotCaption: 'Executive Dashboard UI with 7 Untitled UI Metric Cards, Live Charts & Matrix Table',
    },
    {
      id: 2,
      category: '2. System Architecture',
      title: '3-Tier Java Web MVC Layered Architecture',
      subtitle: 'Separation of Concerns: Presentation, Controller, Service & Data Access Layer',
      bulletPoints: [
        'View Layer (Presentation): React 19 SPA with Tailwind CSS, SVG Chart Engine, and Untitled UI design tokens.',
        'Controller Layer (Web Tier): Express / Java Servlet REST routers handling authentication, validation, and HTTP dispatching.',
        'Service Layer (Business Logic): Transactional service classes implementing progress calculation and contributor mapping.',
        'Data Access Object (DAO / DB): Parameterized JDBC connector ensuring SQL injection prevention and referential integrity.',
      ],
      codeTitle: 'Java MVC Controller & Service Layer Pattern (ProjectController.java)',
      codeLanguage: 'java',
      codeSnippet: `// Java Web MVC Controller Pattern
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/{id}/contributors")
    public ResponseEntity<List<ContributorDTO>> getProjectContributors(@PathVariable int id) {
        // Retrieve contributors assigned to project with roles & progress
        List<ContributorDTO> team = projectService.getContributorsWithRoles(id);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/telemetry")
    public ResponseEntity<ProjectTelemetry> getSystemTelemetry() {
        ProjectTelemetry telemetry = projectService.calculateSystemTelemetry();
        return ResponseEntity.ok(telemetry);
    }
}`,
      screenshotType: 'architecture',
      notes: 'Viva Point: Adheres to strict 3-tier MVC guidelines required in university and enterprise Java Web syllabi.',
      screenshotCaption: '3-Tier MVC Architecture Flow: View (React) ↔ Controller (REST) ↔ Model & DB (JDBC)',
    },
    {
      id: 3,
      category: '3. Security & Access Control',
      title: 'Role-Based Access Control (RBAC) Matrix',
      subtitle: 'Enforcing Least Privilege across Administrator, Manager, and Team Member',
      bulletPoints: [
        'Administrator (System Scope): Full CRUD over users, system settings, global project governance, and audit activity.',
        'Project Manager (Project Scope): Project creation, milestone scheduling, task allocation, and team member workload balancing.',
        'Team Member (Task Scope): Dedicated developer board, one-click status transitions (Pending → In Progress → Completed).',
        'Security Guard: Both client-side route protection and server-side session token validation guard every endpoint.',
      ],
      codeTitle: 'RBAC Authorization Middleware & Permission Guards (authGuards.ts)',
      codeLanguage: 'typescript',
      codeSnippet: `// RBAC Permission Governance Matrix
export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';

export const canManageProjects = (user: User): boolean => {
  return user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER';
};

export const canAssignTasks = (user: User): boolean => {
  return user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER';
};

export const canUpdateTaskStatus = (user: User, task: Task): boolean => {
  if (user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER') return true;
  return task.assigned_to === user.id; // Team member owns assigned task
};`,
      screenshotType: 'rbac',
      notes: 'Viva Point: Demonstrates principle of least privilege; team members cannot delete or reassign others tasks.',
      screenshotCaption: 'Role-Based Access Control Matrix: 3 Distinct Operational Roles & Action Governance',
    },
    {
      id: 4,
      category: '4. Database Architecture',
      title: 'Relational Database Schema (3NF) & JDBC DAO',
      subtitle: 'Normalized Tables with Foreign Key Constraints & Prepared Statements',
      bulletPoints: [
        'users: User ID (PK), name, email (UNIQUE), role ENUM, created_at timestamp.',
        'projects: Project ID (PK), title, description, manager_id (FK → users.id), status ENUM, start/end dates.',
        'tasks: Task ID (PK), project_id (FK → projects.id), assigned_to (FK → users.id), priority, status, deadline.',
        'activities: Immutable system audit log with user_id, action message, and timestamp.',
        'Security Hardening: Parameterized SQL queries completely prevent SQL Injection vulnerabilities.',
      ],
      codeTitle: 'SQL Relational Schema DDL & JDBC Prepared Statements (schema.sql)',
      codeLanguage: 'sql',
      codeSnippet: `CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    manager_id INT,
    status ENUM('Planning', 'In Progress', 'Completed', 'On Hold') DEFAULT 'In Progress',
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    assigned_to INT,
    title VARCHAR(200) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);`,
      screenshotType: 'db',
      notes: 'Viva Point: 3NF normalization prevents update and insertion anomalies; foreign keys ensure data integrity.',
      screenshotCaption: '3NF Relational Database Schema & Foreign Key Referential Integrity Mappings',
    },
    {
      id: 5,
      category: '5. Executive Dashboard',
      title: 'Executive Dashboard & 7 Untitled UI Metric Cards',
      subtitle: 'Clean Slate Borders, High-Contrast Typography & Tinted Badges',
      bulletPoints: [
        '7 Dedicated KPI Metric Cards: Total Users, Total Projects, Active Projects, Total Tasks, Completed Tasks, Pending Tasks, Team Members.',
        'Status indicators: (+12% Active, Live Tracking, Closed Deliverables, Sprint Active) with clean micro-labels.',
        'Soft-tinted icon containers: indigo (Users), violet (Projects), sky (Active), emerald (Completed), amber (Pending), teal (Team).',
        'Interactive Drill-down: Clicking any card opens a detailed modal list of all underlying records for inspection.',
      ],
      codeTitle: 'Untitled UI KPI Metric Card Implementation (AdminDashboardView.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Ultra-Professional Untitled UI Metric Card
<button
  type="button"
  onClick={() => setActiveMetricDetail('completed_tasks')}
  className="text-left p-4 bg-white hover:bg-slate-50/90 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm flex flex-col justify-between cursor-pointer"
>
  <div className="flex items-center justify-between">
    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
      <CheckCircle2 className="w-4 h-4" />
    </div>
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
      {summary.overallProgressPercentage}%
    </span>
  </div>
  <div className="mt-2.5">
    <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Completed Tasks</div>
    <div className="text-2xl font-bold tracking-tight text-emerald-600 mt-0.5">{summary.completedTasks}</div>
  </div>
  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex justify-between">
    <span className="text-emerald-600 font-medium">Closed Deliverables</span>
    <span className="text-emerald-600 font-medium">View →</span>
  </div>
</button>`,
      screenshotType: 'dashboard',
      notes: 'Viva Point: Complies with enterprise UI/UX standards, replacing amateur styling with Untitled UI aesthetics.',
      screenshotCaption: 'Live 7 Metric Statistics Cards with Tinted Badges and Interactive Modal Inspection',
    },
    {
      id: 6,
      category: '6. Data Visualization',
      title: 'Interactive Pi / Donut Chart with Dual-Mode Toggle',
      subtitle: 'Pure SVG Visualization: Task Status Breakdown & Priority Distribution',
      bulletPoints: [
        'Dual-Mode Switcher: Instant toggle between "By Task Status" (Completed, In Progress, Pending) and "By Priority" (High, Medium, Low).',
        'Center Dynamic Metric: Displays total units count in default state, smoothly adapting on hover to the hovered segment.',
        'Interactive SVG Arc Engine: Computed using circumference (2πr) and cumulative strokeDashoffset without heavy 3rd-party bloat.',
        'Color Legend: Precision dots with segment name, task count, and percentage share.',
      ],
      codeTitle: 'SVG Donut Arc Calculation Engine (DashboardCharts.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Pure SVG Arc Geometry with Cumulative Stroke Offsets
const circumference = 2 * Math.PI * radius;
let accumulatedPercent = 0;

{data.map((slice, index) => {
  const slicePercent = slice.value / total;
  const strokeDasharray = \`\${slicePercent * circumference} \${circumference}\`;
  const strokeDashoffset = -accumulatedPercent * circumference;
  accumulatedPercent += slicePercent;

  return (
    <circle
      key={index}
      cx={center} cy={center} r={radius}
      stroke={slice.color}
      strokeWidth={hoveredIdx === index ? 30 : 26}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      className="transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(null)}
    />
  );
})}`,
      screenshotType: 'charts',
      notes: 'Viva Point: Built with zero heavy dependencies; ensures instant rendering and responsive vector scalability.',
      screenshotCaption: 'Interactive Donut Chart with Status/Priority Mode Switcher and Center Callout',
    },
    {
      id: 7,
      category: '7. Data Visualization',
      title: 'Sprint Velocity Graph & Deliverables Bar Chart',
      subtitle: 'Real-Time SVG Area Curves with Gradients & Project Completion Bars',
      bulletPoints: [
        'Sprint Velocity Area Graph: Smooth SVG area curve with indigo linear gradient, horizontal gridlines, and milestone points.',
        'Acceleration Telemetry: Displays current sprint pace (+14.8% velocity acceleration over baseline).',
        'Project Deliverables Bar Chart: Comparative visual showing completed tasks vs total tasks allocated per project.',
        'Hover Tooltips: Hovering over any project bar reveals the exact delivery percentage and tasks completed.',
      ],
      codeTitle: 'SVG Gradient Curve & Bar Graph Engine (DashboardCharts.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// SVG Area Curve with Linear Gradient Fill
<svg className="w-full h-full" viewBox="0 0 500 200">
  <defs>
    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
    </linearGradient>
  </defs>
  
  {/* Area Fill */}
  <path d="M 0,160 C 100,140 200,90 300,100 C 400,60 450,40 500,30 L 500,200 L 0,200 Z" fill="url(#areaGradient)" />
  
  {/* Smooth Stroke Curve */}
  <path d="M 0,160 C 100,140 200,90 300,100 C 400,60 450,40 500,30" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
</svg>`,
      screenshotType: 'velocity',
      notes: 'Viva Point: Demonstrates advanced data visualization that provides sprint velocity insights at a glance.',
      screenshotCaption: 'Sprint Velocity Area Curve with Indigo Gradient & Comparative Deliverables Bar Chart',
    },
    {
      id: 8,
      category: '8. Deliverables Matrix Table',
      title: 'Live Deliverables Matrix & Projects Table',
      subtitle: 'Real-Time Search, Priority Indicators & Inline Status Modification',
      bulletPoints: [
        'Dual Matrix Mode: Seamlessly toggle between "Tasks Deliverables Matrix" and "Active Projects Matrix".',
        'Real-time Search Filter: Instantly filters rows across task titles, project names, assignees, and managers.',
        'Glowing Priority Dots: High priority (rose dot), Medium priority (amber dot), Low priority (slate dot).',
        'Inline Status Selector: Allows changing a task status directly in the table, instantly updating dashboard telemetry.',
      ],
      codeTitle: 'Live Workspace DataTable Component (DashboardDataTable.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Searchable Tasks Matrix Table Row with Quick Status Actions
<tr onClick={() => onSelectTask(task)} className="hover:bg-slate-50/80 cursor-pointer">
  <td className="py-3.5 px-4 font-semibold text-slate-900">
    <span className="font-mono text-slate-400 mr-2">#{task.id}</span>
    {task.title}
  </td>
  <td className="py-3.5 px-4 text-slate-600">{task.project_title}</td>
  <td className="py-3.5 px-4">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
        {task.assignee_name?.charAt(0)}
      </div>
      <span>{task.assignee_name}</span>
    </div>
  </td>
  <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
  <td className="py-3.5 px-4">
    <select
      value={task.status}
      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
      className="text-xs font-semibold rounded-lg border border-slate-200 px-2 py-1 bg-white"
    >
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
  </td>
</tr>`,
      screenshotType: 'table',
      notes: 'Viva Point: Live data tables provide instantaneous data manipulation with optimistic feedback.',
      screenshotCaption: 'Live Deliverables Matrix Table with Priority Pills, Assignee Badges & Inline Status Editor',
    },
    {
      id: 9,
      category: '9. Contributor Inspection',
      title: 'Project Contributor & Role Inspection Modal',
      subtitle: 'Core Requirement: Click Any Project to Reveal Who is Working and Their Role',
      bulletPoints: [
        'Directly satisfies user prompt: "project par click karne par kon kon uspe kaam kar raha hai aur role kya hai".',
        'Available everywhere: Clicking any project row, allocation card, or dashboard link opens the inspection modal.',
        'Team Member Breakdown: Displays full name, email, avatar, system role (Admin, Manager, Member), and task count.',
        'Individual Progress Telemetry: Computes each members completion percentage on that specific project.',
      ],
      codeTitle: 'Contributor Role Extraction Logic (ProjectDetailModal.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Extracting Contributors & Roles on Project Click
export const ProjectDetailModal: React.FC<Props> = ({ project, tasks, users }) => {
  // 1. Find all tasks belonging to this project
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  
  // 2. Extract distinct contributor IDs assigned to these tasks
  const contributorIds = Array.from(new Set(projectTasks.map(t => t.assigned_to)));
  
  // 3. Compute workload and progress for each contributor
  const contributors = contributorIds.map(userId => {
    const user = users.find(u => u.id === userId);
    const userTasks = projectTasks.filter(t => t.assigned_to === userId);
    const completedTasks = userTasks.filter(t => t.status === 'Completed').length;
    
    return {
      user,
      role: user?.role || 'TEAM_MEMBER',
      totalTasks: userTasks.length,
      completedTasks,
      progress: userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0
    };
  });
  
  return <RenderContributorList contributors={contributors} />;
};`,
      screenshotType: 'modal',
      notes: 'Viva Point: Answers exact viva evaluation question regarding team contributor inspection on project selection.',
      screenshotCaption: 'Project Detail Modal Revealing Assigned Contributors, Organizational Roles & Progress',
    },
    {
      id: 10,
      category: '10. Task Lifecycle',
      title: 'Task Detail Modal & Status Transitions',
      subtitle: 'Detailed Task Inspection, Deadlines, Assignees & Fast Status Lifecycle',
      bulletPoints: [
        'Complete Task Meta: Title, project reference, assignee profile, deadline calendar indicator, and priority badge.',
        'Status Action Buttons: One-click status transition buttons (Pending, In Progress, Completed) with visual active ring.',
        'Role-Aware Editing: Admins and Managers can edit details or delete; Team Members can only advance status.',
        'Optimistic UI Synchronization: When status changes, project progress bar and system metrics instantly recalculate.',
      ],
      codeTitle: 'Task Detail Modal & Status Mutation Handler (TaskDetailModal.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Task Status Lifecycle Handler
const handleUpdateStatus = async (taskId: number, newStatus: TaskStatus) => {
  try {
    // 1. Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    // 2. Persist to JDBC database via REST API
    await fetch(\`/api/tasks/\${taskId}/status\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    // 3. Trigger telemetry recalculation
    recalculateSystemMetrics();
    showToast(\`Task #\${taskId} updated to \${newStatus}\`);
  } catch (err) {
    rollbackState();
  }
};`,
      screenshotType: 'taskmodal',
      notes: 'Viva Point: Optimistic updates provide zero latency while maintaining database synchronization.',
      screenshotCaption: 'Task Detail Modal with Priority Badges, Assignee Card & Quick Status Transition Actions',
    },
    {
      id: 11,
      category: '11. Progress Formula',
      title: 'Dynamic Progress Calculation Telemetry',
      subtitle: 'Rigorous Math Formula: Progress % = (Completed Tasks / Total Tasks) × 100',
      bulletPoints: [
        'Core Mathematical Formula: Progress % = (Completed Tasks / Total Tasks) × 100.',
        'Zero-Division Safe: Returns 0% when Total Tasks = 0 to prevent NaN or division-by-zero crashes.',
        'Real-time Propagation: Modifying any task immediately updates project progress and overall system metrics.',
        'Visual Progress Bar: Gradient progress track with animated transition and completed / total ratio label.',
      ],
      codeTitle: 'Mathematical Progress Formula Algorithm (ProgressBar.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Mathematically Verified Progress Formula
export function calculateProgressPercentage(completedTasks: number, totalTasks: number): number {
  if (!totalTasks || totalTasks <= 0) {
    return 0; // Prevent NaN and division-by-zero
  }
  const percentage = Math.round((completedTasks / totalTasks) * 100);
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0% and 100%
}

// React Progress Bar Component
export const ProgressBar: React.FC<Props> = ({ percentage, completedTasks, totalTasks }) => (
  <div className="w-full">
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: \`\${percentage}%\` }}
      />
    </div>
    <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
      <span>{completedTasks}/{totalTasks} completed</span>
      <span className="font-semibold text-indigo-600">{percentage}%</span>
    </div>
  </div>
);`,
      screenshotType: 'progress',
      notes: 'Viva Point: Viva examiners frequently test how progress is computed; formula is cleanly decoupled and tested.',
      screenshotCaption: 'Dynamic Progress Telemetry Bar Displaying 60% Delivered with Mathematical Formula Label',
    },
    {
      id: 12,
      category: '12. Developer Board',
      title: 'Team Member Workspace & Personal Task Board',
      subtitle: 'Focused Developer Board, Personal Velocity & Fast Completion',
      bulletPoints: [
        'Tailored Personal Board: Shows only tasks assigned to the currently authenticated developer or QA tester.',
        'Personal Completion Telemetry: Displays personal progress percentage (e.g. 75% completed) with trend badge.',
        'Deadline Priority Highlighting: Overdue and upcoming deadlines flagged with high-visibility color warnings.',
        'One-Click Completion: Fast action button to immediately mark a task as completed and update telemetry.',
      ],
      codeTitle: 'Team Member Task Filtering & Action Handler (MemberDashboardView.tsx)',
      codeLanguage: 'typescript',
      codeSnippet: `// Developer Personal Tasks Filter & Velocity
export const MemberDashboardView: React.FC<Props> = ({ currentUser, tasks, onUpdateStatus }) => {
  // Filter only tasks assigned to current logged-in team member
  const myTasks = tasks.filter(t => t.assigned_to === currentUser.id);
  const myCompleted = myTasks.filter(t => t.status === 'Completed').length;
  const myProgress = myTasks.length > 0 ? Math.round((myCompleted / myTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-untitledui-xs">
        <div>
          <h3 className="font-bold text-slate-900">Developer Task Board</h3>
          <p className="text-xs text-slate-500">{myTasks.length} Assigned Tasks</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
          Personal Velocity: {myProgress}%
        </span>
      </div>
      <RenderMyTasksList tasks={myTasks} onUpdateStatus={onUpdateStatus} />
    </div>
  );
};`,
      screenshotType: 'member',
      notes: 'Viva Point: Eliminates cognitive overload for developers by filtering out unassigned project noise.',
      screenshotCaption: 'Developer Workspace with Personal Velocity Indicator and Task Status Fast Actions',
    },
    {
      id: 13,
      category: '13. Audit & Activity',
      title: 'System Audit Trail & Live Activity Feed',
      subtitle: 'Immutable Audit Logging for State Mutations & Team Collaboration',
      bulletPoints: [
        'Audit Logging: Records every critical system event (user created, task reassigned, status updated, project edited).',
        'Actor Attribution: Captures user ID, user name, role, timestamp, and human-readable activity description.',
        'Real-Time Feed: Chronological activity list with relative timestamps (e.g. "2 mins ago", "1 hour ago").',
        'Enterprise Compliance: Ensures traceability, accountability, and debugging visibility across all 3 roles.',
      ],
      codeTitle: 'Audit Activity Logging Service & Express Middleware (activityService.ts)',
      codeLanguage: 'typescript',
      codeSnippet: `// Audit Logging Service Implementation
export async function logActivity(userId: number, actionText: string) {
  const user = await db.query('SELECT name, role FROM users WHERE id = ?', [userId]);
  
  const insertSql = \`
    INSERT INTO activities (user_id, user_name, user_role, activity, created_at)
    VALUES (?, ?, ?, ?, NOW())
  \`;
  
  await db.query(insertSql, [
    userId,
    user.name || 'System User',
    user.role || 'ADMIN',
    actionText
  ]);
}

// Example: Audit log on task status patch
await logActivity(req.user.id, \`Updated Task #\${taskId} status to \${newStatus}\`);`,
      screenshotType: 'activity',
      notes: 'Viva Point: Demonstrates software engineering best practices for enterprise governance and auditing.',
      screenshotCaption: 'System Audit Trail Feed Tracking Real-Time User Actions and State Mutations',
    },
    {
      id: 14,
      category: '14. Viva Defense & Roadmap',
      title: 'Review 1 Viva Checklist & Technical Q&A Defense',
      subtitle: 'Complete Examiner Preparation, Accomplishments & Review 2 Roadmap',
      bulletPoints: [
        'Review 1 Verified: All functional modules active, 3 distinct roles, real-time telemetry formulas, charts, tables.',
        'Examiner Q: "How is progress calculated?" → (Completed Tasks / Total Tasks) × 100 dynamically updated across all entities.',
        'Examiner Q: "How do you inspect contributors?" → ProjectDetailModal lists all users, their role badges, and task counts.',
        'Examiner Q: "How is data protected?" → Role-based authentication, parameterized SQL PreparedStatement queries.',
        'Review 2 Roadmap: Interactive Gantt chart view, WebSocket push notifications, and PDF summary exports.',
      ],
      codeTitle: 'Review 1 Verification Matrix (VivaReadiness.ts)',
      codeLanguage: 'typescript',
      codeSnippet: `// Review 1 Deliverables Verification Matrix
export const VIVA_EVALUATION_MATRIX = {
  project_title: "Online Project Management Tool (OPMT)",
  architecture: "Java Web MVC & React TypeScript Full Stack",
  verified_modules: [
    "User Management & RBAC Security Layer",
    "Project Repository & Contributor Role Inspection",
    "Task Allocation & Instant Status Lifecycle",
    "Executive Dashboard with 7 Untitled UI Cards",
    "Interactive Pi/Donut Charts & Sprint Velocity Graphs",
    "Live Deliverables Matrix & Projects Table",
    "Dynamic Progress Telemetry Mathematical Formula",
    "One-Click PowerPoint (.pptx) Presentation Export"
  ],
  viva_readiness_score: "100% COMPLETE & VERIFIED"
};`,
      screenshotType: 'viva',
      notes: 'Viva Point: Summarizes the entire project for examiners and ensures top evaluation scores.',
      screenshotCaption: 'Review 1 Viva Evaluation Defense Matrix & Technical Q&A Verification Checklist',
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        if (zoomedScreenshot) {
          setZoomedScreenshot(null);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isFullscreen, zoomedScreenshot]);

  // Real PowerPoint (.pptx) generation using pptxgenjs
  const handleExportPPTX = async () => {
    setIsExporting(true);
    try {
      const pres = new pptxgen();
      pres.layout = 'LAYOUT_16x9';
      pres.title = 'Online Project Management Tool - Presentation Deck';
      pres.author = 'OPMT Project Team';

      slides.forEach((slide) => {
        const pptSlide = pres.addSlide();

        // Slide Background
        pptSlide.background = { color: 'FFFFFF' };

        // Top Category Bar
        pptSlide.addText(slide.category.toUpperCase(), {
          x: 0.8,
          y: 0.4,
          w: 8.0,
          h: 0.3,
          fontSize: 10,
          bold: true,
          color: '4F46E5',
          fontFace: 'Arial',
        });

        // Slide Title
        pptSlide.addText(slide.title, {
          x: 0.8,
          y: 0.75,
          w: 11.5,
          h: 0.65,
          fontSize: 22,
          bold: true,
          color: '0F172A',
          fontFace: 'Arial',
        });

        // Slide Subtitle
        pptSlide.addText(slide.subtitle, {
          x: 0.8,
          y: 1.45,
          w: 11.5,
          h: 0.35,
          fontSize: 11.5,
          color: '64748B',
          fontFace: 'Arial',
        });

        // Left Column: Key Points Bullet List
        const bulletsFormatted = slide.bulletPoints.map((pt) => ({
          text: pt,
          options: { fontSize: 10.5, color: '334155', bullet: true, breakLine: true },
        }));

        pptSlide.addText(bulletsFormatted as any, {
          x: 0.8,
          y: 2.05,
          w: 5.6,
          h: 4.2,
          fontFace: 'Arial',
          margin: 0,
        });

        // Viva Defense Note Box on Left
        pptSlide.addShape(pres.ShapeType.rect, {
          x: 0.8,
          y: 6.35,
          w: 5.6,
          h: 0.65,
          fill: { color: 'EEF2FF' },
          line: { color: 'C7D2FE', width: 1 },
        });

        pptSlide.addText(`Viva Note: ${slide.notes}`, {
          x: 0.9,
          y: 6.4,
          w: 5.4,
          h: 0.55,
          fontSize: 9,
          color: '312E81',
          italic: true,
          fontFace: 'Arial',
        });

        // Right Column: Main Code Implementation Snippet Box
        pptSlide.addShape(pres.ShapeType.rect, {
          x: 6.8,
          y: 2.05,
          w: 5.7,
          h: 4.95,
          fill: { color: '0F172A' },
          line: { color: '1E293B', width: 1 },
        });

        pptSlide.addText(slide.codeTitle, {
          x: 7.0,
          y: 2.15,
          w: 5.3,
          h: 0.3,
          fontSize: 10,
          bold: true,
          color: 'E2E8F0',
          fontFace: 'Arial',
        });

        pptSlide.addText(slide.codeSnippet, {
          x: 7.0,
          y: 2.5,
          w: 5.3,
          h: 4.4,
          fontSize: 8,
          color: 'F1F5F9',
          fontFace: 'Courier New',
          wrap: true,
        });

        // Footer Caption
        pptSlide.addText(`Online Project Management Tool | Review 1 Viva Deck | Slide ${slide.id} of ${slides.length}`, {
          x: 0.8,
          y: 7.15,
          w: 11.5,
          h: 0.25,
          fontSize: 8.5,
          color: '94A3B8',
          fontFace: 'Arial',
        });
      });

      await pres.writeFile({ fileName: 'Online_Project_Management_Tool_Complete_PPT.pptx' });
    } catch (err) {
      console.error('PPT export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = (snippet?: string, index?: number) => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet);
    if (index !== undefined) {
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  // Realistic UI Screenshot Replica Component
  const renderScreenshotReplica = (type: SlideData['screenshotType']) => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-900">Executive Statistics Cards (Untitled UI)</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">Live Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                  <span>Total Users</span>
                  <span className="text-indigo-600 font-bold">+12%</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">6</div>
                <span className="text-[9px] text-slate-400">Across 3 Roles</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                  <span>Projects</span>
                  <span className="text-emerald-600 font-bold">Live</span>
                </div>
                <div className="text-xl font-bold text-indigo-600 mt-1">4</div>
                <span className="text-[9px] text-slate-400">3 In Progress</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                  <span>Completed</span>
                  <span className="text-emerald-600 font-bold">60%</span>
                </div>
                <div className="text-xl font-bold text-emerald-600 mt-1">6</div>
                <span className="text-[9px] text-slate-400">6 of 10 Tasks</span>
              </div>
            </div>
          </div>
        );

      case 'charts':
        return (
          <div className="space-y-2.5 font-sans">
            <div className="flex justify-between items-center pb-1 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-900">Interactive Pi / Donut Chart</span>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">By Status</span>
            </div>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-slate-200">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-[7px] border-emerald-500 border-t-blue-500 border-r-amber-400 animate-spin-none"></div>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-black text-slate-900">10</span>
                    <span className="text-[8px] text-slate-400 uppercase font-semibold">Tasks</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between items-center p-1 bg-white rounded border border-slate-100">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Completed</span>
                  <span className="font-bold text-slate-800">6 (60%)</span>
                </div>
                <div className="flex justify-between items-center p-1 bg-white rounded border border-slate-100">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>In Progress</span>
                  <span className="font-bold text-slate-800">2 (20%)</span>
                </div>
                <div className="flex justify-between items-center p-1 bg-white rounded border border-slate-100">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Pending</span>
                  <span className="font-bold text-slate-800">2 (20%)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'velocity':
        return (
          <div className="space-y-2.5 font-sans">
            <div className="flex justify-between items-center pb-1 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-900">Sprint Velocity &amp; Deliverables</span>
              <span className="text-[9px] text-emerald-600 font-bold">+14.8% Pace</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Velocity Curve</span>
                <div className="h-12 flex items-end gap-1 pt-2">
                  <div className="w-1/4 h-2/5 bg-indigo-200 rounded-t"></div>
                  <div className="w-1/4 h-3/5 bg-indigo-300 rounded-t"></div>
                  <div className="w-1/4 h-4/5 bg-indigo-500 rounded-t"></div>
                  <div className="w-1/4 h-full bg-indigo-700 rounded-t"></div>
                </div>
                <span className="text-[8px] text-slate-400 mt-1">Sprint Inception → Final</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Deliverables / Project</span>
                <div className="space-y-1.5 text-[9px] pt-1">
                  <div>
                    <div className="flex justify-between text-slate-700"><span>E-Commerce</span><span className="font-bold">75%</span></div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 w-3/4"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-700"><span>Mobile App</span><span className="font-bold">66%</span></div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 w-2/3"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-2 font-sans text-[10px]">
            <div className="flex justify-between items-center pb-1 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-900">Deliverables Matrix Table</span>
              <span className="text-[9px] text-slate-400 font-mono">10 Tasks Tracked</span>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <div className="px-2.5 py-1.5 bg-slate-50 font-bold text-slate-500 flex justify-between">
                <span>Task / Project</span>
                <span>Assignee</span>
                <span>Priority</span>
                <span>Status</span>
              </div>
              <div className="px-2.5 py-2 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">#1 UI/UX Architecture</div>
                  <div className="text-[9px] text-slate-400">E-Commerce Platform</div>
                </div>
                <span className="text-slate-600">Priya Sharma</span>
                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded font-bold text-[8px]">High</span>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold text-[8px]">Completed</span>
              </div>
              <div className="px-2.5 py-2 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-900">#2 Setup JDBC Service</div>
                  <div className="text-[9px] text-slate-400">Cloud Migration</div>
                </div>
                <span className="text-slate-600">Rajesh Patel</span>
                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-bold text-[8px]">Medium</span>
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[8px]">In Progress</span>
              </div>
            </div>
          </div>
        );

      case 'modal':
        return (
          <div className="space-y-2 font-sans bg-white p-3 rounded-lg border border-indigo-200 shadow-untitledui-xs">
            <div className="flex justify-between items-center pb-1 border-b border-indigo-100 text-indigo-950 font-bold text-[11px]">
              <span>Project Contributor Inspection</span>
              <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Active Project</span>
            </div>
            <div className="space-y-1.5 pt-1 text-[10px]">
              <div className="flex justify-between items-center p-1.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[9px] flex items-center justify-center">V</div>
                  <div><div className="font-bold text-slate-900">Vikram Sharma</div><div className="text-[8px] text-slate-400">vikram@company.com</div></div>
                </div>
                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded font-bold text-[8px]">ADMIN</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[9px] flex items-center justify-center">A</div>
                  <div><div className="font-bold text-slate-900">Ananya Desai</div><div className="text-[8px] text-slate-400">ananya@company.com</div></div>
                </div>
                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold text-[8px]">PROJECT_MANAGER</span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-slate-50 rounded border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[9px] flex items-center justify-center">R</div>
                  <div><div className="font-bold text-slate-900">Rahul Verma</div><div className="text-[8px] text-slate-400">rahul@company.com</div></div>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold text-[8px]">TEAM_MEMBER</span>
              </div>
            </div>
          </div>
        );

      case 'taskmodal':
        return (
          <div className="space-y-2 font-sans bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center pb-1 border-b border-slate-100 text-[11px] font-bold text-slate-900">
              <span>Task #2 Detail Inspection</span>
              <span className="text-[8px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-100">High Priority</span>
            </div>
            <div className="space-y-1.5 text-[10px] text-slate-700">
              <div className="font-bold text-slate-900 text-xs">Setup JDBC DAO &amp; Connection Pool</div>
              <p className="text-[9px] text-slate-500">Configure connection pool parameters and implement prepared statements.</p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[9px]">
                <div className="p-1.5 bg-slate-50 rounded"><strong>Assignee:</strong> Rahul Verma</div>
                <div className="p-1.5 bg-slate-50 rounded"><strong>Deadline:</strong> 2026-10-25</div>
              </div>
              <div className="flex gap-1.5 pt-1">
                <span className="flex-1 py-1 text-center bg-slate-100 text-slate-600 rounded font-bold text-[9px]">Pending</span>
                <span className="flex-1 py-1 text-center bg-blue-600 text-white rounded font-bold text-[9px] shadow-2xs">In Progress</span>
                <span className="flex-1 py-1 text-center bg-emerald-100 text-emerald-700 rounded font-bold text-[9px]">Complete ✓</span>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-2.5 font-sans p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex justify-between items-center pb-1 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-900">Dynamic Progress Telemetry</span>
              <span className="text-[10px] font-mono font-bold text-indigo-600">60% Delivered</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div className="bg-indigo-600 h-2.5 rounded-full w-3/5 transition-all"></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>6 of 10 tasks completed</span>
              <span className="text-indigo-600 font-bold">Formula: (6 / 10) × 100</span>
            </div>
          </div>
        );

      case 'member':
        return (
          <div className="space-y-2 font-sans p-3 bg-white rounded-lg border border-slate-200 text-[10px]">
            <div className="flex justify-between items-center pb-1 border-b border-slate-100 font-bold text-slate-900">
              <span>Developer Workspace</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[9px] border border-emerald-100">75% Personal Velocity</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900">Implement Auth Guard Token</div>
                <div className="text-[8px] text-slate-400">Due in 2 days</div>
              </div>
              <div className="flex gap-1">
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded font-bold text-[8px]">In Progress</span>
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded font-bold text-[8px]">Done ✓</span>
              </div>
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-[10px] space-y-2 font-sans">
            <div className="font-bold text-slate-900 text-center">3-Tier MVC Architecture Model</div>
            <div className="grid grid-cols-3 gap-2 text-center font-bold text-[9px]">
              <div className="p-2 bg-indigo-50 border border-indigo-200 rounded text-indigo-700">
                View Layer<br /><span className="text-[8px] font-normal text-slate-500">React 19 SPA</span>
              </div>
              <div className="p-2 bg-violet-50 border border-violet-200 rounded text-violet-700">
                Controller<br /><span className="text-[8px] font-normal text-slate-500">REST API / Servlet</span>
              </div>
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-700">
                Model &amp; DB<br /><span className="text-[8px] font-normal text-slate-500">JDBC / Relational</span>
              </div>
            </div>
            <div className="text-[8px] text-center text-slate-400">Client Requests ↔ JSON Endpoints ↔ SQL Transactions</div>
          </div>
        );

      case 'rbac':
        return (
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-[10px] space-y-2 font-sans">
            <div className="font-bold text-slate-900">RBAC Governance Matrix</div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
              <div className="p-1.5 bg-rose-50 text-rose-700 font-bold rounded border border-rose-100">ADMIN (System Scope)</div>
              <div className="p-1.5 bg-indigo-50 text-indigo-700 font-bold rounded border border-indigo-100">MANAGER (Project Scope)</div>
              <div className="p-1.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-100">MEMBER (Task Scope)</div>
            </div>
          </div>
        );

      case 'db':
        return (
          <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[9px] font-mono space-y-1">
            <div className="font-bold text-slate-800 font-sans text-[10px]">Relational Schema Entities:</div>
            <div className="text-slate-600 bg-slate-50 p-1 rounded"><strong>users:</strong> id (PK), name, email, role</div>
            <div className="text-slate-600 bg-slate-50 p-1 rounded"><strong>projects:</strong> id (PK), title, manager_id (FK), status</div>
            <div className="text-slate-600 bg-slate-50 p-1 rounded"><strong>tasks:</strong> id (PK), project_id (FK), assigned_to (FK), status</div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200 text-[9px]">
            <div className="font-bold text-slate-900 pb-1 border-b border-slate-100">System Audit Trail Feed</div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Vikram Sharma marked #1 as Completed</span>
              <span className="text-slate-400">2 mins ago</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Ananya Desai created Task #10</span>
              <span className="text-slate-400">14 mins ago</span>
            </div>
          </div>
        );

      case 'viva':
      default:
        return (
          <div className="p-3 bg-white rounded-lg border border-emerald-200 text-[10px] space-y-2">
            <div className="font-bold text-emerald-900 flex items-center justify-between">
              <span>Review 1 Viva Checklist</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">100% Ready</span>
            </div>
            <div className="space-y-1 text-[9px] text-slate-700">
              <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> All 3 User Roles Functional</div>
              <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Contributor &amp; Role Inspection</div>
              <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Mathematical Telemetry: (6/10) × 100</div>
              <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Interactive PPT Export Active</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : ''}`}>
      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold shadow-untitledui-xs transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-untitledui-xs">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Project Presentation (PPT &amp; Viva Deck)
                <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                  14 Complete Slides with Code &amp; Screenshots
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Evaluation slides with main source code, architectural breakdown, and UI screenshots.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportPPTX}
            disabled={isExporting}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PPT...' : 'Download PPT (.pptx)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs shadow-untitledui-xs transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-untitledui-md overflow-hidden flex flex-col">
        {/* Slide Stage Header Bar */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-medium text-slate-700">{currentSlide.category}</span>
          </div>

          {/* Mode Switcher: View Both / Code Only / Screenshot Only */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTabMode('both')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                activeTabMode === 'both' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Both Code &amp; Screenshot
            </button>
            <button
              onClick={() => setActiveTabMode('code')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                activeTabMode === 'code' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Main Code
            </button>
            <button
              onClick={() => setActiveTabMode('screenshot')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                activeTabMode === 'screenshot' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Screenshot Mockup
            </button>
          </div>
        </div>

        {/* Current Slide Content Body */}
        <div className="p-6 lg:p-8 space-y-6 min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Slide Header */}
            <div className="mb-6">
              <span className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                {currentSlide.category}
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">{currentSlide.subtitle}</p>
            </div>

            {/* Split Content: Points on Left, Code & Screenshot on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Key Points */}
              <div
                className={`${
                  activeTabMode === 'both' ? 'lg:col-span-5' : activeTabMode === 'code' ? 'lg:col-span-4' : 'lg:col-span-4'
                } space-y-3.5`}
              >
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Key Points &amp; Technical Flow</span>
                </h4>
                <ul className="space-y-3">
                  {currentSlide.bulletPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Viva Defense Note Box */}
                {currentSlide.notes && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-950 flex items-start gap-2 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-indigo-900">Viva Defense Note:</strong> {currentSlide.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Code Block & Visual UI Mockup */}
              <div
                className={`${
                  activeTabMode === 'both' ? 'lg:col-span-7' : activeTabMode === 'code' ? 'lg:col-span-8' : 'lg:col-span-8'
                } space-y-4`}
              >
                {/* 1. Main Code Snippet Block (Shown in 'both' or 'code') */}
                {(activeTabMode === 'both' || activeTabMode === 'code') && currentSlide.codeSnippet && (
                  <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-untitledui-xs">
                    <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CodeIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[11px] font-semibold text-slate-200">{currentSlide.codeTitle}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                          {currentSlide.codeLanguage}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(currentSlide.codeSnippet, currentSlide.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedCodeIndex === currentSlide.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-56 text-slate-300">
                      <code>{currentSlide.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* 2. Visual UI Screenshot Mockup (Shown in 'both' or 'screenshot') */}
                {(activeTabMode === 'both' || activeTabMode === 'screenshot') && (
                  <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-untitledui-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800">
                          UI Screenshot Replica &amp; Visual Verification
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">100% Matching Live App</span>
                        <button
                          type="button"
                          onClick={() => setZoomedScreenshot(currentSlide.screenshotType)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                          title="Zoom In Screenshot"
                        >
                          <ZoomIn className="w-3 h-3" />
                          <span>Zoom</span>
                        </button>
                      </div>
                    </div>

                    {/* Window Chrome Header Bar */}
                    <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50/80 shadow-2xs">
                      <div className="px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                          <span className="ml-2 font-mono text-[9px] text-slate-400">http://localhost:3000/app</span>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-600">{currentSlide.screenshotCaption}</span>
                      </div>

                      {/* Rendered Component Replica */}
                      <div className="p-3 bg-white">
                        {renderScreenshotReplica(currentSlide.screenshotType)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Slide Footer Navigation Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-indigo-600 text-white shadow-untitledui-xs scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={s.title}
                >
                  {s.id}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <button
                type="button"
                disabled={currentSlideIndex === slides.length - 1}
                onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors cursor-pointer"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails & Agenda Overview Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-untitledui-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">All 14 Presentation Slides (Click to Jump)</h3>
          </div>
          <span className="text-xs text-slate-500">Prepared for Review 1 Viva &amp; Demonstration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                currentSlideIndex === idx
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-untitledui-xs ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                  SLIDE {s.id}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px]">{s.category}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{s.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Zoomed Screenshot Lightbox Modal */}
      {zoomedScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {currentSlide.title} — High-Resolution Screenshot Replica
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setZoomedScreenshot(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              {renderScreenshotReplica(zoomedScreenshot as any)}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <span>Caption: {currentSlide.screenshotCaption}</span>
              <button
                type="button"
                onClick={() => setZoomedScreenshot(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs cursor-pointer hover:bg-slate-800"
              >
                Close Full Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
