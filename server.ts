import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Relational Database implementing the MySQL 'project_management' schema
interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string; // hashed/demo
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
  created_at: string;
}

interface ProjectRecord {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  manager_id: number;
  created_at: string;
}

interface TaskRecord {
  id: number;
  title: string;
  description: string;
  project_id: number;
  assigned_to: number;
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
}

interface ProjectMemberRecord {
  id: number;
  project_id: number;
  user_id: number;
}

interface ActivityRecord {
  id: number;
  user_id: number;
  activity: string;
  created_at: string;
}

interface SystemSettingRecord {
  id: number;
  setting_name: string;
  setting_value: string;
}

// Initial Data mirroring sample data in database/schema.sql
let usersTable: UserRecord[] = [
  { id: 1, name: 'Dr. Rajesh Sharma (Admin)', email: 'admin@example.com', password: 'admin123', role: 'ADMIN', created_at: '2026-09-01 09:00:00' },
  { id: 2, name: 'Priya Verma (Project Manager)', email: 'manager@example.com', password: 'manager123', role: 'PROJECT_MANAGER', created_at: '2026-09-02 10:15:00' },
  { id: 3, name: 'Amit Kumar (Project Manager)', email: 'amit.manager@example.com', password: 'manager123', role: 'PROJECT_MANAGER', created_at: '2026-09-03 11:30:00' },
  { id: 4, name: 'Rahul Patel (Developer)', email: 'member@example.com', password: 'member123', role: 'TEAM_MEMBER', created_at: '2026-09-04 12:00:00' },
  { id: 5, name: 'Sneha Reddy (Frontend Engineer)', email: 'sneha@example.com', password: 'member123', role: 'TEAM_MEMBER', created_at: '2026-09-05 14:20:00' },
  { id: 6, name: 'Vikram Singh (Backend Engineer)', email: 'vikram@example.com', password: 'member123', role: 'TEAM_MEMBER', created_at: '2026-09-06 15:45:00' },
  { id: 7, name: 'Ananya Gupta (QA Analyst)', email: 'ananya@example.com', password: 'member123', role: 'TEAM_MEMBER', created_at: '2026-09-07 16:10:00' },
];

let projectsTable: ProjectRecord[] = [
  {
    id: 101,
    title: 'Online Shopping Portal Redesign',
    description: 'Enterprise e-commerce redesign with secure checkout, inventory sync, and real-time order tracking.',
    start_date: '2026-09-15',
    end_date: '2026-11-30',
    status: 'In Progress',
    manager_id: 2,
    created_at: '2026-09-15 10:00:00',
  },
  {
    id: 102,
    title: 'Hospital Management & EHR System',
    description: 'Automated patient admission, doctor scheduling, electronic health records, and billing system.',
    start_date: '2026-08-01',
    end_date: '2026-10-25',
    status: 'In Progress',
    manager_id: 2,
    created_at: '2026-08-01 09:30:00',
  },
  {
    id: 103,
    title: 'University Examination & Result ERP',
    description: 'Secure student portal for hall tickets, GPA calculation, online grading, and transcript issuance.',
    start_date: '2026-07-10',
    end_date: '2026-09-20',
    status: 'Completed',
    manager_id: 3,
    created_at: '2026-07-10 11:00:00',
  },
  {
    id: 104,
    title: 'AI Smart Traffic Monitoring System',
    description: 'IoT sensor and camera-based traffic density optimizer for urban junction management.',
    start_date: '2026-10-01',
    end_date: '2026-12-31',
    status: 'Planning',
    manager_id: 3,
    created_at: '2026-10-01 08:45:00',
  },
];

