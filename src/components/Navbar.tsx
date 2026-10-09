import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { useTheme } from '../context/ThemeContext';
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
  Sun,
  Moon,
  Palette,
  Check,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  tasksCount?: number;
  onLogout: () => void;
  onQuickSwitchRole?: (role: UserRole) => void;
  onOpenActivities: () => void;
  onNavigateToTasks?: (subTab?: 'overview' | 'create' | 'manage' | 'edit' | 'total') => void;
  onCreateTaskQuick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  tasksCount = 10,
  onLogout,
  onQuickSwitchRole,
  onOpenActivities,
  onNavigateToTasks,
  onCreateTaskQuick,
}) => {
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const taskMenuRef = useRef<HTMLDivElement>(null);

  const { mode, activePresetId, toggleMode, selectPreset, presets } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (taskMenuRef.current && !taskMenuRef.current.contains(event.target as Node)) {
        setTaskMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3.5 h-3.5" />
            Administrator
          </span>
        );
      case 'PROJECT_MANAGER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Briefcase className="w-3.5 h-3.5" />
            Project Manager
          </span>
        );
      case 'TEAM_MEMBER':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserIcon className="w-3.5 h-3.5" />
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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Task Management System in Task Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            O
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Online Project Management Tool
            </h1>
          </div>
        </div>

        {/* Task Management System Menu in Task Bar */}
        <div className="relative" ref={taskMenuRef}>
          <button
            type="button"
            onClick={() => setTaskMenuOpen(!taskMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors shadow-2xs"
            title="Task Management System Menu"
          >
            <CheckSquare className="w-4 h-4 text-blue-600" />
            <span>Task Management System</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-blue-600 text-white rounded-full font-mono">
              {tasksCount}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${taskMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown with Create, Add, Manage, Overview, Edit, Total Tasks */}
          {taskMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Task Management Controls
              </div>

              <button
                type="button"
                onClick={() => handleTaskAction('overview')}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Task Overview</div>
                  <div className="text-[11px] text-slate-500">Summary, completion rate &amp; graphs</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTaskAction('create')}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Create &amp; Add Task</div>
                  <div className="text-[11px] text-slate-500">Assign new work unit to member</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTaskAction('manage')}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Manage Tasks</div>
                  <div className="text-[11px] text-slate-500">Search, filter &amp; update statuses</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTaskAction('edit')}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Edit2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Edit Task</div>
                  <div className="text-[11px] text-slate-500">Modify deadlines, priority &amp; assignees</div>
                </div>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                onClick={() => handleTaskAction('total')}
                className="w-full px-3 py-2 text-left hover:bg-blue-50/60 flex items-center justify-between text-xs text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Total Tasks</div>
                    <div className="text-[11px] text-slate-500">View complete task list &amp; details</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full text-xs">
                  {tasksCount}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Quick Role Switcher, Activity Feed, User & Logout */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Role Switcher */}
        {onQuickSwitchRole && (
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <span className="text-[11px] font-medium text-slate-500 px-1.5">Switch:</span>
            <button
              onClick={() => onQuickSwitchRole('ADMIN')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                currentUser.role === 'ADMIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => onQuickSwitchRole('PROJECT_MANAGER')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                currentUser.role === 'PROJECT_MANAGER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => onQuickSwitchRole('TEAM_MEMBER')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                currentUser.role === 'TEAM_MEMBER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Member
            </button>
          </div>
        )}

        {/* Theme Switcher & Palette Selector */}
        <div className="relative" ref={themeMenuRef}>
          <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-lg p-0.5">
            {/* Quick Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleMode}
              className={`p-1.5 rounded-md transition-all ${
                mode === 'dark'
                  ? 'bg-slate-800 text-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 shadow-xs'
              }`}
              title={mode === 'dark' ? 'Click to switch to Light Mode' : 'Click to switch to Dark Mode'}
              aria-label="Toggle dark/light theme"
            >
              {mode === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>

            {/* Themes Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              title="Change Theme Palette"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Theme</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Theme Selector Dropdown Menu */}
          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2.5 py-1.5 mb-1.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    Theme Presets
                  </div>
                  <div className="text-[11px] text-slate-500">Choose your visual appearance</div>
                </div>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>

              <div className="space-y-1 max-h-80 overflow-y-auto">
                {presets.map((preset) => {
                  const isSelected = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        selectPreset(preset.id);
                        setThemeMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 text-left rounded-lg flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 text-blue-900 font-semibold border border-blue-200/80'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {preset.name}
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-normal uppercase ${
                                preset.mode === 'dark'
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {preset.mode}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{preset.description}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Activity Bell */}
        <button
          onClick={onOpenActivities}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="View Recent Activity Feed"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="h-5 w-px bg-slate-200"></div>

        {/* Current User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{currentUser.email}</div>
          </div>
          {roleBadge()}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
          title="Sign Out and Destroy Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
