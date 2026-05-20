"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SubmissionChartProps {
  data: { name: string; completed: number; total: number }[];
}

const getBarColor = (percentage: number) => {
  if (percentage >= 80) return "#22c55e";
  if (percentage >= 50) return "#f59e0b";
  return "#ef4444";
};

export function SubmissionChart({ data }: SubmissionChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
        Belum ada data submission
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 10 }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Kelengkapan"]}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