let tasksTable: TaskRecord[] = [
  {
    id: 1001,
    title: 'Implement User Authentication & Session Security',
    description: 'Build robust login flow with role-based session control and timeout validation.',
    project_id: 101,
    assigned_to: 4,
    priority: 'High',
    deadline: '2026-10-15',
    status: 'Completed',
    created_at: '2026-09-16 10:00:00',
    updated_at: '2026-09-25 14:00:00',
  },
  {
    id: 1002,
    title: 'Design Responsive Shopping Cart UI',
    description: 'Create modern shopping cart page using Tailwind / Bootstrap with smooth transitions.',
    project_id: 101,
    assigned_to: 5,
    priority: 'High',
    deadline: '2026-10-20',
    status: 'In Progress',
    created_at: '2026-09-17 11:30:00',
    updated_at: '2026-10-02 16:30:00',
  },
  {
    id: 1003,
    title: 'Integrate Payment Gateway & Webhook listener',
    description: 'Setup Stripe / Razorpay API integration with HMAC signature verification.',
    project_id: 101,
    assigned_to: 6,
    priority: 'High',
    deadline: '2026-10-28',
    status: 'Pending',
    created_at: '2026-09-18 09:15:00',
    updated_at: '2026-09-18 09:15:00',
  },
  {
    id: 1004,
    title: 'Cart & Checkout Integration Testing',
    description: 'Perform end-to-end integration and regression test suites for checkout flow.',
    project_id: 101,
    assigned_to: 7,
    priority: 'Medium',
    deadline: '2026-11-05',
    status: 'Pending',
    created_at: '2026-09-20 13:00:00',
    updated_at: '2026-09-20 13:00:00',
  },
  {
    id: 1005,
    title: 'Doctor Appointment Slot Booking API',
    description: 'RESTful endpoint with concurrency lock to prevent double booking of time slots.',
    project_id: 102,
    assigned_to: 6,
    priority: 'High',
    deadline: '2026-10-12',
    status: 'Completed',
    created_at: '2026-08-05 10:00:00',
    updated_at: '2026-08-28 17:00:00',
  },
  {
    id: 1006,
    title: 'Patient Electronic Prescription PDF Generator',
    description: 'Generate digitally signed prescription documents using iText library.',
    project_id: 102,
    assigned_to: 4,
    priority: 'Medium',
    deadline: '2026-10-18',
    status: 'Completed',
    created_at: '2026-08-10 14:00:00',
    updated_at: '2026-09-05 11:20:00',
  },
  {
    id: 1007,
    title: 'Billing Module & Insurance Claim Sync',
    description: 'Implement automated deductible calculation and insurer EDI submission.',
    project_id: 102,
    assigned_to: 5,
    priority: 'High',
    deadline: '2026-10-24',
    status: 'In Progress',
    created_at: '2026-08-15 11:00:00',
    updated_at: '2026-10-04 15:40:00',
  },
  {
    id: 1008,
    title: 'Student Transcript Cryptographic Verification',
    description: 'QR code verification generator for official grade transcripts.',
    project_id: 103,
    assigned_to: 6,
    priority: 'High',
    deadline: '2026-09-10',
    status: 'Completed',
    created_at: '2026-07-15 09:00:00',
    updated_at: '2026-09-08 12:00:00',
  },
  {
    id: 1009,
    title: 'Grade Point Average (GPA) Automated Batch Processor',
    description: 'Nightly batch job executing credit-hour weighted average computation.',
    project_id: 103,
    assigned_to: 4,
    priority: 'Medium',
    deadline: '2026-09-18',
    status: 'Completed',
    created_at: '2026-07-20 10:30:00',
    updated_at: '2026-09-15 16:30:00',
  },
  {
    id: 1010,
    title: 'Camera Feed Object Detection Model Integration',
    description: 'RTSP stream ingestion pipeline with OpenCV vehicle count classifier.',
    project_id: 104,
    assigned_to: 4,
    priority: 'Medium',
    deadline: '2026-11-15',
    status: 'Pending',
    created_at: '2026-10-02 09:00:00',
    updated_at: '2026-10-02 09:00:00',
  },
];

let activitiesTable: ActivityRecord[] = [
  { id: 501, user_id: 1, activity: 'Admin Dr. Rajesh Sharma logged into the system.', created_at: '2026-10-08 08:00:00' },
  { id: 502, user_id: 2, activity: 'Project Manager Priya Verma updated task "Design Responsive Shopping Cart UI" to In Progress.', created_at: '2026-10-07 14:30:00' },
  { id: 503, user_id: 4, activity: 'Team Member Rahul Patel completed task "Implement User Authentication & Session Security".', created_at: '2026-10-06 17:15:00' },
  { id: 504, user_id: 3, activity: 'Project Manager Amit Kumar created project "AI Smart Traffic Monitoring System".', created_at: '2026-10-01 08:45:00' },
  { id: 505, user_id: 1, activity: 'Admin configured system setting: Notification Daemon Thread set to ENABLED.', created_at: '2026-09-28 10:10:00' },
];

