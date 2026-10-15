import React, { useState } from 'react';
import { Task, Project, User } from '../types';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  Layers,
  Search,
} from 'lucide-react';
import { ProgressBar } from '../components/ProgressBar';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { DashboardChartsSection, PieChartItem, BarGraphItem } from '../components/DashboardCharts';
import { DashboardDataTable } from '../components/DashboardDataTable';

interface MemberDashboardViewProps {
  currentUser: User;
  tasks: Task[];
  projects: Project[];
  users?: User[];
  onUpdateStatus: (taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
  successMessage?: string;
  activeSection: 'dashboard' | 'tasks' | 'projects';
}

export const MemberDashboardView: React.FC<MemberDashboardViewProps> = ({
  currentUser,
  tasks,
  projects,
  users = [],
  onUpdateStatus,
  successMessage,
  activeSection,
}) => {
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<Project | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  // Tasks assigned to current team member
  const myTasks = tasks.filter((t) => t.assigned_to === currentUser.id);

  const totalAssigned = myTasks.length;
  const pendingCount = myTasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = myTasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = myTasks.filter((t) => t.status === 'Completed').length;
  const myCompletionRate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

  // Projects relevant to member
  const relevantProjectIds = new Set(myTasks.map((t) => t.project_id));
  const myProjects = projects.filter((p) => relevantProjectIds.has(p.id) || true);

  // Personal chart telemetry data
  const statusData: PieChartItem[] = [
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'In Progress', value: inProgressCount, color: '#6366F1' },
    { name: 'Pending', value: pendingCount, color: '#F59E0B' },
  ];

  const priorityData: PieChartItem[] = [
    { name: 'High', value: myTasks.filter((t) => t.priority === 'High').length, color: '#EF4444' },
    { name: 'Medium', value: myTasks.filter((t) => t.priority === 'Medium').length, color: '#F59E0B' },
    { name: 'Low', value: myTasks.filter((t) => t.priority === 'Low').length, color: '#64748B' },
  ];

