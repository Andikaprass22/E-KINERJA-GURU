"use client";

import type { EvaluationCategory } from "@/lib/types";

interface AdminDonutChartProps {
  distribution: Record<EvaluationCategory, number>;
  total: number;
}

const COLORS: Record<EvaluationCategory, string> = {
  A: "#10B981",
  B: "#3B82F6",
  C: "#F59E0B",
  D: "#EF4444",
};

const LABELS: Record<EvaluationCategory, string> = {
  A: "Sangat Baik",
  B: "Baik",
  C: "Cukup",
  D: "Kurang",
};

export function AdminDonutChart({ distribution, total }: AdminDonutChartProps) {
  const entries = (Object.entries(distribution) as [EvaluationCategory, number][])
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  if (total === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-2">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <span className="text-sm text-slate-400">Belum ada data</span>
        </div>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 15.91549431;
  let accumulatedOffset = 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-2">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
          <circle
            cx="21" cy="21" r="15.91549431"
            fill="transparent" stroke="#F8FAFC" strokeWidth="3.5"
          />
          {entries.map(([cat, count]) => {
            const percentage = count / total;
            const dashArray = `${percentage * 100} ${100 - percentage * 100}`;
            const offset = accumulatedOffset;
            accumulatedOffset -= percentage * 100;

            return (
              <circle
                key={cat}
                cx="21" cy="21" r="15.91549431"
                fill="transparent"
                stroke={COLORS[cat]}
                strokeWidth="3.5"
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-800 tracking-tight">{total}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 sm:gap-6 mt-8 w-full flex-wrap">
        {entries.map(([cat]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="relative">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[cat] }}
              />
              <div
                className="absolute inset-[-4px] rounded-full opacity-20"
                style={{ backgroundColor: COLORS[cat] }}
              />
            </div>
            <span className="text-xs text-slate-600 font-medium">
              {cat} - {LABELS[cat]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