let systemSettingsTable: SystemSettingRecord[] = [
  { id: 1, setting_name: 'app_name', setting_value: 'Online Project Management Tool (OPMT Enterprise)' },
  { id: 2, setting_name: 'institution_name', setting_value: 'Galgotias University / GUVI CSE Review' },
  { id: 3, setting_name: 'academic_session', setting_value: '2026-2027' },
  { id: 4, setting_name: 'session_timeout_minutes', setting_value: '30' },
  { id: 5, setting_name: 'allow_member_self_registration', setting_value: 'false' },
  { id: 6, setting_name: 'background_thread_daemon', setting_value: 'ENABLED' },
  { id: 7, setting_name: 'default_task_deadline_days', setting_value: '14' },
];

// Helper: Active session storage (Simulates Java HttpSession)
interface SessionData {
  userId: number;
  email: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
  name: string;
  createdAt: number;
}

const activeSessions = new Map<string, SessionData>();

function recordActivity(userId: number, activityText: string) {
  const newActivity: ActivityRecord = {
    id: activitiesTable.length > 0 ? Math.max(...activitiesTable.map(a => a.id)) + 1 : 1,
    user_id: userId,
    activity: activityText,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  activitiesTable.unshift(newActivity);
  if (activitiesTable.length > 50) {
    activitiesTable = activitiesTable.slice(0, 50);
  }
}

// Background Thread simulation (Mirrors Java NotificationDaemonThread & AuditLogThread)
let backgroundThreadCycleCount = 0;
setInterval(() => {
  backgroundThreadCycleCount++;
  // Every cycle, checks deadlines and updates memory metrics
}, 60000);

// Authentication & Session Middleware (Mirrors Java AuthFilter)
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization?.replace('Bearer ', '') || (req.headers['x-session-token'] as string))?.trim();
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session missing or expired. Please login.' });
  }
  (req as any).user = activeSessions.get(token);
  next();
};

const requireRole = (allowedRoles: ('ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as SessionData;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: ${user?.role || 'Guest'}` });
    }
    next();
  };
};

/* ==========================================================================
   AUTHENTICATION & SESSION CONTROLLERS (Mirrors LoginServlet, LogoutServlet)
   ========================================================================== */

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = usersTable.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
  }

  // Create HttpSession token
  const sessionToken = `JSESSIONID_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const sessionData: SessionData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: Date.now(),
  };

  activeSessions.set(sessionToken, sessionData);
  recordActivity(user.id, `${user.role} "${user.name}" logged in successfully via LoginServlet.`);

  return res.json({
    message: 'Login successful.',
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email address format.' });
  }

  if (usersTable.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email/ID already exists.' });
  }

  const assignedRole = ['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'].includes(role) ? role : 'TEAM_MEMBER';
  const newId = usersTable.length > 0 ? Math.max(...usersTable.map(u => u.id)) + 1 : 1;

  const newUser: UserRecord = {
    id: newId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    role: assignedRole,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  usersTable.push(newUser);

  const sessionToken = `JSESSIONID_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const sessionData: SessionData = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
    createdAt: Date.now(),
  };

  activeSessions.set(sessionToken, sessionData);
  recordActivity(newUser.id, `New user "${newUser.name}" created account with role ${newUser.role}.`);

  return res.status(201).json({
    message: 'Account created successfully.',
    sessionToken,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  const user = usersTable.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'No user account found with this email / ID.' });
  }

  user.password = newPassword.trim();
  recordActivity(user.id, `Password was reset for user "${user.name}" (${user.email}).`);

  return res.json({
    message: 'Password reset successfully! You can now log in with your new password.',
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = (req.headers.authorization?.replace('Bearer ', '') || (req.headers['x-session-token'] as string))?.trim();
  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    if (session) {
      recordActivity(session.userId, `${session.role} "${session.name}" logged out. HttpSession invalidated.`);
    }
    activeSessions.delete(token);
  }
  return res.json({ message: 'Session invalidated. Logged out successfully.' });
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const session = (req as any).user as SessionData;
  const user = usersTable.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
  });
});

