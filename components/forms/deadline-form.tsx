"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DocumentType } from "@/lib/types";
import { DocumentTypeLabel } from "@/lib/types";

interface DeadlineFormProps {
  semesterId: string;
  existingDeadlines?: {
    documentType: string;
    deadline: Date;
  }[];
}

export function DeadlineForm({ semesterId, existingDeadlines }: DeadlineFormProps) {
  const initialDeadlines: Record<string, Date> = {};
  if (existingDeadlines) {
    existingDeadlines.forEach((d) => {
      initialDeadlines[d.documentType] = d.deadline;
    });
  }
  const [deadlines, setDeadlines] = useState<Record<string, Date>>(initialDeadlines);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const documentTypes: DocumentType[] = [
    "RPP",
    "SYLLABUS",
    "LEARNING_ACHIEVEMENT",
    "TIME_ALLOCATION",
    "KKTP",
    "SEMESTER_PROGRAM",
    "ANNUAL_PROGRAM",
    "TEACHING_JOURNAL",
  ];

  const handleDateSelect = (documentType: string, date: Date | undefined) => {
    if (date) {
      setDeadlines((prev) => ({
        ...prev,
        [documentType]: date,
      }));
      setOpenPopover(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/semesters/update-deadline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semesterId, deadlines }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal menyimpan deadline");
        setIsSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Save deadline error:", err);
      setError("Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {documentTypes.map((type) => (
          <div key={type} className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">
              {DocumentTypeLabel[type]}
            </Label>
            <Popover open={openPopover === type} onOpenChange={(open) => setOpenPopover(open ? type : null)}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left rounded-xl border-slate-200 font-normal hover:bg-slate-50 h-9 text-sm",
                    !deadlines[type] && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                  {deadlines[type]
                    ? format(deadlines[type], "dd MMMM yyyy", { locale: idLocale })
                    : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={deadlines[type]}
                  onSelect={(date) => handleDateSelect(type, date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          Deadline berhasil disimpan!
        </div>
      )}

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-10 text-sm font-medium"
      >
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSaving ? "Menyimpan..." : "Simpan Semua Deadline"}
      </Button>
    </form>
  );
}
