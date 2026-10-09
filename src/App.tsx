/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User, Project, Task, UserRole, ReportSummary, PieChartSlice, SystemSetting, MemberWorkload } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LoginView } from './views/LoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ManagerDashboardView } from './views/ManagerDashboardView';
import { MemberDashboardView } from './views/MemberDashboardView';
import { ReportsView } from './views/ReportsView';
import { ProfileView } from './views/ProfileView';
import { ActivityFeedView } from './views/ActivityFeedView';
import { SettingsView } from './views/SettingsView';
import { ProjectAllocationsView } from './views/ProjectAllocationsView';
import { TaskManagementView, TaskManagementSubTab } from './views/TaskManagementView';
import { UserModal, ProjectModal, TaskModal, ConfirmDeleteModal } from './components/Modals';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(() => localStorage.getItem('opmt_session_token'));
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState<string>('');

  // Task Management Navigation State
  const [taskManagementSubTab, setTaskManagementSubTab] = useState<TaskManagementSubTab>('overview');
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<Project | null>(null);

  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [membersWorkload, setMembersWorkload] = useState<MemberWorkload[]>([]);
  const [summary, setSummary] = useState<ReportSummary>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    planningProjects: 0,
    onHoldProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    overallProgressPercentage: 0,
    totalUsers: 0,
    totalTeamMembers: 0,
  });
  const [pieData, setPieData] = useState<PieChartSlice[]>([
    { name: 'Completed', value: 0, color: '#10B981' },
    { name: 'In Progress', value: 0, color: '#3B82F6' },
    { name: 'Pending', value: 0, color: '#F59E0B' },
  ]);

  // Modals state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [defaultProjectIdForTask, setDefaultProjectIdForTask] = useState<number | undefined>();

  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Helper for authorized fetch
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken}`);
      }
      headers.set('Content-Type', 'application/json');

      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        localStorage.removeItem('opmt_session_token');
        setSessionToken(null);
        setCurrentUser(null);
        throw new Error('Session expired. Please log in again.');
      }
      return res;
    },
    [sessionToken]
  );

  // Load all application data
  const loadData = useCallback(async () => {
    if (!sessionToken) return;

    try {
      const [uRes, pRes, tRes, rRes, aRes, sRes] = await Promise.all([
        authFetch('/api/users'),
        authFetch('/api/projects'),
        authFetch('/api/tasks'),
        authFetch('/api/reports'),
        authFetch('/api/activities'),
        authFetch('/api/settings'),
      ]);

      if (uRes.ok) {
        const data = await uRes.json();
        setUsers(data.users || []);
      }
      if (pRes.ok) {
        const data = await pRes.json();
        setProjects(data.projects || []);
      }
      if (tRes.ok) {
        const data = await tRes.json();
        setTasks(data.tasks || []);
      }
      if (rRes.ok) {
        const data = await rRes.json();
        setSummary(data.summary);
        setPieData(data.pieChartData);
        setMembersWorkload(data.members || []);
      }
      if (aRes.ok) {
        const data = await aRes.json();
        setActivities(data.activities || []);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSettings(data.settings || []);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  }, [authFetch, sessionToken]);

  // Initial authentication check
  useEffect(() => {
    async function checkAuth() {
      if (!sessionToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('opmt_session_token');
          setSessionToken(null);
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth verification failed', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [sessionToken]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, loadData]);

  // LOGIN HANDLER
  const handleLogin = async (email: string, pass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed.');
    }

    localStorage.setItem('opmt_session_token', data.sessionToken);
    setSessionToken(data.sessionToken);
    setCurrentUser(data.user);
    setActiveTab('dashboard');
    showSuccess(`Welcome back, ${data.user.name}! Authenticated as ${data.user.role}.`);
  };

  // REGISTER HANDLER
  const handleRegister = async (name: string, email: string, pass: string, role: UserRole) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    localStorage.setItem('opmt_session_token', data.sessionToken);
    setSessionToken(data.sessionToken);
    setCurrentUser(data.user);
    setActiveTab('dashboard');
    showSuccess(`Account created successfully! Welcome, ${data.user.name} (${data.user.role}).`);
  };

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
      }
    } catch (ignored) {}

    localStorage.removeItem('opmt_session_token');
    setSessionToken(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // FAST ROLE SWITCHER (For rapid professor / viva evaluation)
  const handleQuickSwitchRole = async (targetRole: UserRole) => {
    let email = 'admin@example.com';
    let pass = 'admin123';
    if (targetRole === 'PROJECT_MANAGER') {
      email = 'manager@example.com';
      pass = 'manager123';
    } else if (targetRole === 'TEAM_MEMBER') {
      email = 'member@example.com';
      pass = 'member123';
    }
    await handleLogin(email, pass);
  };

  // USER CRUD
  const handleSaveUser = async (userData: { name: string; email: string; password?: string; role: UserRole }) => {
    const isEdit = !!selectedUserForEdit;
    const url = isEdit ? `/api/users/${selectedUserForEdit.id}` : '/api/users';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save user.');

    await loadData();
    showSuccess(isEdit ? `User "${userData.name}" updated successfully.` : `New user "${userData.name}" created.`);
  };

  const handleDeleteUser = (user: User) => {
    setDeleteModalConfig({
      isOpen: true,
      title: `Delete User: ${user.name}`,
      message: `Are you sure you want to permanently delete user "${user.name}" (${user.email})? This action will remove the record from the MySQL database.`,
      onConfirm: async () => {
        const res = await authFetch(`/api/users/${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete user.');
        await loadData();
        showSuccess(`User "${user.name}" was deleted successfully.`);
      },
    });
  };

  // PROJECT CRUD
  const handleSaveProject = async (projectData: any) => {
    const isEdit = !!selectedProjectForEdit;
    const url = isEdit ? `/api/projects/${selectedProjectForEdit.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(projectData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save project.');

    await loadData();
    showSuccess(isEdit ? `Project "${projectData.title}" updated.` : `Project "${projectData.title}" created successfully.`);
  };

  const handleDeleteProject = (project: Project) => {
    setDeleteModalConfig({
      isOpen: true,
      title: `Delete Project: ${project.title}`,
      message: `Are you sure you want to delete "${project.title}"? This will delete the project record and cascade delete all associated tasks.`,
      onConfirm: async () => {
        const res = await authFetch(`/api/projects/${project.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete project.');
        await loadData();
        showSuccess(`Project "${project.title}" deleted.`);
      },
    });
  };

  // TASK CRUD
  const handleSaveTask = async (taskData: any) => {
    const isEdit = !!selectedTaskForEdit;
    const url = isEdit ? `/api/tasks/${selectedTaskForEdit.id}` : '/api/tasks';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(taskData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save task.');

    await loadData();
    showSuccess(isEdit ? `Task "${taskData.title}" updated.` : `Task "${taskData.title}" created & assigned.`);
  };

  const handleDeleteTask = (task: Task) => {
    setDeleteModalConfig({
      isOpen: true,
      title: `Delete Task: ${task.title}`,
      message: `Are you sure you want to delete task "${task.title}"?`,
      onConfirm: async () => {
        const res = await authFetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete task.');
        await loadData();
        showSuccess(`Task "${task.title}" deleted.`);
      },
    });
  };

  // TASK STATUS UPDATE (Accessible by Team Member and Manager)
  const handleUpdateTaskStatus = async (taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    const res = await authFetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task status.');

    await loadData();
    showSuccess(`Task status changed to "${newStatus}". Dynamic progress percentage updated!`);
  };

  // PROFILE UPDATE
  const handleUpdateProfile = async (name: string, email: string, password?: string) => {
    const res = await authFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile.');

    setCurrentUser(data.user);
    await loadData();
    showSuccess('Profile changes saved successfully.');
  };

  // SYSTEM SETTINGS UPDATE
  const handleSaveSettings = async (newSettings: SystemSetting[]) => {
    const res = await authFetch('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings: newSettings }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings.');

    setSettings(data.settings);
    showSuccess('System settings persisted successfully.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
        Connecting to Online Project Management Tool Engine...
      </div>
    );
  }

  // If not logged in, render Login Page
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Managers & Team Members list for assignment dropdowns
  const projectManagers = users.filter((u) => u.role === 'PROJECT_MANAGER' || u.role === 'ADMIN');
  const teamMembers = users.filter((u) => u.role === 'TEAM_MEMBER');

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-150">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        tasksCount={tasks.length}
        onLogout={handleLogout}
        onQuickSwitchRole={handleQuickSwitchRole}
        onOpenActivities={() => setActiveTab('activity')}
        onNavigateToTasks={(subTab) => {
          setTaskManagementSubTab(subTab || 'overview');
          setActiveTab('tasks');
        }}
        onCreateTaskQuick={() => {
          setSelectedTaskForEdit(null);
          setTaskModalOpen(true);
        }}
      />

      <div className="flex flex-1">
        {/* Role-Specific Sidebar */}
        <Sidebar
          role={currentUser.role}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {/* 1. Reports View */}
          {activeTab === 'reports' && (
            <ReportsView
              projects={projects}
              summary={summary}
              pieData={pieData}
              tasks={tasks}
              users={users}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
              onSelectTask={(t) => setSelectedTaskDetail(t)}
            />
          )}

          {/* 2. Activity Feed View */}
          {activeTab === 'activity' && <ActivityFeedView activities={activities} />}

          {/* 3. Profile View */}
          {activeTab === 'profile' && (
            <ProfileView currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
          )}

          {/* 4. Simple Clean Settings View */}
          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onLogout={handleLogout}
              onUpdatePassword={async (_curr, next) => {
                await handleUpdateProfile(currentUser.name, currentUser.email, next);
              }}
            />
          )}

          {/* 5. Project Allocations & Team Progress View */}
          {activeTab === 'allocations' && (
            <ProjectAllocationsView
              projects={projects}
              tasks={tasks}
              users={users}
              membersWorkload={membersWorkload}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
              onSelectTask={(t) => setSelectedTaskDetail(t)}
            />
          )}

          {/* 6. Comprehensive Task Management System View */}
          {activeTab === 'tasks' && (
            <TaskManagementView
              tasks={tasks}
              projects={projects}
              teamMembers={teamMembers}
              currentUserId={currentUser.id}
              userRole={currentUser.role}
              initialSubTab={taskManagementSubTab}
              onCreateTask={(defaultProjId) => {
                setSelectedTaskForEdit(null);
                setDefaultProjectIdForTask(defaultProjId);
                setTaskModalOpen(true);
              }}
              onEditTask={(t) => {
                setSelectedTaskForEdit(t);
                setTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onSelectTaskDetail={(t) => setSelectedTaskDetail(t)}
            />
          )}

          {/* 7. Role Specific Dashboards */}
          {currentUser.role === 'ADMIN' &&
            ['dashboard', 'users', 'projects'].includes(activeTab) && (
              <AdminDashboardView
                users={users}
                projects={projects}
                tasks={tasks}
                summary={summary}
                settings={settings}
                activeSection={activeTab as any}
                currentUser={currentUser}
                onLogout={handleLogout}
                onAddUser={() => {
                  setSelectedUserForEdit(null);
                  setUserModalOpen(true);
                }}
                onEditUser={(u) => {
                  setSelectedUserForEdit(u);
                  setUserModalOpen(true);
                }}
                onDeleteUser={handleDeleteUser}
                onCreateProject={() => {
                  setSelectedProjectForEdit(null);
                  setProjectModalOpen(true);
                }}
                onEditProject={(p) => {
                  setSelectedProjectForEdit(p);
                  setProjectModalOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
                onSaveSettings={handleSaveSettings}
                onNavigateSection={(sec) => setActiveTab(sec as any)}
                successMessage={successToast}
              />
            )}

          {currentUser.role === 'PROJECT_MANAGER' &&
            ['dashboard', 'projects', 'team'].includes(activeTab) && (
              <ManagerDashboardView
                currentUserId={currentUser.id}
                projects={projects}
                tasks={tasks}
                teamMembers={teamMembers}
                summary={summary}
                membersWorkload={membersWorkload}
                activeSection={activeTab as any}
                onNavigateSection={(sec) => setActiveTab(sec as any)}
                onCreateProject={() => {
                  setSelectedProjectForEdit(null);
                  setProjectModalOpen(true);
                }}
                onEditProject={(p) => {
                  setSelectedProjectForEdit(p);
                  setProjectModalOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
                onCreateTask={(defaultProjId) => {
                  setSelectedTaskForEdit(null);
                  setDefaultProjectIdForTask(defaultProjId);
                  setTaskModalOpen(true);
                }}
                onEditTask={(t) => {
                  setSelectedTaskForEdit(t);
                  setTaskModalOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                successMessage={successToast}
              />
            )}

          {currentUser.role === 'TEAM_MEMBER' &&
            ['dashboard', 'projects'].includes(activeTab) && (
              <MemberDashboardView
                currentUser={currentUser}
                tasks={tasks}
                projects={projects}
                onUpdateStatus={handleUpdateTaskStatus}
                successMessage={successToast}
                activeSection={activeTab as any}
              />
            )}
        </main>
      </div>

      {/* Interactive Modals */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSave={handleSaveUser}
        initialUser={selectedUserForEdit}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
        initialProject={selectedProjectForEdit}
        managers={projectManagers}
        isAdmin={currentUser.role === 'ADMIN'}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={selectedTaskForEdit}
        projects={projects}
        teamMembers={teamMembers}
        defaultProjectId={defaultProjectIdForTask}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalConfig.isOpen}
        title={deleteModalConfig.title}
        message={deleteModalConfig.message}
        onConfirm={deleteModalConfig.onConfirm}
        onClose={() => setDeleteModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Detail Modal for Selected Task */}
      <TaskDetailModal
        isOpen={selectedTaskDetail !== null}
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        project={projects.find((p) => p.id === selectedTaskDetail?.project_id)}
        assignee={users.find((u) => u.id === selectedTaskDetail?.assigned_to)}
        onEditTask={(t) => {
          setSelectedTaskForEdit(t);
          setTaskModalOpen(true);
        }}
        onDeleteTask={async (tId) => {
          const t = tasks.find((tk) => tk.id === tId);
          if (t) handleDeleteTask(t);
        }}
        onUpdateStatus={handleUpdateTaskStatus}
        canEdit={currentUser.role === 'ADMIN' || currentUser.role === 'PROJECT_MANAGER'}
      />

      {/* Detail Modal for Selected Project */}
      <ProjectDetailModal
        isOpen={selectedProjectDetail !== null}
        project={selectedProjectDetail}
        onClose={() => setSelectedProjectDetail(null)}
        tasks={tasks.filter((t) => t.project_id === selectedProjectDetail?.id)}
        onSelectTask={(t) => setSelectedTaskDetail(t)}
      />
    </div>
  );
}