/* ==========================================================================
   USERS CONTROLLER (Mirrors UserServlet & UserDAO)
   ========================================================================== */

app.get('/api/users', requireAuth, (req: Request, res: Response) => {
  const { search, role } = req.query;
  let results = usersTable.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
  }));

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (role && typeof role === 'string' && role !== 'ALL') {
    results = results.filter(u => u.role === role);
  }

  return res.json({ users: results });
});

app.post('/api/users', requireAuth, requireRole(['ADMIN']), (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address format.' });
  }

  if (usersTable.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return res.status(409).json({ error: 'A user with this email address already exists.' });
  }

  if (!['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'].includes(role)) {
    return res.status(400).json({ error: 'Role must be ADMIN, PROJECT_MANAGER, or TEAM_MEMBER.' });
  }

  const newId = usersTable.length > 0 ? Math.max(...usersTable.map(u => u.id)) + 1 : 1;
  const newUser: UserRecord = {
    id: newId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    role,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  usersTable.push(newUser);
  recordActivity((req as any).user.userId, `Admin added new user "${newUser.name}" with role ${newUser.role}.`);

  return res.status(201).json({
    message: 'User created successfully.',
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, created_at: newUser.created_at },
  });
});

app.put('/api/users/:id', requireAuth, requireRole(['ADMIN']), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { name, email, password, role } = req.body;

  const userIndex = usersTable.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (email && email.trim().toLowerCase() !== usersTable[userIndex].email.toLowerCase()) {
    if (usersTable.some(u => u.id !== id && u.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.status(409).json({ error: 'Another user already uses this email.' });
    }
    usersTable[userIndex].email = email.trim().toLowerCase();
  }

  if (name) usersTable[userIndex].name = name.trim();
  if (password && password.trim().length > 0) usersTable[userIndex].password = password.trim();
  if (role && ['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'].includes(role)) usersTable[userIndex].role = role;

  recordActivity((req as any).user.userId, `Admin updated user record for "${usersTable[userIndex].name}".`);

  return res.json({
    message: 'User updated successfully.',
    user: {
      id: usersTable[userIndex].id,
      name: usersTable[userIndex].name,
      email: usersTable[userIndex].email,
      role: usersTable[userIndex].role,
      created_at: usersTable[userIndex].created_at,
    },
  });
});

app.delete('/api/users/:id', requireAuth, requireRole(['ADMIN']), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const currentUser = (req as any).user as SessionData;

  if (id === currentUser.userId) {
    return res.status(400).json({ error: 'You cannot delete your own active Admin account.' });
  }

  const user = usersTable.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  usersTable = usersTable.filter(u => u.id !== id);
  // Reassign or unassign tasks
  tasksTable = tasksTable.map(t => (t.assigned_to === id ? { ...t, assigned_to: 0 } : t));

  recordActivity(currentUser.userId, `Admin deleted user "${user.name}" (ID: ${id}).`);
  return res.json({ message: `User "${user.name}" deleted successfully.` });
});

/* ==========================================================================
   PROJECTS CONTROLLER (Mirrors ProjectServlet & ProjectDAO)
   ========================================================================== */

function getProjectWithProgress(project: ProjectRecord) {
  const projectTasks = tasksTable.filter(t => t.project_id === project.id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = projectTasks.filter(t => t.status === 'Pending').length;

  // Formula as required: Completed Tasks / Total Tasks * 100
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const manager = usersTable.find(u => u.id === project.manager_id);

  return {
    ...project,
    manager_name: manager ? manager.name : 'Unassigned',
    manager_email: manager ? manager.email : '',
    total_tasks: totalTasks,
    completed_tasks: completedTasks,
    in_progress_tasks: inProgressTasks,
    pending_tasks: pendingTasks,
    progress_percentage: progressPercentage,
  };
}

app.get('/api/projects', requireAuth, (req: Request, res: Response) => {
  const { search, status, managerId } = req.query;
  const currentUser = (req as any).user as SessionData;

  let list = projectsTable.map(p => getProjectWithProgress(p));

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    list = list.filter(p => p.status === status);
  }

  if (managerId && typeof managerId === 'string' && managerId !== 'ALL') {
    const mId = parseInt(managerId, 10);
    list = list.filter(p => p.manager_id === mId);
  }

  // If user is a Project Manager and requests "my projects", they can filter
  return res.json({ projects: list });
});

