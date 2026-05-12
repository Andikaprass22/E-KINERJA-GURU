"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SemesterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Semester</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Contoh: Semester Ganjil 2025/2026"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Tanggal Mulai</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">Tanggal Selesai</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Memproses..." : "Buat Semester"}
      </Button>
    </form>
  );
}
