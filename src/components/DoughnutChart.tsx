import React from 'react';

interface DoughnutSlice {
  name: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  data: DoughnutSlice[];
  size?: number;
  strokeWidth?: number;
  title?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  size = 220,
  strokeWidth = 28,
  title,
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      {title && <h4 className="text-sm font-semibold text-slate-800 mb-3">{title}</h4>}
      
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Base Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {total === 0 ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
            />
          ) : (
            data.map((slice, index) => {
              if (slice.value === 0) return null;
              const slicePercent = slice.value / total;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += slicePercent;

              return (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })
          )}
        </svg>

        {/* Center Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{total}</span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Tasks</span>
        </div>
      </div>

      {/* Legend with Dynamic Percentages */}
      <div className="grid grid-cols-3 gap-3 mt-4 w-full text-center">
        {data.map((slice, idx) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <div key={idx} className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }}></span>
                <span className="text-xs font-medium text-slate-600">{slice.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{slice.value}</span>
              <span className="text-[10px] text-slate-400 font-medium">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
