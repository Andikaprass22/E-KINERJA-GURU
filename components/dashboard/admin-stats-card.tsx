"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = Math.min(value, increment * step);
      setDisplayValue(parseFloat(current.toFixed(2)));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isInView]);

  const formattedValue = Number.isInteger(value)
    ? Math.round(displayValue).toString()
    : displayValue.toFixed(2);

  return (
    <span ref={ref}>
      {formattedValue}{suffix}
    </span>
  );
}

export function AdminStatsCard({
  title,
  value,
  suffix = "",
  subtitle,
  icon: Icon,
  color,
  bgColor,
}: AdminStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1.5">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            <AnimatedNumber value={value} suffix={suffix} />
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} group-hover:scale-110 transition-transform`}>
          <Icon size={24} className={color} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
        <span>{subtitle}</span>
      </div>
    </motion.div>
  );
}
