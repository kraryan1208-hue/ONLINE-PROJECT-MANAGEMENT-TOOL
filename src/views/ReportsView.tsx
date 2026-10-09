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

      {/* Top Metrics Cards - Clickable to open full details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Projects */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('total_projects')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              Total Projects
            </div>
            <FolderKanban className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{summary.totalProjects}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {summary.activeProjects} In Progress · {summary.completedProjects} Completed
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View all projects</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        {/* Card 2: Total Tasks */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('total_tasks')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
              Total Tasks
            </div>
            <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{summary.totalTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across All Workspaces</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View all work units</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        {/* Card 3: Completed Tasks */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('completed_tasks')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-emerald-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider group-hover:text-emerald-800 transition-colors">
              Completed Tasks
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{summary.completedTasks}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Verified Deliverables</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View closed tasks</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>

        {/* Card 4: Overall Completion Rate with Progress Bar right beside it */}
        <button
          type="button"
          onClick={() => setActiveMetricDetail('overall_progress')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-left transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider group-hover:text-blue-800 transition-colors">
              Overall Completion Rate
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>
          
          {/* Percentage and progress bar side-by-side */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="text-2xl font-bold text-blue-600 font-mono shrink-0">
              {summary.overallProgressPercentage}%
            </div>
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${summary.overallProgressPercentage}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-1">Calculated Dynamically</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View progress breakdown</span>
            <ArrowRight className="w-3 h-3" />
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
