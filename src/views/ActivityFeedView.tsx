import React from 'react';
import { Activity } from '../types';
import { Clock, Shield, Briefcase, User as UserIcon, Activity as ActivityIcon } from 'lucide-react';

interface ActivityFeedViewProps {
  activities: Activity[];
}

export const ActivityFeedView: React.FC<ActivityFeedViewProps> = ({ activities }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-rose-600" />;
      case 'PROJECT_MANAGER':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <UserIcon className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Recent Activity Feed &amp; Audit Trail</h2>
        <p className="text-xs text-slate-500">
          Chronological event stream recorded via asynchronous background threads and Servlet filters.
        </p>
      </div>

      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">No activity recorded yet.</div>
        ) : (
          <div className="relative border-l border-slate-200 ml-3 space-y-6">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-6">
                {/* Timeline Bullet */}
                <span className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-100">{getRoleIcon(act.user_role)}</span>
                    <span className="font-bold text-slate-900 text-xs">{act.user_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({act.user_role})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{act.created_at}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {act.activity}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
