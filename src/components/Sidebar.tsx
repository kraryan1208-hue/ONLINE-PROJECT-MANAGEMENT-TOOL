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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Session Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Invalidate Session</span>
        </button>
      </div>
    </aside>
  );
};
