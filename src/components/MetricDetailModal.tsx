import React, { useState } from 'react';
import { User, Project, Task } from '../types';
import {
  X,
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Calendar,
  Shield,
  Briefcase,
  User as UserIcon,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export type MetricDetailType =
  | 'total_users'
  | 'total_projects'
  | 'active_projects'
  | 'total_tasks'
  | 'completed_tasks'
  | 'pending_tasks'
  | 'team_members'
  | 'active_assignees'
  | 'overall_progress';

interface MetricDetailModalProps {
  isOpen: boolean;
  type: MetricDetailType | null;
  onClose: () => void;
  users: User[];
  projects: Project[];
  tasks: Task[];
  onNavigateToSection?: (section: 'users' | 'projects' | 'tasks' | 'team') => void;
  onSelectProject?: (project: Project) => void;
  onSelectTask?: (task: Task) => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  isOpen,
  type,
  onClose,
  users,
  projects,
  tasks,
  onNavigateToSection,
  onSelectProject,
  onSelectTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('ALL');

  if (!isOpen || !type) return null;

  // Filter and configure view based on type
  let title = '';
  let subtitle = '';
  let badgeText = '';
  let badgeColor = '';
  let icon = <Users className="w-5 h-5 text-blue-600" />;

  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasksCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasksCount = tasks.filter((t) => t.status === 'Pending').length;
  const overallPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  const activeAssigneesList = users.filter((u) => tasks.some((t) => t.assigned_to === u.id));

  switch (type) {
    case 'total_users':
      title = 'Total Users Directory';
      subtitle = 'Complete list of all registered accounts across 3 system roles';
      badgeText = `${users.length} Users`;
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
      icon = <Users className="w-5 h-5 text-blue-600" />;
      break;
    case 'total_projects':
      title = 'Total Projects Repository';
      subtitle = 'Overview of all projects registered in the system repository';
      badgeText = `${projects.length} Projects`;
      badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
      icon = <FolderKanban className="w-5 h-5 text-purple-600" />;
      break;
    case 'active_projects':
      title = 'Active Projects (In Progress)';
      subtitle = 'Projects currently under development and actively worked upon';
      badgeText = `${projects.filter((p) => p.status === 'In Progress').length} Active`;
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
      icon = <TrendingUp className="w-5 h-5 text-blue-600" />;
      break;
    case 'total_tasks':
      title = 'Total Tasks (Work Units)';
      subtitle = 'All system tasks across all projects and team members';
      badgeText = `${tasks.length} Tasks`;
      badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
      icon = <CheckSquare className="w-5 h-5 text-slate-600" />;
      break;
    case 'completed_tasks':
      title = 'Completed Tasks';
      subtitle = 'Tasks that have been fully developed, closed, and verified';
      badgeText = `${completedTasksCount} Closed`;
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      break;
    case 'pending_tasks':
      title = 'Pending Tasks';
      subtitle = 'Tasks awaiting initiation or backlog tasks to complete';
      badgeText = `${pendingTasksCount} Pending`;
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
      icon = <Clock className="w-5 h-5 text-amber-600" />;
      break;
    case 'team_members':
      title = 'Team Members (Engineers & QA)';
      subtitle = 'Active engineering staff and QA specialists executing assignments';
      badgeText = `${users.filter((u) => u.role === 'TEAM_MEMBER').length} Engineers & QA`;
      badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
      icon = <UserIcon className="w-5 h-5 text-indigo-600" />;
      break;
    case 'active_assignees':
      title = 'Active Assignees & Workload';
      subtitle = 'Team members currently assigned to live work units across projects';
      badgeText = `${activeAssigneesList.length} Active Assignees`;
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
      icon = <Users className="w-5 h-5 text-blue-600" />;
      break;
    case 'overall_progress':
      title = 'Overall Completion Rate & Progress Breakdown';
      subtitle = 'Dynamic metrics derived strictly from live task status data. Formula: (Completed Tasks / Total Tasks) × 100';
      badgeText = `${overallPercentage}% Complete`;
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      break;
  }

  // Filtered dataset
  const filteredUsers = users.filter((u) => {
    if (type === 'team_members' && u.role !== 'TEAM_MEMBER') return false;
    if (type === 'active_assignees' && !tasks.some((t) => t.assigned_to === u.id)) return false;
    if (filterTag !== 'ALL' && u.role !== filterTag) return false;
    const match =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  const filteredProjects = projects.filter((p) => {
    if (type === 'active_projects' && p.status !== 'In Progress') return false;
    if (filterTag !== 'ALL' && p.status !== filterTag) return false;
    const match =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.manager_name && p.manager_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return match;
  });

  const filteredTasks = tasks.filter((t) => {
    if (type === 'completed_tasks' && t.status !== 'Completed') return false;
    if (type === 'pending_tasks' && t.status !== 'Pending') return false;
    if (filterTag !== 'ALL' && t.status !== filterTag) return false;
    const match =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.assignee_name && t.assignee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.project_title && t.project_title.toLowerCase().includes(searchTerm.toLowerCase()));
    return match;
  });

  const isUserView = type === 'total_users' || type === 'team_members' || type === 'active_assignees';
  const isProjectView = type === 'total_projects' || type === 'active_projects';
  const isTaskView =
    type === 'total_tasks' || type === 'completed_tasks' || type === 'pending_tasks';
  const isOverallProgressView = type === 'overall_progress';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-200">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeColor}`}
                >
                  {badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Quick Filters */}
          {isUserView && type === 'total_users' && (
            <div className="flex gap-1.5">
              {['ALL', 'ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterTag(role)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterTag === role
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role === 'ALL'
                    ? 'All'
                    : role === 'ADMIN'
                    ? 'Admin'
                    : role === 'PROJECT_MANAGER'
                    ? 'Manager'
                    : 'Member'}
                </button>
              ))}
            </div>
          )}

          {isProjectView && type === 'total_projects' && (
            <div className="flex gap-1.5">
              {['ALL', 'In Progress', 'Completed', 'Planning'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterTag(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterTag === status
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          {isTaskView && type === 'total_tasks' && (
            <div className="flex gap-1.5">
              {['ALL', 'Pending', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterTag(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterTag === status
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/40">
          {/* USERS LIST */}
          {isUserView && (
            <div className="space-y-2.5">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No users found matching your search.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const userTasks = tasks.filter((t) => t.assigned_to === u.id);
                  const completedTasksCount = userTasks.filter(
                    (t) => t.status === 'Completed'
                  ).length;
                  const managedProjectsCount = projects.filter(
                    (p) => p.manager_id === u.id
                  ).length;

                  return (
                    <div
                      key={u.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : u.role === 'PROJECT_MANAGER'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{u.name}</span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'PROJECT_MANAGER'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {u.role.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                        </div>
                      </div>

                      {/* Workload / Role Meta */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {u.role === 'PROJECT_MANAGER' && (
                          <div className="text-right">
                            <div className="font-semibold text-slate-800">
                              {managedProjectsCount} Projects
                            </div>
                            <div className="text-[10px] text-slate-400">Managing</div>
                          </div>
                        )}
                        {u.role === 'TEAM_MEMBER' && (
                          <div className="text-right">
                            <div className="font-semibold text-slate-800">
                              {completedTasksCount} / {userTasks.length} Completed
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {userTasks.length > 0
                                ? `${Math.round(
                                    (completedTasksCount / userTasks.length) * 100
                                  )}% completion rate`
                                : 'No tasks assigned'}
                            </div>
                          </div>
                        )}
                        {u.role === 'ADMIN' && (
                          <div className="text-right">
                            <div className="font-semibold text-purple-700 flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5" /> Full Access
                            </div>
                            <div className="text-[10px] text-slate-400">System Administrator</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* PROJECTS LIST */}
          {isProjectView && (
            <div className="space-y-3">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No projects found matching your criteria.
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const projectTasks = tasks.filter((t) => t.project_id === p.id);
                  const completed = projectTasks.filter((t) => t.status === 'Completed').length;
                  const inProgress = projectTasks.filter((t) => t.status === 'In Progress').length;
                  const pending = projectTasks.filter((t) => t.status === 'Pending').length;
                  const total = projectTasks.length;
                  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (onSelectProject) {
                          onSelectProject(p);
                          onClose();
                        }
                      }}
                      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 shadow-2xs space-y-3 cursor-pointer transition-all hover:shadow-xs group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              <span>{p.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-60" />
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                p.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : p.status === 'Planning'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-semibold text-slate-700">
                            Manager: {p.manager_name || 'Unassigned'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {p.start_date} → {p.end_date}
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-500 font-medium">Work Completion</span>
                          <span className="font-bold text-slate-800">
                            {completed}/{total} Tasks ({percent}%)
                          </span>
                        </div>
                        <ProgressBar percentage={percent} size="sm" />
                      </div>

                      {/* Breakdown badges */}
                      <div className="flex items-center gap-2 text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                        <span className="text-emerald-700 font-medium">✓ {completed} Completed</span>
                        <span>•</span>
                        <span className="text-blue-700 font-medium">⚡ {inProgress} In Progress</span>
                        <span>•</span>
                        <span className="text-amber-700 font-medium">⏳ {pending} Pending</span>
                        <span className="ml-auto text-[10px] text-blue-600 font-medium group-hover:underline">Click for full project modal →</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TASKS LIST */}
          {isTaskView && (
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No tasks found matching your filter.
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      if (onSelectTask) {
                        onSelectTask(t);
                        onClose();
                      }
                    }}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                          <span>{t.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-60" />
                        </h4>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            t.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            t.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : t.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{t.description}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Project: <strong className="text-slate-600 font-medium">{t.project_title || 'General'}</strong></span>
                        <span>•</span>
                        <span>Deadline: <strong className="text-slate-600 font-medium">{t.deadline}</strong></span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 sm:text-right">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-right group-hover:border-blue-200">
                        <div className="text-xs font-semibold text-slate-800">
                          {t.assignee_name || 'Unassigned'}
                        </div>
                        <div className="text-[10px] text-slate-400">Assigned Member</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* OVERALL PROGRESS VIEW */}
          {isOverallProgressView && (
            <div className="space-y-5">
              {/* Formula & Overall Completion Banner */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Live Mathematical Formula</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      Progress = (Completed Tasks / Total Tasks) × 100
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      ({completedTasksCount} / {tasks.length}) × 100 = <strong className="text-emerald-700 font-bold">{overallPercentage}% Complete</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-emerald-600 font-mono">{overallPercentage}%</span>
                  </div>
                </div>

                {/* Percentage Bar Right Beside / Full Width */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Overall Project Progress</span>
                    <span>{overallPercentage}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3.5 rounded-full transition-all duration-700"
                      style={{ width: `${overallPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Breakdown 3 Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
                  <div className="text-xs font-semibold text-emerald-800">Completed</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{completedTasksCount}</div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">
                    {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}% of all tasks
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
                  <div className="text-xs font-semibold text-blue-800">In Progress</div>
                  <div className="text-2xl font-black text-blue-700 mt-1">{inProgressTasksCount}</div>
                  <div className="text-[11px] text-blue-600 mt-0.5">
                    {tasks.length > 0 ? Math.round((inProgressTasksCount / tasks.length) * 100) : 0}% of all tasks
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-center">
                  <div className="text-xs font-semibold text-amber-800">Pending</div>
                  <div className="text-2xl font-black text-amber-700 mt-1">{pendingTasksCount}</div>
                  <div className="text-[11px] text-amber-600 mt-0.5">
                    {tasks.length > 0 ? Math.round((pendingTasksCount / tasks.length) * 100) : 0}% of all tasks
                  </div>
                </div>
              </div>

              {/* Projects Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Project-by-Project Progress ({projects.length})
                </h4>
                <div className="space-y-2.5">
                  {projects.map((p) => {
                    const pTasks = tasks.filter((t) => t.project_id === p.id);
                    const pDone = pTasks.filter((t) => t.status === 'Completed').length;
                    const pTotal = pTasks.length;
                    const pPct = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (onSelectProject) {
                            onSelectProject(p);
                            onClose();
                          }
                        }}
                        className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-xs group space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                            <span>{p.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-60" />
                          </span>
                          <span className="text-xs font-bold font-mono text-emerald-700">
                            {pPct}% ({pDone}/{pTotal} Tasks)
                          </span>
                        </div>
                        <ProgressBar percentage={pPct} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Showing complete details directly linked with database tables.
          </div>
          <div className="flex gap-2">
            {onNavigateToSection && (
              <button
                onClick={() => {
                  if (isUserView) onNavigateToSection('users');
                  else if (isProjectView) onNavigateToSection('projects');
                  else if (isTaskView) onNavigateToSection('tasks');
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Manage in Tab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
