"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
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

export function StatsCard({
  title,
  value,
  suffix = "",
  description,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-secondary",
}: StatsCardProps) {
  // Extract border color from bgColor (e.g., "bg-secondary" -> handled via primary fallback, keep logic for legacy)
  const borderColor = bgColor.includes("secondary") ? "border-l-primary" : bgColor.replace("bg-", "border-l-").replace("-50", "-500");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-card rounded-2xl p-5 sm:p-6 border border-border border-l-4 ${borderColor} shadow-md hover:shadow-lg hover:border-border transition-all group ring-1 ring-foreground/5`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={value} suffix={suffix} />
          </h3>
        </div>
        <div
          className={`p-2.5 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
        >
          <Icon size={22} />
        </div>
      </div>
      <div className="flex items-center text-xs font-medium text-muted-foreground">
        {description}
      </div>
    </motion.div>
  );
}
