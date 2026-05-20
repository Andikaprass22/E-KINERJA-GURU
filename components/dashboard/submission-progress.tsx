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
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Progress Pengumpulan Dokumen</span>
        <span className="text-muted-foreground">
          {completed} dari {total} dokumen terkumpul
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground text-right">{percentage}%</p>
    </motion.div>
  );
}