app.get('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const project = projectsTable.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const enriched = getProjectWithProgress(project);
  const tasks = tasksTable
    .filter(t => t.project_id === id)
    .map(t => {
      const assignee = usersTable.find(u => u.id === t.assigned_to);
      return {
        ...t,
        assignee_name: assignee ? assignee.name : 'Unassigned',
        assignee_email: assignee ? assignee.email : '',
      };
    });

  return res.json({ project: enriched, tasks });
});

app.post('/api/projects', requireAuth, requireRole(['ADMIN', 'PROJECT_MANAGER']), (req: Request, res: Response) => {
  const { title, description, start_date, end_date, status, manager_id } = req.body;
  const currentUser = (req as any).user as SessionData;

  if (!title || !description || !start_date || !end_date) {
    return res.status(400).json({ error: 'Project title, description, start date, and end date are required.' });
  }

  let finalManagerId = manager_id ? parseInt(manager_id, 10) : currentUser.userId;
  if (currentUser.role === 'PROJECT_MANAGER') {
    finalManagerId = currentUser.userId;
  }

  const newId = projectsTable.length > 0 ? Math.max(...projectsTable.map(p => p.id)) + 1 : 101;
  const newProject: ProjectRecord = {
    id: newId,
    title: title.trim(),
    description: description.trim(),
    start_date,
    end_date,
    status: status || 'Planning',
    manager_id: finalManagerId,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  projectsTable.push(newProject);
  recordActivity(currentUser.userId, `${currentUser.role} "${currentUser.name}" created project "${newProject.title}".`);

  return res.status(201).json({
    message: 'Project created successfully.',
    project: getProjectWithProgress(newProject),
  });
});

app.put('/api/projects/:id', requireAuth, requireRole(['ADMIN', 'PROJECT_MANAGER']), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const currentUser = (req as any).user as SessionData;
  const projectIndex = projectsTable.findIndex(p => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  // If PM, ensure they manage the project unless Admin
  if (currentUser.role === 'PROJECT_MANAGER' && projectsTable[projectIndex].manager_id !== currentUser.userId) {
    return res.status(403).json({ error: 'You are only authorized to edit projects assigned to you.' });
  }

  const { title, description, start_date, end_date, status, manager_id } = req.body;
  if (title) projectsTable[projectIndex].title = title.trim();
  if (description) projectsTable[projectIndex].description = description.trim();
  if (start_date) projectsTable[projectIndex].start_date = start_date;
  if (end_date) projectsTable[projectIndex].end_date = end_date;
  if (status && ['Planning', 'In Progress', 'Completed', 'On Hold'].includes(status)) {
    projectsTable[projectIndex].status = status;
  }
  if (manager_id && currentUser.role === 'ADMIN') {
    projectsTable[projectIndex].manager_id = parseInt(manager_id, 10);
  }

  recordActivity(currentUser.userId, `${currentUser.role} "${currentUser.name}" updated project "${projectsTable[projectIndex].title}".`);

  return res.json({
    message: 'Project updated successfully.',
    project: getProjectWithProgress(projectsTable[projectIndex]),
  });
});

app.delete('/api/projects/:id', requireAuth, requireRole(['ADMIN', 'PROJECT_MANAGER']), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const currentUser = (req as any).user as SessionData;
  const project = projectsTable.find(p => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  if (currentUser.role === 'PROJECT_MANAGER' && project.manager_id !== currentUser.userId) {
    return res.status(403).json({ error: 'You are only authorized to delete projects managed by you.' });
  }

  // Delete project and cascade tasks
  projectsTable = projectsTable.filter(p => p.id !== id);
  const deletedTasksCount = tasksTable.filter(t => t.project_id === id).length;
  tasksTable = tasksTable.filter(t => t.project_id !== id);

  recordActivity(currentUser.userId, `${currentUser.role} "${currentUser.name}" deleted project "${project.title}" (with ${deletedTasksCount} tasks).`);

  return res.json({ message: `Project "${project.title}" and associated tasks deleted successfully.` });
});

/* ==========================================================================
   TASKS CONTROLLER (Mirrors TaskServlet & TaskDAO)
   ========================================================================== */

function enrichTask(task: TaskRecord) {
  const project = projectsTable.find(p => p.id === task.project_id);
  const assignee = usersTable.find(u => u.id === task.assigned_to);
  return {
    ...task,
    project_title: project ? project.title : 'Unknown Project',
    assignee_name: assignee ? assignee.name : 'Unassigned',
    assignee_email: assignee ? assignee.email : '',
  };
}

app.get('/api/tasks', requireAuth, (req: Request, res: Response) => {
  const { search, status, priority, projectId, assignedTo } = req.query;
  const currentUser = (req as any).user as SessionData;

  let list = tasksTable.map(t => enrichTask(t));

  if (currentUser.role === 'TEAM_MEMBER' && !assignedTo) {
    // Default Team Member view can be filtered by them, or unrestricted if requested
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.project_title.toLowerCase().includes(q));
  }

  if (status && typeof status === 'string' && status !== 'ALL') {
    list = list.filter(t => t.status === status);
  }

  if (priority && typeof priority === 'string' && priority !== 'ALL') {
    list = list.filter(t => t.priority === priority);
  }

  if (projectId && typeof projectId === 'string' && projectId !== 'ALL') {
    const pId = parseInt(projectId, 10);
    list = list.filter(t => t.project_id === pId);
  }

  if (assignedTo && typeof assignedTo === 'string' && assignedTo !== 'ALL') {
    const aId = parseInt(assignedTo, 10);
    list = list.filter(t => t.assigned_to === aId);
  }

  return res.json({ tasks: list });
});

