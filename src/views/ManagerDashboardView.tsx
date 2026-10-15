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
  Shield,
  Activity,
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { DoughnutChart } from '../components/DoughnutChart';
import { DashboardChartsSection, PieChartItem, BarGraphItem } from '../components/DashboardCharts';
import { DashboardDataTable } from '../components/DashboardDataTable';
import { MetricDetailModal, MetricDetailType } from '../components/MetricDetailModal';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { TaskDetailModal } from '../components/TaskDetailModal';

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
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

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

  const barData: BarGraphItem[] = myProjects.map((p) => ({
    label: p.title.length > 14 ? p.title.substring(0, 12) + '...' : p.title,
    completed: p.completed_tasks,
    pendingOrTotal: p.total_tasks,
    rate: p.progress_percentage,
  }));

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
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>Create Task</span>
              </button>
              <button
                onClick={onCreateProject}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-untitledui-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* 7 Specific Cards required for Project Manager - Ultra-Professional Untitled UI Style */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Card 1: Total Projects */}
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
                  Scope
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Projects</div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-violet-600 transition-colors mt-0.5">
                  {summary.totalProjects}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Under supervision</span>
                <span className="text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
              </div>
            </button>

            {/* Card 2: Active Projects */}
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

            {/* Card 3: Completed Projects */}
            <button
              type="button"
              onClick={() => setActiveMetricDetail('total_projects')}
              className="text-left p-4 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:shadow-untitledui-sm group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-slate-100 flex flex-col justify-between"
              title="Click to view Completed Projects breakdown"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Closed
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Completed</div>
                <div className="text-2xl font-bold tracking-tight text-emerald-600 group-hover:text-emerald-700 transition-colors mt-0.5">
                  {summary.completedProjects}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-emerald-600 font-medium">Delivered</span>
                <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
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
                  Tasks
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Tasks</div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors mt-0.5">
                  {summary.totalTasks}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Assigned workload</span>
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
                <span className="text-emerald-600 font-medium">100% verified</span>
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
                <span className="text-amber-600 font-medium">In progress queue</span>
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
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Engineers
                </span>
              </div>
              <div className="mt-2.5">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Team Members</div>
                <div className="text-2xl font-bold tracking-tight text-indigo-600 group-hover:text-indigo-700 transition-colors mt-0.5">
                  {teamMembers.length}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Active direct reports</span>
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
            users={teamMembers}
            onSelectTask={(task) => setSelectedTaskDetail(task)}
            onSelectProject={(project) => setSelectedProjectDetail(project)}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
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
              <div
                key={p.id}
                onClick={() => setSelectedProjectDetail(p)}
                className="p-5 bg-white hover:bg-blue-50/30 rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs space-y-4 cursor-pointer transition-all group"
                title={`Click to view team members, roles, and details of ${p.title}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">PROJECT #{p.id}</span>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">{p.title}</h3>
                      <span className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Team &amp; Details ↗
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEditProject(p)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(p)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateTask(p.id);
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
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

      {/* Task Detail Modal for Live Deliverables Table */}
      <TaskDetailModal
        isOpen={selectedTaskDetail !== null}
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        project={projects.find((p) => p.id === selectedTaskDetail?.project_id)}
        assignee={teamMembers.find((u) => u.id === selectedTaskDetail?.assigned_to)}
        onEditTask={(t) => onEditTask(t)}
        onDeleteTask={(id) => {
          const t = tasks.find((tk) => tk.id === id);
          if (t) onDeleteTask(t);
        }}
        onUpdateStatus={(id, st) => onUpdateTaskStatus(id, st)}
        canEdit={true}
      />
    </div>
  );
};
