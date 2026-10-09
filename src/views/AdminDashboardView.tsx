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
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { DoughnutChart } from '../components/DoughnutChart';
import { MetricDetailModal, MetricDetailType } from '../components/MetricDetailModal';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
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

  const doughnutData = [
    { name: 'Completed', value: summary.completedTasks, color: '#10B981' },
    { name: 'In Progress', value: summary.inProgressTasks, color: '#3B82F6' },
    { name: 'Pending', value: summary.pendingTasks, color: '#F59E0B' },
  ];

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
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
              <button
                onClick={onCreateProject}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* 7 Core Dashboard Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_users')}
              className="text-left p-4 bg-white hover:bg-blue-50/40 hover:border-blue-300 transition-all rounded-xl border border-slate-200/90 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              title="Click to view Total Users details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                <span>Total Users</span>
                <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-blue-700">{summary.totalUsers}</div>
              <div className="text-[10px] text-slate-400 mt-1">Across 3 Roles</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_projects')}
              className="text-left p-4 bg-white hover:bg-purple-50/40 hover:border-purple-300 transition-all rounded-xl border border-slate-200/90 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              title="Click to view Total Projects details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                <span>Total Projects</span>
                <span className="text-[10px] text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-purple-700">{summary.totalProjects}</div>
              <div className="text-[10px] text-blue-600 font-medium mt-1">In Repository</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('active_projects')}
              className="text-left p-4 bg-white hover:bg-blue-50/40 hover:border-blue-400 transition-all rounded-xl border border-slate-200/90 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              title="Click to view Active Projects details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                <span>Active Projects</span>
                <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">{summary.activeProjects}</div>
              <div className="text-[10px] text-slate-400 mt-1">In Progress</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_tasks')}
              className="text-left p-4 bg-white hover:bg-slate-100 hover:border-slate-400 transition-all rounded-xl border border-slate-200/90 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-500/20"
              title="Click to view Total Tasks details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-slate-700 transition-colors flex items-center justify-between">
                <span>Total Tasks</span>
                <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800">{summary.totalTasks}</div>
              <div className="text-[10px] text-slate-400 mt-1">Work Units</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('completed_tasks')}
              className="text-left p-4 bg-white hover:bg-emerald-50/40 hover:border-emerald-300 transition-all rounded-xl border border-slate-200/90 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              title="Click to view Completed Tasks details"
            >
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>Completed Tasks</span>
                <span className="text-[10px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700">{summary.completedTasks}</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-1">Closed</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('pending_tasks')}
              className="text-left p-4 bg-white hover:bg-amber-50/40 hover:border-amber-300 transition-all rounded-xl border border-slate-200/90 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              title="Click to view Pending Tasks details"
            >
              <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1 group-hover:text-amber-800 transition-colors flex items-center justify-between">
                <span>Pending Tasks</span>
                <span className="text-[10px] text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 group-hover:text-amber-700">{summary.pendingTasks}</div>
              <div className="text-[10px] text-amber-600 font-medium mt-1">To Complete</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('team_members')}
              className="text-left p-4 bg-white hover:bg-indigo-50/40 hover:border-indigo-300 transition-all rounded-xl border border-slate-200/90 shadow-2xs col-span-2 lg:col-span-1 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              title="Click to view Team Members details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                <span>Team Members</span>
                <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600 group-hover:text-indigo-700">{summary.totalTeamMembers}</div>
              <div className="text-[10px] text-slate-400 mt-1">Engineers &amp; QA</div>
            </button>
          </div>

          {/* Charts & Project List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Widget */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Global Task Distribution</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Calculated dynamically from real database records.
                </p>
              </div>
              <DoughnutChart data={doughnutData} />
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <span className="text-xs font-semibold text-slate-700">Overall Progress: </span>
                <span className="text-sm font-bold text-blue-600">{summary.overallProgressPercentage}%</span>
              </div>
            </div>

            {/* Recent Active Projects with dynamic progress bar */}
            <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Projects &amp; Progress</h3>
                  <p className="text-xs text-slate-500">
                    Formula: (Completed Tasks / Total Tasks) × 100
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMetricDetail('total_projects')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{projects.length} Total Projects</span>
                  <span className="text-[11px]">→</span>
                </button>
              </div>

              <div className="space-y-4">
                {projects.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectDetail(p)}
                    className="p-3.5 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group shadow-2xs"
                    title={`Click to view full details of ${p.title}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {p.title}
                          </h4>
                          <span className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details ↗
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Manager: {p.manager_name || 'Unassigned'}</span>
                          <span aria-hidden="true">·</span>
                          <span>Due {p.end_date}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-700">{p.status}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        {p.progress_percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={p.progress_percentage}
                      completedTasks={p.completed_tasks}
                      totalTasks={p.total_tasks}
                      showLabel={false}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">#{p.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{p.title}</div>
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
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => onEditProject(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(p)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
    </div>
  );
};
