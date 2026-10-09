import React, { useState } from 'react';
import { Task, Project, User, TaskStatus, TaskPriority } from '../types';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Users,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';

export type TaskManagementSubTab = 'overview' | 'create' | 'manage' | 'edit' | 'total';

interface TaskManagementViewProps {
  tasks: Task[];
  projects: Project[];
  teamMembers: User[];
  currentUserId: number;
  userRole: string;
  initialSubTab?: TaskManagementSubTab;
  onCreateTask: (defaultProjectId?: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
  onSelectTaskDetail: (task: Task) => void;
}

export const TaskManagementView: React.FC<TaskManagementViewProps> = ({
  tasks,
  projects,
  teamMembers,
  currentUserId,
  userRole,
  initialSubTab = 'overview',
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onSelectTaskDetail,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<TaskManagementSubTab>(initialSubTab);

  // Search & Filters for Manage & Total tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [projectFilter, setProjectFilter] = useState<'ALL' | number>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<'ALL' | number>('ALL');

  // Filtered task catalog
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.project_title && t.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.assignee_name && t.assignee_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'ALL' || t.project_id === projectFilter;
    const matchesAssignee = assigneeFilter === 'ALL' || t.assigned_to === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  });

  // KPI Calculations
  const totalTasksCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High').length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  const canManage = userRole === 'ADMIN' || userRole === 'PROJECT_MANAGER';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task Management System</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Task Management Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, add, manage, overview, edit, and track all tasks. Click any task card or row to view complete details.
          </p>
        </div>

        {/* Quick Add Action */}
        {canManage && (
          <button
            type="button"
            onClick={() => onCreateTask()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create / Add Task</span>
          </button>
        )}
      </div>

      {/* Task Management Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSubTab('create');
            if (canManage) onCreateTask();
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'create'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Create &amp; Add Task</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('manage')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'manage'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Manage Tasks ({filteredTasks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('edit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'edit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Task</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('total')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'total'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Total Tasks ({totalTasksCount})</span>
        </button>
      </div>

      {/* 1. SUB-TAB: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setActiveSubTab('total');
              }}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600">
                Total Tasks
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalTasksCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Click to view all</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setStatusFilter('Completed');
                setActiveSubTab('manage');
              }}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Completed</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{completedCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{completionPercentage}% of work units</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setStatusFilter('In Progress');
                setActiveSubTab('manage');
              }}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">In Progress</div>
              <div className="text-2xl font-black text-blue-700 mt-1">{inProgressCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Under execution</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setStatusFilter('Pending');
                setActiveSubTab('manage');
              }}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending</div>
              <div className="text-2xl font-black text-amber-700 mt-1">{pendingCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Awaiting start</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setPriorityFilter('High');
                setActiveSubTab('manage');
              }}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-rose-400 text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">High Priority</div>
              <div className="text-2xl font-black text-rose-700 mt-1">{highPriorityCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Requires attention</div>
            </button>
          </div>

          {/* Overall Progress Bar Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Task Completion Rate</h3>
                <p className="text-xs text-slate-500">Live formula: (Completed Tasks / Total Tasks) × 100</p>
              </div>
              <span className="text-lg font-black font-mono text-emerald-600">{completionPercentage}%</span>
            </div>
            <ProgressBar
              percentage={completionPercentage}
              completedTasks={completedCount}
              totalTasks={totalTasksCount}
              size="lg"
            />
          </div>

          {/* Recent Tasks Interactive Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">All Tasks Overview (Click any task for details)</h3>
              <button
                type="button"
                onClick={() => setActiveSubTab('total')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTaskDetail(task)}
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">TASK #{task.id}</span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 mt-0.5">
                        {task.title}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                        task.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : task.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2">{task.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="font-medium text-slate-700 truncate max-w-[160px]">
                      {task.project_title || `Project #${task.project_id}`}
                    </span>
                    <span className="font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: CREATE & ADD TASK */}
      {activeSubTab === 'create' && (
        <div className="p-8 bg-white rounded-xl border border-slate-200 shadow-2xs text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Create &amp; Add New Task</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add a new work unit, link to project, assign team member, and define priority and deadline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCreateTask()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Open Task Creation Form</span>
          </button>
        </div>
      )}

      {/* 3. SUB-TAB: MANAGE TASKS */}
      {activeSubTab === 'manage' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, project, assignee..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={projectFilter}
                onChange={(e) =>
                  setProjectFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))
                }
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

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Task Title &amp; Description</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Assigned Member</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status Update</th>
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
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">#{t.id}</td>
                        <td
                          onClick={() => onSelectTaskDetail(t)}
                          className="py-3 px-4 cursor-pointer group"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                            <span>{t.title}</span>
                            <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
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
                              onUpdateTaskStatus(t.id, e.target.value as TaskStatus)
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
                            type="button"
                            onClick={() => onSelectTaskDetail(t)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Complete Details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          {canManage && (
                            <>
                              <button
                                type="button"
                                onClick={() => onEditTask(t)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Task"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteTask(t)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
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

      {/* 4. SUB-TAB: EDIT TASK */}
      {activeSubTab === 'edit' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-medium flex items-center justify-between">
            <span>Select any task below to immediately edit its title, assignee, priority, deadline, or status.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-400 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">TASK #{task.id}</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{task.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {task.project_title} · Assigned to {task.assignee_name || 'Unassigned'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectTaskDetail(task)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    View
                  </button>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SUB-TAB: TOTAL TASKS */}
      {activeSubTab === 'total' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Total Work Units Catalog ({totalTasksCount} Total Tasks)
            </h3>
            <span className="text-xs text-slate-500">Click any card to open complete details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTaskDetail(t)}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-semibold text-slate-400">TASK #{t.id}</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                        t.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : t.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                        t.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : t.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{t.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Project:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                      {t.project_title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Assignee:</span>
                    <span className="font-semibold text-slate-800">
                      {t.assignee_name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Due:</span>
                    <span className="font-mono text-slate-700">{t.deadline}</span>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <span className="text-[11px] font-semibold text-blue-600 flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Click for All Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
