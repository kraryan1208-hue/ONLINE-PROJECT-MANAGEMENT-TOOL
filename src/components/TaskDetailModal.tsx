import React from 'react';
import { Task, Project, User } from '../types';
import {
  X,
  CheckSquare,
  FolderKanban,
  User as UserIcon,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Shield,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  project?: Project;
  assignee?: User;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onUpdateStatus?: (taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => void;
  canEdit?: boolean;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  task,
  onClose,
  project,
  assignee,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  canEdit = true,
}) => {
  if (!isOpen || !task) return null;

  // Deadline calculation
  const deadlineDate = new Date(task.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0 && task.status !== 'Completed';

  const priorityColor = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-slate-50 text-slate-700 border-slate-200',
  }[task.priority] || 'bg-slate-50 text-slate-700 border-slate-200';

  const statusColor = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  }[task.status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold text-slate-400">TASK #{task.id}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor}`}>
                  {task.priority} Priority
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
                  {task.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                {task.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Task Description & Objectives
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
              {task.description}
            </div>
          </div>

          {/* Quick Status Transition Buttons */}
          {onUpdateStatus && (
            <div className="p-4 bg-blue-50/60 border border-blue-150 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Update Task Status:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['Pending', 'In Progress', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateStatus(task.id, st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      task.status === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st === 'Completed' && '✓ '}
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Associated Project Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <FolderKanban className="w-4 h-4 text-blue-600" />
                <span>Associated Project</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {task.project_title || (project ? project.title : `Project #${task.project_id}`)}
              </div>
              {project && (
                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <div>Timeline: <span className="font-semibold text-slate-700">{project.start_date} → {project.end_date}</span></div>
                  <div>Status: <span className="font-semibold text-slate-700">{project.status}</span></div>
                  <div>Progress: <span className="font-semibold text-blue-600">{project.progress_percentage}%</span></div>
                </div>
              )}
            </div>

            {/* Assigned Team Member Information */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span>Assigned Team Member</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {task.assignee_name || (assignee ? assignee.name : 'Unassigned')}
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                <div>Email: <span className="font-semibold text-slate-700">{task.assignee_email || (assignee ? assignee.email : 'N/A')}</span></div>
                <div>User ID: <span className="font-mono text-slate-700">#{task.assigned_to || 'None'}</span></div>
              </div>
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-400 font-medium">Due Date</div>
              <div className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{task.deadline}</span>
              </div>
              <div className="text-[11px] mt-1">
                {task.status === 'Completed' ? (
                  <span className="text-emerald-600 font-semibold">Completed on time</span>
                ) : isOverdue ? (
                  <span className="text-rose-600 font-semibold">Overdue by {Math.abs(diffDays)} days</span>
                ) : (
                  <span className="text-slate-500">{diffDays} days remaining</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-400 font-medium">Created On</div>
              <div className="text-xs font-semibold text-slate-800 mt-1 font-mono">
                {task.created_at || 'Recorded'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-400 font-medium">Last Updated</div>
              <div className="text-xs font-semibold text-slate-800 mt-1 font-mono">
                {task.updated_at || task.created_at || 'Recent'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {canEdit && onEditTask && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditTask(task);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-200 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Task</span>
              </button>
            )}

            {canEdit && onDeleteTask && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteTask(task.id);
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
