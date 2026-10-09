import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  completedTasks?: number;
  totalTasks?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  size = 'md',
  className = '',
  completedTasks,
  totalTasks,
}) => {
  // Clamp between 0 and 100
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  // Dynamic color coding based on progress
  let barColor = 'bg-blue-600';
  if (clamped >= 100) {
    barColor = 'bg-emerald-600';
  } else if (clamped >= 60) {
    barColor = 'bg-indigo-600';
  } else if (clamped >= 25) {
    barColor = 'bg-blue-600';
  } else {
    barColor = 'bg-amber-500';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="font-medium text-slate-700">
            {completedTasks !== undefined && totalTasks !== undefined ? (
              <span>{completedTasks} of {totalTasks} tasks complete</span>
            ) : (
              <span>Progress</span>
            )}
          </span>
          <span className="font-bold text-slate-900">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