  const barData: BarGraphItem[] = projects.map((p) => {
    const projTasks = myTasks.filter((t) => t.project_id === p.id);
    const doneTasks = projTasks.filter((t) => t.status === 'Completed').length;
    return {
      label: p.title.length > 14 ? p.title.substring(0, 12) + '...' : p.title,
      completed: doneTasks,
      pendingOrTotal: projTasks.length > 0 ? projTasks.length : p.total_tasks,
      rate: projTasks.length > 0 ? Math.round((doneTasks / projTasks.length) * 100) : p.progress_percentage,
    };
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* DASHBOARD OR TASKS SECTION */}
      {(activeSection === 'dashboard' || activeSection === 'tasks') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Developer Task Board</h2>
              <p className="text-xs text-slate-500">
                Welcome back, {currentUser.name}. Update task progress in real time to synchronize metrics.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-untitledui-xs p-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Personal Completion Rate: {myCompletionRate}%</span>
            </div>
          </div>

          {/* 4 Professional Metric Cards - Untitled UI Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Assigned */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Assigned
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Deliverables</div>
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
                  {totalAssigned}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                Active in workspace
              </div>
            </div>

            {/* Card 2: Pending Tasks */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100/70 flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  To Start
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Pending Tasks</div>
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-amber-600 mt-0.5">
                  {pendingCount}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                In backlog queue
              </div>
            </div>

            {/* Card 3: In Progress Tasks */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100/70 flex items-center justify-center text-sky-600">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                  Active
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[11px] font-medium text-sky-700 uppercase tracking-wider">In Progress</div>
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-sky-600 mt-0.5">
                  {inProgressCount}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                Under active development
              </div>
            </div>

            {/* Card 4: Completed Tasks */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {myCompletionRate}%
                </span>
              </div>
              <div className="mt-3">
                <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Completed Tasks</div>
                <div className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-600 mt-0.5">
                  {completedCount}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                Delivered &amp; verified
              </div>
            </div>
          </div>

          {/* CHARTS SECTION: PI CHARTS & VELOCITY GRAPH */}
          <DashboardChartsSection
            statusData={statusData}
            priorityData={priorityData}
            barData={barData}
            completionRate={myCompletionRate}
            totalTasks={totalAssigned}
            completedTasks={completedCount}
          />

          {/* TABLES SECTION: LIVE WORKSPACE DELIVERABLES & TRACKING TABLE */}
          <DashboardDataTable
            tasks={myTasks}
            projects={projects}
            users={users}
            onSelectTask={(task) => setSelectedTaskDetail(task)}
            onSelectProject={(project) => setSelectedProjectDetail(project)}
            onUpdateTaskStatus={onUpdateStatus}
          />

          {/* Direct Task Cards for Fast Action */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Task Cards &amp; Quick Progress Actions</h3>
              <span className="text-xs text-slate-500">{myTasks.length} Assigned Deliverables</span>
            </div>

            {myTasks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                You have no active assigned tasks at this moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTasks.map((task) => {
                  const isDone = task.status === 'Completed';
                  const isInProgress = task.status === 'In Progress';

                  return (
                    <div
                      key={task.id}
                      className={`p-5 bg-white rounded-xl border transition-all ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isInProgress
                          ? 'border-blue-200 bg-blue-50/10 shadow-xs'
                          : 'border-slate-200 shadow-2xs'
                      } space-y-4`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              TASK #{task.id}
                            </span>
                            <span
                              className={`text-[11px] font-bold ${
                                task.priority === 'High'
                                  ? 'text-rose-600'
                                  : task.priority === 'Medium'
                                  ? 'text-amber-600'
                                  : 'text-slate-500'
                              }`}
                            >
                              Priority: {task.priority}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h4>
                        </div>

                        {/* Status Label */}
                        <span
                          className={`text-xs font-bold ${
                            isDone
                              ? 'text-emerald-700'
                              : isInProgress
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-medium text-slate-800">{task.project_title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {task.deadline}</span>
                        </div>
                      </div>

                      {/* Interactive Status Changer Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">Update Status:</span>
                        <div className="flex gap-1.5">
                          <button
                            disabled={task.status === 'Pending'}
                            onClick={() => onUpdateStatus(task.id, 'Pending')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                              task.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 cursor-default'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            disabled={task.status === 'In Progress'}
                            onClick={() => onUpdateStatus(task.id, 'In Progress')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                              task.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800 cursor-default'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            disabled={task.status === 'Completed'}
                            onClick={() => onUpdateStatus(task.id, 'Completed')}
                            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                              task.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Completed ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MY PROJECTS SECTION */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Projects I Am Contributing To</h2>
            <p className="text-xs text-slate-500">
              Overview of milestone completion, total tasks, and deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProjectDetail(p)}
                className="p-5 bg-white hover:bg-blue-50/40 rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs space-y-4 cursor-pointer transition-all group"
                title={`Click to view full details of ${p.title}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400">PROJECT #{p.id}</span>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                        {p.title}
                      </h3>
                      <span className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details ↗
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">{p.status}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                <div className="pt-2 border-t border-slate-100">
                  <ProgressBar
                    percentage={p.progress_percentage}
                    completedTasks={p.completed_tasks}
                    totalTasks={p.total_tasks}
                    size="md"
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>Project Deadline: {p.end_date}</span>
                  <span className="font-semibold text-slate-700">{p.progress_percentage}% Overall</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectDetailModal
        isOpen={selectedProjectDetail !== null}
        project={selectedProjectDetail}
        tasks={tasks}
        users={users}
        onClose={() => setSelectedProjectDetail(null)}
      />

      {/* Task Details Modal */}
      <TaskDetailModal
        isOpen={selectedTaskDetail !== null}
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        project={projects.find((p) => p.id === selectedTaskDetail?.project_id)}
        assignee={users.find((u) => u.id === selectedTaskDetail?.assigned_to) || currentUser}
        onUpdateStatus={(id, st) => onUpdateStatus(id, st)}
        canEdit={false}
      />
    </div>
  );
};
