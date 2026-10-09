import React, { useState } from 'react';
import { Project, Task, User, ReportSummary, MemberWorkload } from '../types';
import {
  FolderKanban,
  CheckSquare,
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { DoughnutChart } from '../components/DoughnutChart';
import { MetricDetailModal, MetricDetailType } from '../components/MetricDetailModal';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

interface ManagerDashboardViewProps {
  currentUserId: number;
  projects: Project[];
  tasks: Task[];
  teamMembers: User[];
  summary: ReportSummary;
  membersWorkload: MemberWorkload[];
  activeSection: 'dashboard' | 'projects' | 'tasks' | 'team';
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onCreateTask: (defaultProjectId?: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: number, status: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
  onNavigateSection?: (section: 'dashboard' | 'projects' | 'tasks' | 'team') => void;
  successMessage?: string;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  currentUserId,
  projects,
  tasks,
  teamMembers,
  summary,
  membersWorkload,
  activeSection,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onNavigateSection,
  successMessage,
}) => {
  // Filters
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('ALL');
  const [taskProjectFilter, setTaskProjectFilter] = useState<number | 'ALL'>('ALL');

  const [projectSearch, setProjectSearch] = useState('');

  // Modal inspection state
  const [activeMetricDetail, setActiveMetricDetail] = useState<MetricDetailType | null>(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<Project | null>(null);

  // Manager specific projects
  const myProjects = projects.filter((p) => p.manager_id === currentUserId || true); // View workspace projects

  // Filtered Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.assignee_name && t.assignee_name.toLowerCase().includes(taskSearch.toLowerCase()));
    const matchesStatus = taskStatusFilter === 'ALL' || t.status === taskStatusFilter;
    const matchesPriority = taskPriorityFilter === 'ALL' || t.priority === taskPriorityFilter;
    const matchesProject = taskProjectFilter === 'ALL' || t.project_id === taskProjectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const doughnutData = [
    { name: 'Completed', value: summary.completedTasks, color: '#10B981' },
    { name: 'In Progress', value: summary.inProgressTasks, color: '#3B82F6' },
    { name: 'Pending', value: summary.pendingTasks, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* SECTION: DASHBOARD */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Manager Workspace</h2>
              <p className="text-xs text-slate-500">
                Track deliverables, distribute workloads, and enforce task deadlines.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onCreateTask()}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
              <button
                onClick={onCreateProject}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* 7 Specific Cards required for Project Manager */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_projects')}
              className="text-left p-4 bg-white hover:bg-purple-50/40 hover:border-purple-300 transition-all rounded-xl border border-slate-200 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              title="Click to view Total Projects details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                <span>Total Projects</span>
                <span className="text-[10px] text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-purple-700">{summary.totalProjects}</div>
              <div className="text-[10px] text-slate-400 mt-1">Under Supervision</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('active_projects')}
              className="text-left p-4 bg-white hover:bg-blue-50/40 hover:border-blue-300 transition-all rounded-xl border border-slate-200 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              title="Click to view Active Projects details"
            >
              <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1 group-hover:text-blue-800 transition-colors flex items-center justify-between">
                <span>Active Projects</span>
                <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">{summary.activeProjects}</div>
              <div className="text-[10px] text-blue-600 mt-1 font-medium">In Progress</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_projects')}
              className="text-left p-4 bg-white hover:bg-emerald-50/40 hover:border-emerald-300 transition-all rounded-xl border border-slate-200 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              title="Click to view Completed Projects details"
            >
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>Completed</span>
                <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700">{summary.completedProjects}</div>
              <div className="text-[10px] text-emerald-600 mt-1 font-medium">Finished</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_tasks')}
              className="text-left p-4 bg-white hover:bg-slate-100 hover:border-slate-300 transition-all rounded-xl border border-slate-200 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-500/20"
              title="Click to view Total Tasks details"
            >
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-slate-700 transition-colors flex items-center justify-between">
                <span>Total Tasks</span>
                <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800">{summary.totalTasks}</div>
              <div className="text-[10px] text-slate-400 mt-1">Assigned</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('completed_tasks')}
              className="text-left p-4 bg-white hover:bg-emerald-50/40 hover:border-emerald-300 transition-all rounded-xl border border-slate-200 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              title="Click to view Completed Tasks details"
            >
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
                <span>Completed Tasks</span>
                <span className="text-[10px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 group-hover:text-emerald-700">{summary.completedTasks}</div>
              <div className="text-[10px] text-emerald-600 mt-1 font-medium">100% Verified</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('pending_tasks')}
              className="text-left p-4 bg-white hover:bg-amber-50/40 hover:border-amber-300 transition-all rounded-xl border border-slate-200 shadow-2xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              title="Click to view Pending Tasks details"
            >
              <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1 group-hover:text-amber-800 transition-colors flex items-center justify-between">
                <span>Pending Tasks</span>
                <span className="text-[10px] text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 group-hover:text-amber-700">{summary.pendingTasks}</div>
              <div className="text-[10px] text-amber-600 mt-1 font-medium">In Queue</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveMetricDetail('team_members')}
              className="text-left p-4 bg-white hover:bg-indigo-50/40 hover:border-indigo-300 transition-all rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1 group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              title="Click to view Team Members details"
            >
              <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider mb-1 group-hover:text-indigo-800 transition-colors flex items-center justify-between">
                <span>Team Members</span>
                <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600 group-hover:text-indigo-700">{teamMembers.length}</div>
              <div className="text-[10px] text-indigo-600 mt-1 font-medium">Active Engineers</div>
            </button>
          </div>

          {/* Chart & Projects Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Task Breakdown Chart</h3>
                <p className="text-xs text-slate-500 mb-4">Real-time status proportions</p>
              </div>
              <DoughnutChart data={doughnutData} />
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs">
                <span className="text-slate-500">Overall Progress</span>
                <span className="font-bold text-slate-900">{summary.overallProgressPercentage}%</span>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Project Progress Telemetry</h3>
                  <p className="text-xs text-slate-500">Formula: (Completed Tasks / Total Tasks) × 100</p>
                </div>
                <button
                  onClick={onCreateProject}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  + Add Project
                </button>
              </div>

              <div className="space-y-4">
                {myProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectDetail(p)}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group shadow-2xs"
                    title={`Click to view full details of ${p.title}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {p.title}
                          </h4>
                          <span className="text-[11px] font-semibold text-blue-600 font-mono">
                            {p.status}
                          </span>
                          <span className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details ↗
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {p.progress_percentage}%
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {p.completed_tasks}/{p.total_tasks} completed
                        </div>
                      </div>
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

      {/* SECTION: MY PROJECTS */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Managed Projects</h2>
              <p className="text-xs text-slate-500">
                Create and track projects, set timelines, and allocate resources.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProjects.map((p) => (
              <div key={p.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">PROJECT #{p.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{p.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProject(p)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(p)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{p.start_date} → {p.end_date}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{p.status}</span>
                </div>

                <div>
                  <ProgressBar
                    percentage={p.progress_percentage}
                    completedTasks={p.completed_tasks}
                    totalTasks={p.total_tasks}
                    size="md"
                  />
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Work Units: {p.total_tasks}</span>
                  <button
                    onClick={() => onCreateTask(p.id)}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    + Assign New Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: TASK MANAGEMENT */}
      {activeSection === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Task Management &amp; Assignment</h2>
              <p className="text-xs text-slate-500">
                Assign tasks to Team Members, set priorities (Low/Med/High), deadlines, and status.
              </p>
            </div>
            <button
              onClick={() => onCreateTask()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create &amp; Assign Task</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks or assignee..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={taskPriorityFilter}
                onChange={(e) => setTaskPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={taskProjectFilter}
                onChange={(e) => setTaskProjectFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Task Title</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Assigned Member</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No tasks match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">#{t.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{t.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{t.description}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{t.project_title}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900">
                            {t.assignee_name || 'Unassigned'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              t.priority === 'High'
                                ? 'text-rose-700'
                                : t.priority === 'Medium'
                                ? 'text-amber-700'
                                : 'text-slate-700'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{t.deadline}</td>
                        <td className="py-3 px-4">
                          <select
                            value={t.status}
                            onChange={(e) =>
                              onUpdateTaskStatus(t.id, e.target.value as 'Pending' | 'In Progress' | 'Completed')
                            }
                            className={`text-xs font-semibold py-1 px-2 rounded-md border border-slate-200 bg-white ${
                              t.status === 'Completed'
                                ? 'text-emerald-700'
                                : t.status === 'In Progress'
                                ? 'text-blue-700'
                                : 'text-amber-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => onEditTask(t)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors"
                            title="Edit Task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(t)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md transition-colors"
                            title="Delete Task"
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

      {/* SECTION: TEAM MEMBERS OVERVIEW */}
      {activeSection === 'team' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Team Member Overview &amp; Performance</h2>
            <p className="text-xs text-slate-500">
              Workload distribution, assigned tasks, and completion rates across engineering team.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Total Assigned</th>
                    <th className="py-3 px-4 text-center">Completed</th>
                    <th className="py-3 px-4 text-center">In Progress</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-right">Completion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {membersWorkload.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{m.email}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">{m.total_tasks}</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">{m.completed_tasks}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-600">{m.in_progress_tasks}</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-600">{m.pending_tasks}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-slate-900">{m.completion_rate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Metric Detail Modal for statistics cards */}
      <MetricDetailModal
        isOpen={activeMetricDetail !== null}
        type={activeMetricDetail}
        onClose={() => setActiveMetricDetail(null)}
        users={teamMembers}
        projects={projects}
        tasks={tasks}
        onNavigateToSection={(sec) => {
          if (onNavigateSection) {
            onNavigateSection(sec as any);
          }
        }}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={selectedProjectDetail !== null}
        project={selectedProjectDetail}
        tasks={tasks}
        users={teamMembers}
        onClose={() => setSelectedProjectDetail(null)}
        onEdit={(p) => onEditProject(p)}
      />
    </div>
  );
};
