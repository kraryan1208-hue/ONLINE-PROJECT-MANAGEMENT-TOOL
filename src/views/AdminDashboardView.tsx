import React, { useState } from 'react';
import { User, Project, Task, ReportSummary, SystemSetting } from '../types';
import {
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  Shield,
  Briefcase,
  User as UserIcon,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
  ArrowUpRight,
  Activity,
  Layers,
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { DoughnutChart } from '../components/DoughnutChart';
import { DashboardChartsSection, PieChartItem, BarGraphItem } from '../components/DashboardCharts';
import { DashboardDataTable } from '../components/DashboardDataTable';
import { MetricDetailModal, MetricDetailType } from '../components/MetricDetailModal';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { SettingsView } from './SettingsView';

interface AdminDashboardViewProps {
  users: User[];
  projects: Project[];
  tasks: Task[];
  summary: ReportSummary;
  settings?: SystemSetting[];
  activeSection: 'dashboard' | 'users' | 'projects' | 'settings';
  currentUser?: User;
  onLogout?: () => void;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onUpdateTaskStatus?: (taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
  onSaveSettings?: (settings: SystemSetting[]) => Promise<void>;
  onNavigateSection?: (section: 'dashboard' | 'users' | 'projects' | 'settings') => void;
  successMessage?: string;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  users,
  projects,
  tasks,
  summary,
  settings,
  activeSection,
  currentUser,
  onLogout,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onUpdateTaskStatus,
  onSaveSettings,
  onNavigateSection,
  successMessage,
}) => {
  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('ALL');

  // Modal inspection state
  const [activeMetricDetail, setActiveMetricDetail] = useState<MetricDetailType | null>(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<Project | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesStatus = projectStatusFilter === 'ALL' || p.status === projectStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart telemetry data
  const statusData: PieChartItem[] = [
    { name: 'Completed', value: summary.completedTasks, color: '#10B981' },
    { name: 'In Progress', value: summary.inProgressTasks, color: '#6366F1' },
    { name: 'Pending', value: summary.pendingTasks, color: '#F59E0B' },
  ];

  const priorityData: PieChartItem[] = [
    { name: 'High', value: tasks.filter((t) => t.priority === 'High').length, color: '#EF4444' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'Medium').length, color: '#F59E0B' },
    { name: 'Low', value: tasks.filter((t) => t.priority === 'Low').length, color: '#64748B' },
  ];

  const barData: BarGraphItem[] = projects.map((p) => ({
    label: p.title.length > 14 ? p.title.substring(0, 12) + '...' : p.title,
    completed: p.completed_tasks,
    pendingOrTotal: p.total_tasks,
    rate: p.progress_percentage,
  }));

  return (
    <div className="space-y-6">
      {/* Success Notification Alert */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* SECTION: DASHBOARD OVERVIEW */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Administrator Control Center</h2>
              <p className="text-xs text-slate-500">
                System-wide metrics, database entities, and project completion telemetry.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onAddUser}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>Add User</span>
              </button>
              <button
                onClick={onCreateProject}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* 7 Core Dashboard Statistics Cards - Ultra-Professional Untitled UI Style */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Card 1: Total Users */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_users')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Total Users breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                  +12%
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Users</div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                  {summary.totalUsers}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Across 3 roles</span>
                <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 2: Total Projects */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_projects')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Total Projects breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100/70 flex items-center justify-center text-violet-600">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                  Active
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Projects</div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors mt-0.5">
                  {summary.totalProjects}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>In repository</span>
                <span className="text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 3: Active Projects */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('active_projects')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Active Projects breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                  Live
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Active Projects</div>
                <div className="text-2xl font-bold tracking-tight text-sky-600 group-hover:text-sky-700 transition-colors mt-0.5">
                  {summary.activeProjects}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>In progress</span>
                <span className="text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 4: Total Tasks */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_tasks')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Total Tasks breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Units
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Tasks</div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors mt-0.5">
                  {summary.totalTasks}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>All deliverables</span>
                <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 5: Completed Tasks */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('completed_tasks')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Completed Tasks breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {summary.overallProgressPercentage}%
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Completed Tasks</div>
                <div className="text-2xl font-bold tracking-tight text-emerald-600 group-hover:text-emerald-700 transition-colors mt-0.5">
                  {summary.completedTasks}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-emerald-600 font-medium">Closed</span>
                <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 6: Pending Tasks */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('pending_tasks')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Pending Tasks breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100/70 flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  To Do
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Pending Tasks</div>
                <div className="text-2xl font-bold tracking-tight text-amber-600 group-hover:text-amber-700 transition-colors mt-0.5">
                  {summary.pendingTasks}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-amber-600 font-medium">In backlog</span>
                <span className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 7: Team Members */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('team_members')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Team Members breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100/70 flex items-center justify-center text-teal-600">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                  Online
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Team Members</div>
                <div className="text-2xl font-bold tracking-tight text-indigo-600 group-hover:text-indigo-700 transition-colors mt-0.5">
                  {summary.totalTeamMembers}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Engineers &amp; QA</span>
                <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>
          </div>

          {/* CHARTS SECTION: PI CHARTS & VELOCITY GRAPH (Side-by-Side with Interactive Toggles) */}
          <DashboardChartsSection
            statusData={statusData}
            priorityData={priorityData}
            barData={barData}
            completionRate={summary.overallProgressPercentage}
            totalTasks={summary.totalTasks}
            completedTasks={summary.completedTasks}
          />

          {/* TABLES SECTION: LIVE WORKSPACE DELIVERABLES & TRACKING TABLE */}
          <DashboardDataTable
            tasks={tasks}
            projects={projects}
            users={users}
            onSelectTask={(task) => setSelectedTaskDetail(task)}
            onSelectProject={(project) => setSelectedProjectDetail(project)}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        </div>
      )}

      {/* SECTION: USER MANAGEMENT */}
      {activeSection === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Management</h2>
              <p className="text-xs text-slate-500">
                Create, inspect, modify, and delete user accounts with Role-Based Access.
              </p>
            </div>
            <button
              onClick={onAddUser}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
              {['ALL', 'ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setUserRoleFilter(roleKey)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    userRoleFilter === roleKey
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {roleKey === 'ALL'
                    ? 'All Roles'
                    : roleKey === 'PROJECT_MANAGER'
                    ? 'Managers'
                    : roleKey === 'TEAM_MEMBER'
                    ? 'Members'
                    : 'Admins'}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No user records match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">#{u.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">
                          {u.role === 'ADMIN' ? (
                            <span className="font-semibold text-rose-700">Administrator</span>
                          ) : u.role === 'PROJECT_MANAGER' ? (
                            <span className="font-semibold text-blue-700">Project Manager</span>
                          ) : (
                            <span className="font-semibold text-emerald-700">Team Member</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{u.created_at || '2026-09-01'}</td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => onEditUser(u)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(u)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: PROJECT MANAGEMENT */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Management</h2>
              <p className="text-xs text-slate-500">
                Admin CRUD operations over enterprise projects, managers, and milestones.
              </p>
            </div>
            <button
              onClick={onCreateProject}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search project title or description..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
              {['ALL', 'Planning', 'In Progress', 'Completed', 'On Hold'].map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setProjectStatusFilter(statusKey)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    projectStatusFilter === statusKey
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {statusKey === 'ALL' ? 'All Status' : statusKey}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Project ID</th>
                    <th className="py-3 px-4">Project Title</th>
                    <th className="py-3 px-4">Project Manager</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Progress (Formula)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No projects match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                        onClick={() => setSelectedProjectDetail(p)}
                        title={`Click to view team members, roles, and details of ${p.title}`}
                      >
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">#{p.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            <span>{p.title}</span>
                            <span className="text-[10px] text-blue-500 font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                              View Team ↗
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{p.description}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{p.manager_name}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {p.start_date} → {p.end_date}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              p.status === 'Completed'
                                ? 'text-emerald-700'
                                : p.status === 'In Progress'
                                ? 'text-blue-700'
                                : p.status === 'On Hold'
                                ? 'text-rose-700'
                                : 'text-slate-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 w-44">
                          <ProgressBar
                            percentage={p.progress_percentage}
                            completedTasks={p.completed_tasks}
                            totalTasks={p.total_tasks}
                            size="sm"
                          />
                        </td>
                        <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditProject(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(p)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SETTINGS */}
      {activeSection === 'settings' && (
        <SettingsView
          currentUser={currentUser || { id: 1, name: 'Admin', email: 'admin@opmt.org', role: 'ADMIN' }}
          onLogout={onLogout || (() => {})}
        />
      )}

      {/* Detail Modal for 7 Statistics Cards */}
      <MetricDetailModal
        isOpen={activeMetricDetail !== null}
        type={activeMetricDetail}
        onClose={() => setActiveMetricDetail(null)}
        users={users}
        projects={projects}
        tasks={tasks}
        onNavigateToSection={(sec) => {
          if (onNavigateSection) {
            onNavigateSection(sec as any);
          }
        }}
      />

      {/* Project Detail Modal for Active Projects & Progress list */}
      <ProjectDetailModal
        isOpen={selectedProjectDetail !== null}
        project={selectedProjectDetail}
        tasks={tasks}
        users={users}
        onClose={() => setSelectedProjectDetail(null)}
        onEdit={(p) => onEditProject(p)}
      />

      {/* Task Detail Modal for Live Deliverables Table */}
      <TaskDetailModal
        isOpen={selectedTaskDetail !== null}
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        project={projects.find((p) => p.id === selectedTaskDetail?.project_id)}
        assignee={users.find((u) => u.id === selectedTaskDetail?.assigned_to)}
        canEdit={false}
      />
    </div>
  );
};
