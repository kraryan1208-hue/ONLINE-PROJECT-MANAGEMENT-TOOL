import React, { useState } from 'react';
import { Task, Project, User } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  User as UserIcon,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface DashboardDataTableProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onSelectProject: (project: Project) => void;
  onUpdateTaskStatus?: (taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
}

export const DashboardDataTable: React.FC<DashboardDataTableProps> = ({
  tasks,
  projects,
  users,
  onSelectTask,
  onSelectProject,
  onUpdateTaskStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects'>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Completed' | 'In Progress' | 'Pending'>('ALL');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignee_name && t.assignee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.project_title && t.project_title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProjects = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.manager_name && p.manager_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-untitledui-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Live Workspace Deliverables &amp; Tracking
            </h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {activeTab === 'tasks' ? `${filteredTasks.length} tasks` : `${filteredProjects.length} projects`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking. Click any row to view complete project contributors and task specifications.
          </p>
        </div>

        {/* View Switcher: Tasks Table vs Projects Table */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/70">
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white text-slate-900 shadow-untitledui-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tasks Matrix ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-slate-900 shadow-untitledui-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Projects Matrix ({projects.length})
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'tasks' ? 'Search task by title, assignee, project...' : 'Search project...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg shadow-untitledui-xs focus:outline-hidden focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
          />
        </div>

        {activeTab === 'tasks' && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            {(['ALL', 'Pending', 'In Progress', 'Completed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white font-semibold shadow-untitledui-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TABLE 1: TASKS MATRIX */}
      {activeTab === 'tasks' && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Task Deliverable</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No task records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.slice(0, 7).map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400">#{task.id}</span>
                        <span>{task.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-medium text-slate-800">{task.project_title || 'General'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                          {task.assignee_name ? task.assignee_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium text-slate-700">{task.assignee_name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{task.deadline}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(task.status)}</td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {onUpdateTaskStatus ? (
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] font-medium border border-slate-200 rounded-md bg-white hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-untitledui-xs"
                        >
                          <option value="Pending">Mark Pending</option>
                          <option value="In Progress">Mark In Progress</option>
                          <option value="Completed">Mark Completed</option>
                        </select>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectTask(task)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 ml-auto"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TABLE 2: PROJECTS MATRIX */}
      {activeTab === 'projects' && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Project Manager</th>
                <th className="py-3 px-4">Target Deadline</th>
                <th className="py-3 px-4">Progress (% Rate)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No project records found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    onClick={() => onSelectProject(proj)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400">#{proj.id}</span>
                        <span>{proj.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          {proj.manager_name ? proj.manager_name.charAt(0).toUpperCase() : 'M'}
                        </div>
                        <span className="font-medium text-slate-800">{proj.manager_name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {proj.end_date || 'Ongoing'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <span className="font-mono font-semibold text-slate-800 w-8">{proj.progress_percentage}%</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${proj.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : proj.status === 'In Progress'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            proj.status === 'Completed'
                              ? 'bg-emerald-500'
                              : proj.status === 'In Progress'
                              ? 'bg-indigo-500'
                              : 'bg-purple-500'
                          }`}
                        />
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectProject(proj)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        <span>Inspect Team</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {activeTab === 'tasks' ? Math.min(filteredTasks.length, 7) : filteredProjects.length} of{' '}
          {activeTab === 'tasks' ? tasks.length : projects.length} live records
        </div>
        <div className="text-[11px] text-slate-400">
          Derived dynamically from verified JDBC database state
        </div>
      </div>
    </div>
  );
};
