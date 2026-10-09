import React from 'react';
import { Project, Task, User } from '../types';
import {
  X,
  FolderKanban,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface ProjectDetailModalProps {
  isOpen: boolean;
  project: Project | null;
  tasks: Task[];
  users?: User[];
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onSelectTask?: (task: Task) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  project,
  tasks,
  users = [],
  onClose,
  onEdit,
  onSelectTask,
}) => {
  if (!isOpen || !project) return null;

  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const completedCount = projectTasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = projectTasks.filter((t) => t.status === 'In Progress').length;
  const pendingCount = projectTasks.filter((t) => t.status === 'Pending').length;
  const totalTasks = projectTasks.length;

  const calculatedPercentage =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Unique assignees working on this project
  const assigneeIds = Array.from(new Set(projectTasks.map((t) => t.assigned_to).filter(Boolean)));
  const assignedMembers = users.filter((u) => assigneeIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 mt-0.5">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{project.title}</h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                    project.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : project.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : project.status === 'Planning'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Project ID: #{project.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Description &amp; Objective
            </h4>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
              {project.description || 'No description provided.'}
            </div>
          </div>

          {/* Key Metadata Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-slate-400" />
                Project Manager
              </div>
              <div className="text-xs font-bold text-slate-900">
                {project.manager_name || 'Unassigned'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {project.manager_email || 'No email on record'}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Timeline &amp; Deadlines
              </div>
              <div className="text-xs font-bold text-slate-900">
                Due: {project.end_date || 'No deadline'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Start: {project.start_date || 'N/A'}
              </div>
            </div>
          </div>

          {/* Progress & Mathematical Formula Card */}
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Overall Progress</span>
              </div>
              <span className="text-sm font-extrabold text-blue-700">
                {calculatedPercentage}%
              </span>
            </div>

            <ProgressBar
              percentage={calculatedPercentage}
              completedTasks={completedCount}
              totalTasks={totalTasks}
              showLabel={true}
              size="md"
            />

            <div className="text-[11px] text-slate-500 bg-white/70 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
              <span>Formula: (Completed Tasks / Total Tasks) × 100</span>
              <span className="font-semibold text-blue-700">
                ({completedCount} / {totalTasks}) × 100 = {calculatedPercentage}%
              </span>
            </div>
          </div>

          {/* Task Breakdown Chips */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-xs font-bold text-emerald-800">{completedCount}</div>
              <div className="text-[10px] text-emerald-600 font-medium">Completed</div>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-xs font-bold text-blue-800">{inProgressCount}</div>
              <div className="text-[10px] text-blue-600 font-medium">In Progress</div>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-xs font-bold text-amber-800">{pendingCount}</div>
              <div className="text-[10px] text-amber-600 font-medium">Pending</div>
            </div>
          </div>

          {/* Tasks associated with this project */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Associated Work Units ({projectTasks.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {completedCount} closed
              </span>
            </h4>
            {projectTasks.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No tasks currently created under this project.
              </div>
            ) : (
              <div className="space-y-2">
                {projectTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask && onSelectTask(task)}
                    className={`p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs transition-colors ${
                      onSelectTask ? 'cursor-pointer hover:border-blue-400 hover:bg-slate-50/70' : ''
                    }`}
                    title={onSelectTask ? 'Click to inspect task details' : undefined}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{task.title}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                            task.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : task.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Assigned to: <strong className="text-slate-700 font-medium">{task.assignee_name || 'Unassigned'}</strong> · Due {task.deadline}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Real-time project data from database
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit Project
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
