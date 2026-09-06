"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SemesterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (startDate) formData.set("startDate", startDate.toISOString());
    if (endDate) formData.set("endDate", endDate.toISOString());

    try {
      const response = await fetch("/api/semesters/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/admin/semesters/${data.semesterId}/deadlines`);
      } else {
        alert(data.error || "Gagal membuat semester");
      }
    } catch (error) {
      console.error("Create semester error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-foreground">Nama Semester</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Contoh: Semester Ganjil 2025/2026"
          required
          className="rounded-xl border-border focus-visible:border-primary/50 focus-visible:ring-primary/20"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Tanggal Mulai</Label>
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left rounded-xl border-border font-normal hover:bg-muted",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {startDate ? format(startDate, "dd MMMM yyyy", { locale: idLocale }) : "Pilih tanggal mulai"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground">Tanggal Selesai</Label>
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left rounded-xl border-border font-normal hover:bg-muted",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {endDate ? format(endDate, "dd MMMM yyyy", { locale: idLocale }) : "Pilih tanggal selesai"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndOpen(false);
                }}
                disabled={(date) => startDate ? date < startDate : false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-11 text-sm font-semibold"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Memproses..." : "Buat Semester"}
      </Button>
    </form>
  );
}
