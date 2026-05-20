"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Memuat semester..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Pilih semester" />
      </SelectTrigger>
      <SelectContent>
        {semesters.map((semester) => (
          <SelectItem key={semester.id} value={semester.id}>
            {semester.name}
            {semester.isActive && " (Aktif)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
