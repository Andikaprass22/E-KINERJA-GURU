"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { EvaluationCategory } from "@/lib/types";

interface CategoryChartProps {
  distribution: Record<EvaluationCategory, number>;
}

const COLORS: Record<EvaluationCategory, string> = {
  A: "#10b981",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#ef4444",
};

const LABELS: Record<EvaluationCategory, string> = {
  A: "Sangat Baik",
  B: "Baik",
  C: "Cukup",
  D: "Kurang",
};

export function CategoryChart({ distribution }: CategoryChartProps) {
  const data = (Object.entries(distribution) as [EvaluationCategory, number][])
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: `${key} - ${LABELS[key]}`,
      value,
      color: COLORS[key],
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
        Belum ada data evaluasi
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} guru`, "Jumlah"]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span className="text-xs text-slate-600">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
