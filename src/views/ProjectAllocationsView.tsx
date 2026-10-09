import React, { useState } from 'react';
import { Project, Task, User, MemberWorkload } from '../types';
import {
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User as UserIcon,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Search,
  CheckSquare,
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { MetricDetailModal, MetricDetailType } from '../components/MetricDetailModal';

interface ProjectAllocationsViewProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
  membersWorkload?: MemberWorkload[];
  onSelectProject: (project: Project) => void;
  onSelectTask: (task: Task) => void;
  onSelectMember?: (member: User) => void;
}

export const ProjectAllocationsView: React.FC<ProjectAllocationsViewProps> = ({
  projects,
  tasks,
  users,
  membersWorkload = [],
  onSelectProject,
  onSelectTask,
  onSelectMember,
}) => {
  const [viewMode, setViewMode] = useState<'by_project' | 'by_member'>('by_project');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');
  const [activeMetricDetail, setActiveMetricDetail] = useState<MetricDetailType | null>(null);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.manager_name && p.manager_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate team members for each project
  const getProjectAllocations = (projectId: number) => {
    const projTasks = tasks.filter((t) => t.project_id === projectId);
    const assignedUserIds = Array.from(
      new Set(projTasks.map((t) => t.assigned_to).filter((id) => id > 0))
    );

    const membersOnProject = assignedUserIds.map((userId) => {
      const user = users.find((u) => u.id === userId);
      const userTasks = projTasks.filter((t) => t.assigned_to === userId);
      const completed = userTasks.filter((t) => t.status === 'Completed').length;
      const total = userTasks.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        user: user || { id: userId, name: `User #${userId}`, email: '', role: 'TEAM_MEMBER' as const },
        tasks: userTasks,
        completedTasks: completed,
        totalTasks: total,
        progressPercentage: progress,
      };
    });

    return {
      tasks: projTasks,
      members: membersOnProject,
    };
  };

  // Get project allocations per team member
  const teamMembers = users.filter((u) => u.role === 'TEAM_MEMBER' || u.role === 'PROJECT_MANAGER');
  const filteredMembers = teamMembers.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getMemberProjects = (userId: number) => {
    const userTasks = tasks.filter((t) => t.assigned_to === userId);
    const projIds = Array.from(new Set(userTasks.map((t) => t.project_id)));

    const projectsList = projIds.map((pId) => {
      const project = projects.find((p) => p.id === pId);
      const tasksInProj = userTasks.filter((t) => t.project_id === pId);
      const completed = tasksInProj.filter((t) => t.status === 'Completed').length;
      const total = tasksInProj.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        project: project || {
          id: pId,
          title: `Project #${pId}`,
          description: '',
          start_date: '',
          end_date: '',
          status: 'In Progress' as const,
          manager_id: 0,
          total_tasks: total,
          completed_tasks: completed,
          in_progress_tasks: 0,
          pending_tasks: 0,
          progress_percentage: progress,
        },
        tasks: tasksInProj,
        completedTasks: completed,
        totalTasks: total,
        progressPercentage: progress,
      };
    });

    const totalAssigned = userTasks.length;
    const totalCompleted = userTasks.filter((t) => t.status === 'Completed').length;
    const overallRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

    return {
      totalTasks: totalAssigned,
      completedTasks: totalCompleted,
      overallProgress: overallRate,
      projects: projectsList,
      tasks: userTasks,
    };
  };

  // Overall Statistics
  const totalAllocatedTasks = tasks.filter((t) => t.assigned_to > 0).length;
  const activeWorkingMembers = new Set(tasks.map((t) => t.assigned_to).filter((id) => id > 0)).size;
  const overallCompletedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overallPercent = tasks.length > 0 ? Math.round((overallCompletedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Team &amp; Workload Distribution</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Project Allocations &amp; Team Progress
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track which team members are assigned to which projects and monitor completion rates in real time. Click any card to inspect full details.
          </p>
        </div>

        {/* View Switcher: By Project vs By Team Member */}
        <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('by_project')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              viewMode === 'by_project'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-blue-600" />
            <span>By Project ({projects.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('by_member')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              viewMode === 'by_member'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>By Team Member ({teamMembers.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards - Clickable to open full details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveMetricDetail('total_projects')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Projects</div>
            <FolderKanban className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{projects.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Under Active Tracking</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View all projects</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetricDetail('active_assignees')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Active Assignees</div>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{activeWorkingMembers} Members</div>
          <div className="text-xs text-slate-500 mt-0.5">Assigned to Work Units</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View team members</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetricDetail('total_tasks')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Work Units</div>
            <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{tasks.length} Tasks</div>
          <div className="text-xs text-slate-500 mt-0.5">{totalAllocatedTasks} Assigned / {tasks.length - totalAllocatedTasks} Unassigned</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View all work units</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetricDetail('overall_progress')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-emerald-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Overall Progress</div>
            <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{overallPercent}%</div>
          <div className="text-xs text-slate-500 mt-0.5">Formula: (Completed / Total) × 100</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View progress breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={viewMode === 'by_project' ? 'Search projects or managers...' : 'Search team members...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {viewMode === 'by_project' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        )}
      </div>

      {/* 1. BY PROJECT VIEW */}
      {viewMode === 'by_project' && (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No projects found matching current criteria.
            </div>
          ) : (
            filteredProjects.map((project) => {
              const allocation = getProjectAllocations(project.id);

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5 transition-all hover:border-blue-300"
                >
                  {/* Project Top Bar */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400 font-medium">
                          PROJECT #{project.id}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                            project.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : project.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <h3
                        onClick={() => onSelectProject(project)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-2"
                        title="Click to view full project details modal"
                      >
                        <span>{project.title}</span>
                        <ArrowRight className="w-4 h-4 text-blue-500 opacity-60" />
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                        {project.description}
                      </p>
                    </div>

                    {/* Timeline & Manager */}
                    <div className="text-xs text-slate-500 shrink-0 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <span>Manager: {project.manager_name || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.start_date} → {project.end_date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Progress Bar */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-150">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        <span>Project Overall Completion</span>
                      </span>
                      <span className="font-mono font-bold text-blue-700 text-sm">
                        {project.progress_percentage}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={project.progress_percentage}
                      completedTasks={project.completed_tasks}
                      totalTasks={project.total_tasks}
                      size="md"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                      <span>Formula: ({project.completed_tasks} Completed / {project.total_tasks} Total) × 100</span>
                      <span>
                        {project.in_progress_tasks} In Progress · {project.pending_tasks} Pending
                      </span>
                    </div>
                  </div>

                  {/* Team Members Working On This Project */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Team Members Working On This Project ({allocation.members.length})</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Click on member or task to open details
                      </span>
                    </div>

                    {allocation.members.length === 0 ? (
                      <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-400">
                        No team members currently assigned to tasks in this project.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {allocation.members.map((alloc) => (
                          <div
                            key={alloc.user.id}
                            className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors flex flex-col justify-between space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div
                                onClick={() => onSelectMember && onSelectMember(alloc.user)}
                                className="flex items-center gap-2.5 cursor-pointer group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs group-hover:bg-blue-700">
                                  {alloc.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                    {alloc.user.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">
                                    {alloc.user.email}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                {alloc.progressPercentage}%
                              </span>
                            </div>

                            {/* Member Progress Bar on this project */}
                            <div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                                <span>Tasks Completed:</span>
                                <span className="font-semibold text-slate-800">
                                  {alloc.completedTasks} / {alloc.totalTasks}
                                </span>
                              </div>
                              <ProgressBar
                                percentage={alloc.progressPercentage}
                                size="sm"
                              />
                            </div>

                            {/* Assigned Task Badges */}
                            <div className="space-y-1 pt-1 border-t border-slate-200/80">
                              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                Assigned Tasks ({alloc.tasks.length}):
                              </div>
                              <div className="space-y-1">
                                {alloc.tasks.map((t) => (
                                  <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => onSelectTask(t)}
                                    className="w-full text-left p-1.5 bg-white rounded-md border border-slate-200/90 text-[11px] font-medium text-slate-800 hover:border-blue-500 hover:text-blue-600 flex items-center justify-between transition-colors"
                                    title="Click to view task details"
                                  >
                                    <span className="truncate pr-2">• {t.title}</span>
                                    <span
                                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                                        t.status === 'Completed'
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : t.status === 'In Progress'
                                          ? 'bg-blue-50 text-blue-700'
                                          : 'bg-amber-50 text-amber-700'
                                      }`}
                                    >
                                      {t.status}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. BY TEAM MEMBER VIEW */}
      {viewMode === 'by_member' && (
        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No team members found matching current query.
            </div>
          ) : (
            filteredMembers.map((member) => {
              const memData = getMemberProjects(member.id);

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 transition-all hover:border-emerald-300"
                >
                  {/* Member Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                            {member.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                      </div>
                    </div>

                    {/* Overall Workload Stats */}
                    <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Projects</div>
                        <div className="font-bold text-slate-900 font-mono">{memData.projects.length} Projects</div>
                      </div>
                      <div className="h-6 w-px bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Tasks Completed</div>
                        <div className="font-bold text-slate-900 font-mono">
                          {memData.completedTasks} / {memData.totalTasks}
                        </div>
                      </div>
                      <div className="h-6 w-px bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall Rate</div>
                        <div className="font-bold text-emerald-600 font-mono">{memData.overallProgress}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Projects Member is Working On */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                      <span>Projects Assigned To This Member ({memData.projects.length}):</span>
                    </h4>

                    {memData.projects.length === 0 ? (
                      <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-400">
                        No active project tasks currently assigned to this member.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {memData.projects.map((item) => (
                          <div
                            key={item.project.id}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400">PROJECT #{item.project.id}</span>
                                <div
                                  onClick={() => onSelectProject(item.project)}
                                  className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1 mt-0.5"
                                  title="Click to view project details"
                                >
                                  <span>{item.project.title}</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                              </div>
                              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                                {item.progressPercentage}% Done
                              </span>
                            </div>

                            <ProgressBar
                              percentage={item.progressPercentage}
                              completedTasks={item.completedTasks}
                              totalTasks={item.totalTasks}
                              size="sm"
                            />

                            {/* Tasks on this project */}
                            <div className="space-y-1">
                              {item.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  type="button"
                                  onClick={() => onSelectTask(task)}
                                  className="w-full text-left p-1.5 bg-white rounded-md border border-slate-200/90 text-[11px] font-medium text-slate-800 hover:border-blue-500 hover:text-blue-600 flex items-center justify-between transition-colors"
                                >
                                  <span className="truncate pr-2">• {task.title}</span>
                                  <span
                                    className={`text-[9px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                                      task.status === 'Completed'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : task.status === 'In Progress'
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }`}
                                  >
                                    {task.status}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Metric Detail Inspection Modal */}
      <MetricDetailModal
        isOpen={activeMetricDetail !== null}
        type={activeMetricDetail}
        onClose={() => setActiveMetricDetail(null)}
        users={users}
        projects={projects}
        tasks={tasks}
        onSelectProject={onSelectProject}
        onSelectTask={onSelectTask}
      />
    </div>
  );
};
