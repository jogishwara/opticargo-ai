import React, { useState } from "react";

// =====================================================
// TYPES
// =====================================================

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

const PALETTE = ["#6366f1", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#ec4899"];

// =====================================================
// DONUT CHART
// =====================================================

interface DonutChartProps {
  data: ChartSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  formatValue?: (v: number) => string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 220,
  thickness = 28,
  centerLabel = "Total",
  formatValue = (v) => Math.round(v).toLocaleString("id-ID"),
}) => {
  const [active, setActive] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let acc = 0;
  const segments = data.map((d) => {
    const frac = d.value / total;
    const seg = { ...d, frac, start: acc, dash: frac * circumference };
    acc += frac * circumference;
    return seg;
  });

  const activeSeg = active !== null ? segments[active] : null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full">
      {/* SVG donut + center label */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={thickness}
          />
          {segments.map((s, i) => (
            <circle
              key={i}
              id={`donut-seg-${i}`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={active === i ? thickness + 4 : thickness}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.start}
              opacity={active === null || active === i ? 1 : 0.3}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(i)}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            {activeSeg ? activeSeg.label : centerLabel}
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white leading-tight mt-0.5">
            {activeSeg
              ? `${Math.round(activeSeg.frac * 100)}%`
              : formatValue(total)}
          </span>
          {activeSeg && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Rp{formatValue(activeSeg.value)}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2 flex-1 min-w-0">
        {segments.map((s, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
            className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs transition-all duration-200 text-left ${
              active === i
                ? "bg-slate-100 dark:bg-slate-800 border-indigo-300 dark:border-indigo-700 shadow-sm"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                style={{ background: s.color }}
              />
              <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
                {s.label}
              </span>
            </span>
            <span className="flex items-center gap-2 shrink-0">
              <span className="font-extrabold text-slate-900 dark:text-white">
                Rp{formatValue(s.value)}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-8 text-right">
                {Math.round(s.frac * 100)}%
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// VERTICAL BAR CHART (SANGAT SOLID, PROFESIONAL & INTERAKTIF)
// =====================================================

interface BarChartProps {
  data: BarDatum[];
  height?: number;
  formatValue?: (v: number) => string;
  highlightIndex?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 240,
  formatValue = (v) => Math.round(v).toLocaleString("id-ID"),
  highlightIndex,
}) => {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex flex-col justify-end pt-6">
      {/* Chart Canvas */}
      <div className="relative w-full" style={{ height: height }}>
        
        {/* Background Grid Lines & Y-Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {[1, 0.75, 0.5, 0.25, 0].map((step, idx) => (
            <div key={idx} className="w-full flex items-center gap-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold w-12 text-right shrink-0">
                {step > 0 ? `${(Math.round(max * step) / 1000000).toFixed(1)}M` : '0'}
              </span>
              <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-800" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 left-14 right-2 bottom-6 flex items-end justify-between gap-2 sm:gap-4">
          {data.map((d, i) => {
            const pct = Math.max(8, (d.value / max) * 100);
            const color = d.color || PALETTE[i % PALETTE.length];
            const isActive = active === i;
            const isHighlight = highlightIndex === i;

            return (
              <div
                key={i}
                className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Floating Tooltip on Hover */}
                <div
                  className={`absolute -top-10 z-30 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 pointer-events-none transition-all duration-200 whitespace-nowrap ${
                    isActive ? "opacity-100 scale-100 -translate-y-1" : "opacity-0 scale-95 translate-y-0"
                  }`}
                >
                  {formatValue(d.value)}
                  <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-r border-b border-slate-700 rotate-45" />
                </div>

                {/* Actual Bar Graphic */}
                <div
                  className="w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative overflow-hidden"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: color,
                    opacity: active === null || isActive ? 1 : 0.4,
                    boxShadow: isActive || isHighlight ? `0 10px 25px -5px ${color}88` : 'none',
                    transform: isActive ? 'scaleY(1.02)' : 'none',
                    transformOrigin: 'bottom'
                  }}
                >
                  {/* Highlight gradient shine */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20" />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 left-14 right-2 flex justify-between gap-2 sm:gap-4 h-6 items-center">
          {data.map((d, i) => (
            <div key={i} className="flex-1 text-center truncate">
              <span
                className={`text-[11px] font-bold transition-colors ${
                  active === i
                    ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {d.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// =====================================================
// GAUGE CHART (Setengah Lingkaran)
// =====================================================

interface GaugeChartProps {
  value: number; // 0 - 100
  label?: string;
  size?: number;
  color?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label = "Skor Kesehatan",
  size = 180,
  color = "#6366f1",
}) => {
  const p = Math.max(0, Math.min(100, value));
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const semi = Math.PI * radius;
  const progress = (p / 100) * semi;

  const arcPath = (endP: number) => {
    const theta = Math.PI + endP * Math.PI;
    const x = cx + radius * Math.cos(theta);
    const y = cy + radius * Math.sin(theta);
    const largeArc = endP > 0.5 ? 1 : 0;
    return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} className="overflow-visible">
        <path
          d={arcPath(1)}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={arcPath(1)}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={semi}
          strokeDashoffset={semi - progress}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fill="currentColor"
          className="text-slate-900 dark:text-white"
        >
          {Math.round(p)}
        </text>
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="currentColor"
          className="text-slate-500 dark:text-slate-400"
        >
          / 100
        </text>
      </svg>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 -mt-1 text-center">
        {label}
      </p>
    </div>
  );
};

// =====================================================
// STATIC HELPER
// =====================================================

export function buildCostSegments(total: number): ChartSegment[] {
  const fuel = Math.round(total * 0.38);
  const maintenance = Math.round(total * 0.22);
  const capacity = Math.max(0, total - fuel - maintenance);

  return [
    { label: "BBM & Overlap Rute", value: fuel, color: "#ef4444" },
    { label: "Pemeliharaan & Idle", value: maintenance, color: "#f59e0b" },
    { label: "Kapasitas Terbuang", value: capacity, color: "#6366f1" },
  ];
}
