import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import {
  LogOut,
  Shield,
  Briefcase,
  User as UserIcon,
  Bell,
  CheckSquare,
  Plus,
  Filter,
  BarChart3,
  Edit2,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  tasksCount?: number;
  onLogout: () => void;
  onOpenActivities: () => void;
  onNavigateToTasks?: (subTab?: 'overview' | 'create' | 'manage' | 'edit' | 'total') => void;
  onCreateTaskQuick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  tasksCount = 10,
  onLogout,
  onOpenActivities,
  onNavigateToTasks,
  onCreateTaskQuick,
}) => {
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const taskMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (taskMenuRef.current && !taskMenuRef.current.contains(event.target as Node)) {
        setTaskMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const roleBadge = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 shadow-untitledui-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Administrator
          </span>
        );
      case 'PROJECT_MANAGER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-untitledui-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Project Manager
          </span>
        );
      case 'TEAM_MEMBER':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-untitledui-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Team Member
          </span>
        );
    }
  };

  const handleTaskAction = (subTab: 'overview' | 'create' | 'manage' | 'edit' | 'total') => {
    setTaskMenuOpen(false);
    if (subTab === 'create' && onCreateTaskQuick) {
      onCreateTaskQuick();
    } else if (onNavigateToTasks) {
      onNavigateToTasks(subTab);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-untitledui-xs">
      {/* Brand & Task Management System in Task Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-untitledui-xs border border-indigo-500/20">
            O
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight tracking-tight">
              Online Project Management Tool
            </h1>
            <p className="text-[11px] text-slate-500">Collaborative Workspace</p>
          </div>
        </div>

        {/* Task Management System Menu in Task Bar - Untitled UI Action Button */}
        <div className="relative" ref={taskMenuRef}>
          <button
            type="button"
            onClick={() => setTaskMenuOpen(!taskMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 shadow-untitledui-xs transition-all"
            title="Task Management System Menu"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-800">Task Actions</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-mono font-medium">
              {tasksCount}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${taskMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown with Create, Add, Manage, Overview, Edit, Total Tasks */}
          {taskMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-untitledui-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Task Management Controls
              </div>

              <button
                type="button"
                onClick={() => handleTaskAction('overview')}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Task Overview</div>
                  <div className="text-[11px] text-slate-500">Summary, completion rate &amp; graphs</div>
                </div>
              </button>

              {/* Create and Edit only available for Admin and Manager */}
              {currentUser.role !== 'TEAM_MEMBER' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleTaskAction('create')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Create &amp; Add Task</div>
                      <div className="text-[11px] text-slate-500">Assign new work unit to member</div>
                    </div>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => handleTaskAction('manage')}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Manage Tasks</div>
                  <div className="text-[11px] text-slate-500">Search, filter &amp; update statuses</div>
                </div>
              </button>

              {currentUser.role !== 'TEAM_MEMBER' && (
                <button
                  type="button"
                  onClick={() => handleTaskAction('edit')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <Edit2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Edit Task</div>
                    <div className="text-[11px] text-slate-500">Modify deadlines, priority &amp; assignees</div>
                  </div>
                </button>
              )}

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                onClick={() => handleTaskAction('total')}
                className="w-full px-3 py-2 text-left hover:bg-indigo-50/50 flex items-center justify-between text-xs text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Total Tasks</div>
                    <div className="text-[11px] text-slate-500">View complete task list &amp; details</div>
                  </div>
                </div>
                <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full text-xs">
                  {tasksCount}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Activity Feed, User Info & Logout - Untitled UI Style */}
      <div className="flex items-center gap-3">
        {/* Activity Bell */}
        <button
          onClick={onOpenActivities}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors relative border border-slate-200 shadow-untitledui-xs bg-white"
          title="View Recent Activity Feed"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>

        <div className="h-5 w-px bg-slate-200"></div>

        {/* Current User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar with initial */}
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-xs flex items-center justify-center shadow-untitledui-xs">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{currentUser.email}</div>
          </div>
          {roleBadge()}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 hover:border-rose-200 bg-white shadow-untitledui-xs"
          title="Sign Out and Destroy Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