app.post('/api/tasks', requireAuth, requireRole(['ADMIN', 'PROJECT_MANAGER']), (req: Request, res: Response) => {
  const { title, description, project_id, assigned_to, priority, deadline, status } = req.body;
  const currentUser = (req as any).user as SessionData;

  if (!title || !description || !project_id || !deadline) {
    return res.status(400).json({ error: 'Title, description, project, and deadline are required.' });
  }

  const project = projectsTable.find(p => p.id === parseInt(project_id, 10));
  if (!project) {
    return res.status(404).json({ error: 'Associated project not found.' });
  }

  const newId = tasksTable.length > 0 ? Math.max(...tasksTable.map(t => t.id)) + 1 : 1001;
  const assignedUserId = assigned_to ? parseInt(assigned_to, 10) : 0;
  const assignee = usersTable.find(u => u.id === assignedUserId);

  const newTask: TaskRecord = {
    id: newId,
    title: title.trim(),
    description: description.trim(),
    project_id: project.id,
    assigned_to: assignedUserId,
    priority: priority || 'Medium',
    deadline,
    status: status || 'Pending',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  tasksTable.push(newTask);
  recordActivity(
    currentUser.userId,
    `${currentUser.role} "${currentUser.name}" created task "${newTask.title}" for project "${project.title}" assigned to "${assignee ? assignee.name : 'Unassigned'}".`
  );

  return res.status(201).json({
    message: 'Task created successfully.',
    task: enrichTask(newTask),
  });
});

app.put('/api/tasks/:id', requireAuth, requireRole(['ADMIN', 'PROJECT_MANAGER']), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const currentUser = (req as any).user as SessionData;
  const taskIndex = tasksTable.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { title, description, project_id, assigned_to, priority, deadline, status } = req.body;
  if (title) tasksTable[taskIndex].title = title.trim();
  if (description) tasksTable[taskIndex].description = description.trim();
  if (project_id) tasksTable[taskIndex].project_id = parseInt(project_id, 10);
  if (assigned_to !== undefined) tasksTable[taskIndex].assigned_to = parseInt(assigned_to, 10);
  if (priority && ['Low', 'Medium', 'High'].includes(priority)) tasksTable[taskIndex].priority = priority;
  if (deadline) tasksTable[taskIndex].deadline = deadline;
  if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) tasksTable[taskIndex].status = status;
  tasksTable[taskIndex].updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const updated = tasksTable[taskIndex];
  const project = projectsTable.find(p => p.id === updated.project_id);

  recordActivity(currentUser.userId, `${currentUser.role} "${currentUser.name}" updated task "${updated.title}".`);

  return res.json({
    message: 'Task updated successfully.',
    task: enrichTask(updated),
  });
});

