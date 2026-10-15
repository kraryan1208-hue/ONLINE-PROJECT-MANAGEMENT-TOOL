import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  User,
  Shield,
  Briefcase,
  Activity as ActivityIcon,
  LogOut,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'users'
  | 'projects'
  | 'tasks'
  | 'allocations'
  | 'team'
  | 'reports'
  | 'settings'
  | 'profile'
  | 'activity';

interface SidebarProps {
  role: UserRole;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onSelectTab,
  onLogout,
}) => {
  interface NavItem {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
  }

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
          { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
          { id: 'tasks', label: 'Task Management', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'allocations', label: 'Work Allocation & %', icon: <Users className="w-4 h-4" /> },
          { id: 'reports', label: 'Progress Reports', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'activity', label: 'Activity Feed', icon: <ActivityIcon className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'PROJECT_MANAGER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'projects', label: 'My Projects', icon: <FolderKanban className="w-4 h-4" /> },
          { id: 'tasks', label: 'Tasks Management', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'allocations', label: 'Work Allocation & %', icon: <Users className="w-4 h-4" /> },
          { id: 'team', label: 'Team Members', icon: <Users className="w-4 h-4" /> },
          { id: 'reports', label: 'Progress Reports', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'activity', label: 'Activity Feed', icon: <ActivityIcon className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'TEAM_MEMBER':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'tasks', label: 'My Assigned Tasks', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'allocations', label: 'Work Allocation & %', icon: <Users className="w-4 h-4" /> },
          { id: 'projects', label: 'My Projects', icon: <FolderKanban className="w-4 h-4" /> },
          { id: 'activity', label: 'Recent Activity', icon: <ActivityIcon className="w-4 h-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 text-slate-600 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-5">
        {/* Active Role Workspace Card - Untitled UI Style */}
        <div className="px-3.5 py-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-untitledui-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Workspace
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {role === 'ADMIN' && <Shield className="w-4 h-4 text-rose-500 shrink-0" />}
            {role === 'PROJECT_MANAGER' && <Briefcase className="w-4 h-4 text-indigo-500 shrink-0" />}
            {role === 'TEAM_MEMBER' && <User className="w-4 h-4 text-emerald-500 shrink-0" />}
            <span className="text-xs font-semibold text-slate-900 tracking-tight">
              {role === 'ADMIN'
                ? 'Administrator Dashboard'
                : role === 'PROJECT_MANAGER'
                ? 'Project Manager Dashboard'
                : 'Team Member Dashboard'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Role-authorized session</span>
          </div>
        </div>

        <div>
          <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full group flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-700 font-semibold border border-indigo-200/70 shadow-untitledui-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Session Logout - Untitled UI Style */}
      <div className="p-4 border-t border-slate-200/90 bg-slate-50/40">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition-colors border border-transparent hover:border-rose-200/60"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
          <span>Sign Out / Invalidate Session</span>
        </button>
      </div>
    </aside>
  );
};
