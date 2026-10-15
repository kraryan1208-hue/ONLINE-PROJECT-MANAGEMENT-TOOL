import React, { useState } from 'react';
import { Project, ReportSummary, PieChartSlice, Task, User } from '../types';
import { DoughnutChart } from '../components/DoughnutChart';
import { ProgressBar } from '../components/ProgressBar';
import { MetricDetailModal, MetricDetailType } from '../components/MetricDetailModal';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface ReportsViewProps {
  projects: Project[];
  summary: ReportSummary;
  pieData: PieChartSlice[];
  tasks?: Task[];
  users?: User[];
  onSelectProject?: (project: Project) => void;
  onSelectTask?: (task: Task) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  projects,
  summary,
  pieData,
  tasks = [],
  users = [],
  onSelectProject,
  onSelectTask,
}) => {
  const [activeMetricDetail, setActiveMetricDetail] = useState<MetricDetailType | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Project Progress &amp; Analytics Reports</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Dynamic metrics derived strictly from live task status data.
          Formula: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-semibold font-mono">(Completed Tasks / Total Tasks) × 100</code>
        </p>
      </div>

      {/* Top Metrics Cards - Untitled UI Style (Clickable to open full details) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Projects */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('total_projects')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs text-left transition-all hover:border-slate-300 hover:shadow-untitledui-sm cursor-pointer group flex flex-col justify-between"
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
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5 group-hover:text-violet-600 transition-colors">
              {summary.totalProjects}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {summary.activeProjects} In Progress · {summary.completedProjects} Closed
            </div>
          </div>
          <div className="text-[11px] text-violet-600 font-semibold mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>View all projects</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Card 2: Total Tasks */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('total_tasks')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs text-left transition-all hover:border-slate-300 hover:shadow-untitledui-sm cursor-pointer group flex flex-col justify-between"
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
            <div className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              {summary.totalTasks}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across All Workspaces</div>
          </div>
          <div className="text-[11px] text-slate-600 font-semibold mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>View all work units</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Card 3: Completed Tasks */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('completed_tasks')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs text-left transition-all hover:border-slate-300 hover:shadow-untitledui-sm cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/70 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              Delivered
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Completed Tasks</div>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 mt-0.5">
              {summary.completedTasks}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Verified Deliverables</div>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>View closed tasks</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Card 4: Overall Completion Rate with Progress Bar right beside it */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('overall_progress')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-untitledui-xs text-left transition-all hover:border-slate-300 hover:shadow-untitledui-sm cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/70 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Rate
            </span>
          </div>
          
          <div className="mt-2.5">
            <div className="text-[11px] font-medium text-indigo-700 uppercase tracking-wider">
              Overall Completion Rate
            </div>
            {/* Percentage and progress bar side-by-side */}
            <div className="flex items-center gap-3 mt-1">
              <div className="text-2xl font-bold tracking-tight text-indigo-600 font-mono shrink-0">
                {summary.overallProgressPercentage}%
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/80">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${summary.overallProgressPercentage}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Calculated Dynamically</div>
          </div>

          <div className="text-[11px] text-indigo-600 font-semibold mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>View progress breakdown</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Dynamic Pie/Doughnut Chart and Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Task Status Proportions</h3>
            <p className="text-xs text-slate-500 mb-4">Live breakdown based on database tasks</p>
          </div>
          <DoughnutChart data={pieData} size={230} strokeWidth={30} />
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 text-center">
            Zero fake numbers · Real dynamic aggregation
          </div>
        </div>

        <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project-by-Project Progress Table</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any project to view full specifications and task allocation</p>
            </div>
            <span className="text-xs text-slate-500">{projects.length} Monitored Projects</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Project Title</th>
                  <th className="py-2.5 px-3 text-center">Tasks</th>
                  <th className="py-2.5 px-3 text-center">Done</th>
                  <th className="py-2.5 px-3 text-center">In Progress</th>
                  <th className="py-2.5 px-3 text-center">Pending</th>
                  <th className="py-2.5 px-3 text-right">Completion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProject && onSelectProject(p)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <span>{p.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-60" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.start_date} → {p.end_date} · {p.status}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{p.total_tasks}</td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-600">
                      {p.completed_tasks}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-blue-600">
                      {p.in_progress_tasks}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-amber-600">
                      {p.pending_tasks}
                    </td>
                    <td className="py-3 px-3 text-right w-44">
                      <ProgressBar
                        percentage={p.progress_percentage}
                        completedTasks={p.completed_tasks}
                        totalTasks={p.total_tasks}
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