// Task Status Update Endpoint (Accessible by Team Member for their tasks, or PM/Admin)
app.patch('/api/tasks/:id/status', requireAuth, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const currentUser = (req as any).user as SessionData;
  const { status } = req.body;

  if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be Pending, In Progress, or Completed.' });
  }

  const taskIndex = tasksTable.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const task = tasksTable[taskIndex];

  // Team Member validation
  if (currentUser.role === 'TEAM_MEMBER' && task.assigned_to !== currentUser.userId) {
    return res.status(403).json({ error: 'You can only update status for tasks assigned to you.' });
  }

  const oldStatus = task.status;
  task.status = status;
  task.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const project = projectsTable.find(p => p.id === task.project_id);

  recordActivity(
    currentUser.userId,
    `${currentUser.role} "${currentUser.name}" changed status of task "${task.title}" from "${oldStatus}" to "${status}".`
  );

  return res.json({
    message: `Task status updated to ${status}.`,
    task: enrichTask(task),
    project_progress: project ? getProjectWithProgress(project).progress_percentage : 0,
  });
});

app.delete('/api/tasks/:id', requireAuth, requireRole(['ADMIN', 'PROJECT_MANAGER']), (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const currentUser = (req as any).user as SessionData;
  const task = tasksTable.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasksTable = tasksTable.filter(t => t.id !== id);
  recordActivity(currentUser.userId, `${currentUser.role} "${currentUser.name}" deleted task "${task.title}".`);

  return res.json({ message: `Task "${task.title}" deleted successfully.` });
});

/* ==========================================================================
   PROGRESS, REPORTS & CHARTS (Mirrors ProgressServlet & ReportServlet)
   ========================================================================== */

app.get('/api/reports', requireAuth, (req: Request, res: Response) => {
  const totalProjects = projectsTable.length;
  const activeProjects = projectsTable.filter(p => p.status === 'In Progress').length;
  const completedProjects = projectsTable.filter(p => p.status === 'Completed').length;
  const planningProjects = projectsTable.filter(p => p.status === 'Planning').length;
  const onHoldProjects = projectsTable.filter(p => p.status === 'On Hold').length;

  const totalTasks = tasksTable.length;
  const completedTasks = tasksTable.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasksTable.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasksTable.filter(t => t.status === 'Pending').length;

  const overallProgressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const projectReports = projectsTable.map(p => getProjectWithProgress(p));

  // Team member workloads
  const members = usersTable.filter(u => u.role === 'TEAM_MEMBER').map(member => {
    const memberTasks = tasksTable.filter(t => t.assigned_to === member.id);
    const mTotal = memberTasks.length;
    const mCompleted = memberTasks.filter(t => t.status === 'Completed').length;
    const mInProgress = memberTasks.filter(t => t.status === 'In Progress').length;
    const mPending = memberTasks.filter(t => t.status === 'Pending').length;
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      total_tasks: mTotal,
      completed_tasks: mCompleted,
      in_progress_tasks: mInProgress,
      pending_tasks: mPending,
      completion_rate: mTotal > 0 ? Math.round((mCompleted / mTotal) * 100) : 0,
    };
  });

  return res.json({
    summary: {
      totalProjects,
      activeProjects,
      completedProjects,
      planningProjects,
      onHoldProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overallProgressPercentage,
      totalUsers: usersTable.length,
      totalTeamMembers: members.length,
    },
    pieChartData: [
      { name: 'Completed', value: completedTasks, color: '#10B981' },
      { name: 'In Progress', value: inProgressTasks, color: '#3B82F6' },
      { name: 'Pending', value: pendingTasks, color: '#F59E0B' },
    ],
    projectReports,
    members,
  });
});

/* ==========================================================================
   ACTIVITIES CONTROLLER (Mirrors ActivityServlet & ActivityDAO)
   ========================================================================== */

