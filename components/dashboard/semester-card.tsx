"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Power, Trash2 } from "lucide-react";
import Link from "next/link";
import { activateSemesterAction, deleteSemesterAction } from "@/lib/actions/semesters";

interface SemesterCardProps {
  semester: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

export function SemesterCard({ semester }: SemesterCardProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const isExpired = new Date() > semester.endDate;

  const handleActivate = async () => {
    setLoading(true);
    try {
      const result = await activateSemesterAction(semester.id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Gagal mengaktifkan semester");
      }
    } catch (error) {
      console.error("Activate semester error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus semester "${semester.name}"? Data yang terkait (deadline, submission, evaluasi) akan ikut terhapus.`)) return;
    setDeleting(true);
    try {
      const result = await deleteSemesterAction(semester.id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Gagal menghapus semester");
      }
    } catch (error) {
      console.error("Delete semester error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col h-full ${isExpired ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-medium text-slate-900 truncate">{semester.name}</h3>
        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
          semester.isActive
            ? "bg-indigo-100 text-indigo-700"
            : "bg-slate-100 text-slate-500"
        }`}>
          {semester.isActive ? "Aktif" : "Arsip"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Clock className="h-3.5 w-3.5" />
        <span className={isExpired ? "text-red-600 font-medium" : ""}>
          {isExpired ? "Sudah berakhir" : "Sedang berjalan"}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex flex-wrap gap-2">
        {!semester.isActive && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-lg border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
            onClick={handleActivate}
            disabled={loading}
          >
            <Power className="mr-1.5 h-3.5 w-3.5" />
            {loading ? "Memproses..." : "Aktifkan"}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-lg border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          asChild
        >
          <Link href={`/admin/semesters/${semester.id}/deadlines`}>
            Atur Deadline
          </Link>
        </Button>
        {!semester.isActive && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
