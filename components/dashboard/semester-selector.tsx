"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
}

interface SemesterSelectorProps {
  value: string;
  onChange: (semesterId: string) => void;
}

export function SemesterSelector({ value, onChange }: SemesterSelectorProps) {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSemesters = useCallback(async () => {
    try {
      const res = await fetch("/api/semesters");
      const data = await res.json();
      setSemesters(data);

      if (!value && data.length > 0) {
        const active = data.find((s: Semester) => s.isActive);
        if (active) {
          onChange(active.id);
        }
      }
    } catch (error) {
      console.error("Failed to load semesters:", error);
    } finally {
      setIsLoading(false);
    }
  }, [value, onChange]);

  useEffect(() => {
    loadSemesters();
  }, [loadSemesters]);

  const selected = semesters.find((s) => s.id === value);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto animate-pulse">
        <div className="w-4 h-4 bg-slate-200 rounded" />
        <div className="w-32 h-4 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex justify-between items-center w-full sm:w-auto gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow transition-all group">
          <div className="flex items-center gap-2">
            <Calendar
              size={18}
              className="text-indigo-500 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-semibold text-slate-700">
              {selected?.name || "Pilih Semester"}
            </span>
            {selected?.isActive && (
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                Aktif
              </span>
            )}
          </div>
          <ChevronDown
            size={16}
            className="text-slate-400 group-hover:text-slate-600"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {semesters.map((semester) => (
          <DropdownMenuItem
            key={semester.id}
            onClick={() => onChange(semester.id)}
            className={semester.id === value ? "bg-indigo-50 text-indigo-700" : ""}
          >
            <span className="text-sm font-medium">{semester.name}</span>
            {semester.isActive && (
              <span className="ml-auto text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                Aktif
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
