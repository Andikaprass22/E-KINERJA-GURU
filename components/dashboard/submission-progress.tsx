"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SubmissionProgressProps {
  completed: number;
  total: number;
}

export function SubmissionProgress({ completed, total }: SubmissionProgressProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="font-bold text-slate-900">Progress Pengumpulan Dokumen</span>
        <span className="text-slate-500 font-medium">
          {completed} dari {total} dokumen terkumpul
        </span>
      </div>
      <Progress value={percentage} className="h-2.5 rounded-full" />
      <p className="text-xs text-slate-500 font-medium text-right mt-2">{percentage}%</p>
    </motion.div>
  );
}
