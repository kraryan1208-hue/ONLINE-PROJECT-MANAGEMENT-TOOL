import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart as PieIcon } from 'lucide-react';

/* ==========================================================================
   1. UNTITLED UI DONUT / PIE CHART COMPONENT
   ========================================================================== */

export interface PieChartItem {
  name: string;
  value: number;
  color: string;
}

interface InteractivePieChartProps {
  title?: string;
  subtitle?: string;
  data: PieChartItem[];
  centerLabel?: string;
  size?: number;
}

export const InteractivePieChart: React.FC<InteractivePieChartProps> = ({
  title,
  subtitle,
  data,
  centerLabel = 'Total Tasks',
  size = 200,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const strokeWidth = 26;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-untitledui-xs flex flex-col justify-between">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {total} units
          </span>
        </div>
      )}

      {/* SVG Donut */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {/* Background base track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#F2F4F7"
              strokeWidth={strokeWidth}
            />
            {total === 0 ? (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#E4E7EC"
                strokeWidth={strokeWidth}
              />
            ) : (
              data.map((slice, index) => {
                if (slice.value === 0) return null;
                const slicePercent = slice.value / total;
                const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedPercent * circumference;
                accumulatedPercent += slicePercent;
                const isHovered = hoveredIdx === index;

                return (
                  <circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })
            )}
          </svg>

          {/* Central Callout Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {hoveredIdx !== null ? data[hoveredIdx].value : total}
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              {hoveredIdx !== null ? data[hoveredIdx].name : centerLabel}
            </span>
            {hoveredIdx !== null && total > 0 && (
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full mt-0.5">
                {Math.round((data[hoveredIdx].value / total) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modern Legend Tags */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
        {data.map((slice, idx) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                isHovered
                  ? 'bg-slate-50 border-slate-300 shadow-untitledui-xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></span>
                <span className="text-[11px] font-medium text-slate-600 truncate">{slice.name}</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{slice.value}</div>
              <div className="text-[10px] text-slate-400 font-medium">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================================================
   2. UNTITLED UI BAR GRAPH COMPONENT (Task Velocity & Project Deliverables)
   ========================================================================== */

export interface BarGraphItem {
  label: string;
  completed: number;
  pendingOrTotal: number;
  rate?: number;
}

interface InteractiveBarGraphProps {
  title: string;
  subtitle?: string;
  data: BarGraphItem[];
}

export const InteractiveBarGraph: React.FC<InteractiveBarGraphProps> = ({
  title,
  subtitle,
  data,
}) => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const maxVal = Math.max(...data.map((d) => Math.max(d.completed, d.pendingOrTotal)), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-untitledui-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-600 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-200"></span>
            <span>Total Assigned</span>
          </div>
        </div>
      </div>

      {/* SVG / HTML Bar Chart */}
      <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-200 relative">
        {/* Background Grid Lines */}
        <div className="absolute inset-x-2 inset-y-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200"></div>
          <div className="border-b border-dashed border-slate-200"></div>
          <div className="border-b border-dashed border-slate-200"></div>
          <div className="border-b border-dashed border-slate-200"></div>
        </div>

        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            No active project data to visualize.
          </div>
        ) : (
          data.map((item, idx) => {
            const completedHeight = Math.round((item.completed / maxVal) * 100);
            const totalHeight = Math.round((item.pendingOrTotal / maxVal) * 100);
            const isHovered = activeBar === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveBar(idx)}
                onMouseLeave={() => setActiveBar(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Hover Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-untitledui-md whitespace-nowrap pointer-events-none animate-in fade-in duration-100">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-slate-300 text-[10px]">
                      {item.completed} / {item.pendingOrTotal} tasks ({item.rate ?? 0}%)
                    </div>
                  </div>
                )}

                {/* Bars Group */}
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Total Bar */}
                  <div
                    style={{ height: `${Math.max(totalHeight, 6)}%` }}
                    className="w-3.5 sm:w-5 bg-slate-200 group-hover:bg-slate-300 rounded-t-md transition-all duration-300"
                  />
                  {/* Completed Bar */}
                  <div
                    style={{ height: `${Math.max(completedHeight, 4)}%` }}
                    className="w-3.5 sm:w-5 bg-indigo-600 group-hover:bg-indigo-700 rounded-t-md transition-all duration-300 shadow-untitledui-xs"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* X-Axis Labels */}
      <div className="flex items-center gap-3 px-2 pt-2 text-[11px] text-slate-500 font-medium">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center truncate" title={item.label}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   3. UNTITLED UI PERFORMANCE / VELOCITY AREA GRAPH
   ========================================================================== */

interface VelocityGraphProps {
  title: string;
  subtitle?: string;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
}

export const VelocityGraph: React.FC<VelocityGraphProps> = ({
  title,
  subtitle,
  completionRate,
  totalTasks,
  completedTasks,
}) => {
  // SVG Area path coordinates for 5 simulated milestones/sprints
  const points = [
    { x: 0, y: 80, label: 'Sprint 1' },
    { x: 60, y: 65, label: 'Sprint 2' },
    { x: 120, y: 45, label: 'Sprint 3' },
    { x: 180, y: Math.max(85 - completionRate * 0.7, 10), label: 'Current' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-untitledui-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{completionRate}% Delivered</span>
        </div>
      </div>

      <div className="my-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-slate-900">{completedTasks}</span>
          <span className="text-xs font-medium text-slate-500">of {totalTasks} work deliverables closed</span>
        </div>
      </div>

      {/* SVG Trendline with Gradient */}
      <div className="h-28 w-full relative">
        <svg viewBox="0 0 200 90" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Fill Area */}
          <polygon
            points={`0,90 ${points.map((p) => `${p.x},${p.y}`).join(' ')} 200,${points[points.length - 1].y} 200,90`}
            fill="url(#velocityGradient)"
          />
          {/* Smooth Line */}
          <polyline
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={`${points.map((p) => `${p.x},${p.y}`).join(' ')} 200,${points[points.length - 1].y}`}
          />
          {/* Data Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#FFFFFF"
              stroke="#4F46E5"
              strokeWidth="2.5"
              className="hover:r-6 transition-all cursor-pointer"
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
        <span>Sprint Inception</span>
        <span>Mid-Project Review</span>
        <span>Final Deliverables</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   4. UNIFIED DASHBOARD CHARTS SECTION (Pi Charts + Graphs side-by-side)
   ========================================================================== */

interface DashboardChartsSectionProps {
  statusData: PieChartItem[];
  priorityData: PieChartItem[];
  barData: BarGraphItem[];
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
}

export const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = ({
  statusData,
  priorityData,
  barData,
  completionRate,
  totalTasks,
  completedTasks,
}) => {
  const [pieMode, setPieMode] = useState<'status' | 'priority'>('status');
  const [graphMode, setGraphMode] = useState<'velocity' | 'bars'>('velocity');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. PIE / DONUT CHART CARD */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-untitledui-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Task Distribution Matrix</h3>
              <p className="text-xs text-slate-500">Live breakdown calculated from active database records</p>
            </div>
          </div>

          {/* Toggle Button for Status vs Priority */}
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold border border-slate-200/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPieMode('status')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                pieMode === 'status'
                  ? 'bg-white text-slate-900 shadow-untitledui-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Status
            </button>
            <button
              type="button"
              onClick={() => setPieMode('priority')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                pieMode === 'priority'
                  ? 'bg-white text-slate-900 shadow-untitledui-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Priority
            </button>
          </div>
        </div>

        {/* The Pi Chart */}
        <InteractivePieChart
          data={pieMode === 'status' ? statusData : priorityData}
          centerLabel={pieMode === 'status' ? 'Total Tasks' : 'Priority Units'}
          size={190}
        />
      </div>

      {/* 2. TREND & VELOCITY GRAPH CARD */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-untitledui-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Project Velocity &amp; Analytics</h3>
              <p className="text-xs text-slate-500">Continuous sprint trajectory &amp; delivery completion</p>
            </div>
          </div>

          {/* Toggle Button for Area Velocity Graph vs Bar Graph */}
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold border border-slate-200/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setGraphMode('velocity')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                graphMode === 'velocity'
                  ? 'bg-white text-slate-900 shadow-untitledui-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Velocity Area
            </button>
            <button
              type="button"
              onClick={() => setGraphMode('bars')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                graphMode === 'bars'
                  ? 'bg-white text-slate-900 shadow-untitledui-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Project Bars
            </button>
          </div>
        </div>

        {/* The Graph */}
        {graphMode === 'velocity' ? (
          <VelocityGraph
            title="Sprint Trajectory"
            completionRate={completionRate}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
          />
        ) : (
          <InteractiveBarGraph
            title="Workload Distribution by Project"
            subtitle="Completed vs Total assigned tasks per project"
            data={barData}
          />
        )}
      </div>
    </div>
  );
};