app.get('/api/activities', requireAuth, (req: Request, res: Response) => {
  const enriched = activitiesTable.map(a => {
    const user = usersTable.find(u => u.id === a.user_id);
    return {
      ...a,
      user_name: user ? user.name : 'System',
      user_role: user ? user.role : 'SYSTEM',
    };
  });
  return res.json({ activities: enriched });
});

/* ==========================================================================
   SYSTEM SETTINGS CONTROLLER (Mirrors SystemSettingsServlet)
   ========================================================================== */

app.get('/api/settings', requireAuth, (req: Request, res: Response) => {
  return res.json({ settings: systemSettingsTable });
});

app.put('/api/settings', requireAuth, requireRole(['ADMIN']), (req: Request, res: Response) => {
  const { settings } = req.body;
  const currentUser = (req as any).user as SessionData;

  if (Array.isArray(settings)) {
    for (const item of settings) {
      const match = systemSettingsTable.find(s => s.setting_name === item.setting_name);
      if (match) {
        match.setting_value = item.setting_value;
      }
    }
  }

  recordActivity(currentUser.userId, `Admin updated system settings.`);
  return res.json({ message: 'System settings saved successfully.', settings: systemSettingsTable });
});

/* ==========================================================================
   PROFILE MANAGEMENT (Mirrors ProfileServlet)
   ========================================================================== */

app.put('/api/profile', requireAuth, (req: Request, res: Response) => {
  const currentUser = (req as any).user as SessionData;
  const { name, email, password } = req.body;

  const userIndex = usersTable.findIndex(u => u.id === currentUser.userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  if (email && email.trim().toLowerCase() !== usersTable[userIndex].email.toLowerCase()) {
    if (usersTable.some(u => u.id !== currentUser.userId && u.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.status(409).json({ error: 'Email is already taken by another account.' });
    }
    usersTable[userIndex].email = email.trim().toLowerCase();
    currentUser.email = usersTable[userIndex].email;
  }

  if (name && name.trim().length > 0) {
    usersTable[userIndex].name = name.trim();
    currentUser.name = usersTable[userIndex].name;
  }

  if (password && password.trim().length > 0) {
    usersTable[userIndex].password = password.trim();
  }

  recordActivity(currentUser.userId, `User "${usersTable[userIndex].name}" updated their profile credentials.`);

  return res.json({
    message: 'Profile updated successfully.',
    user: {
      id: usersTable[userIndex].id,
      name: usersTable[userIndex].name,
      email: usersTable[userIndex].email,
      role: usersTable[userIndex].role,
      created_at: usersTable[userIndex].created_at,
    },
  });
});

/* ==========================================================================
   VIVA LAB / JAVA ARCHITECTURE & CODE INSPECTION API
   ========================================================================== */

app.get('/api/java-explorer/files', (req: Request, res: Response) => {
  // Returns catalog of Java classes, DAOs, Servlets, and schema
  return res.json({
    categories: [
      {
        name: 'Model Layer (OOP & Encapsulation)',
        files: ['User.java', 'Admin.java', 'ProjectManager.java', 'TeamMember.java', 'Project.java', 'Task.java', 'Activity.java', 'SystemSetting.java'],
      },
      {
        name: 'DAO Layer (JDBC & PreparedStatement)',
        files: ['DBConnection.java', 'UserDAO.java', 'UserDAOImpl.java', 'ProjectDAO.java', 'ProjectDAOImpl.java', 'TaskDAO.java', 'TaskDAOImpl.java', 'ActivityDAOImpl.java'],
      },
      {
        name: 'Service & Thread Layer',
        files: ['ProjectService.java', 'NotificationDaemonThread.java', 'AuditLogThread.java'],
      },
      {
        name: 'Controller / Servlets (MVC)',
        files: ['LoginServlet.java', 'LogoutServlet.java', 'UserServlet.java', 'ProjectServlet.java', 'TaskServlet.java', 'ProgressServlet.java', 'ReportServlet.java', 'AuthFilter.java'],
      },
      {
        name: 'Database & Configuration',
        files: ['database_schema.sql', 'web.xml', 'pom.xml'],
      },
    ],
  });
});

// Vite Middleware for development
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ONLINE PROJECT MANAGEMENT TOOL] Express Server listening on port ${PORT}`);
  });
}

startServer();
