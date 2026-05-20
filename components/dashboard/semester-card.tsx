"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      className="h-full"
    >
      <Card className={`h-full flex flex-col ${isExpired ? "opacity-60" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base truncate">{semester.name}</CardTitle>
            <Badge variant={semester.isActive ? "default" : "secondary"} className="shrink-0 text-xs">
              {semester.isActive ? "Aktif" : "Arsip"}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Clock className="h-3.5 w-3.5" />
            <span className={isExpired ? "text-red-600 font-medium" : ""}>
              {isExpired ? "Sudah berakhir" : "Sedang berjalan"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {!semester.isActive && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
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
              className="h-8 text-xs"
              asChild
            >
              <Link href={`/admin/semesters/${semester.id}/deadlines`}>
                Atur Deadline
              </Link>
            </Button>
            {!semester.isActive && (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                {deleting ? "Menghapus..." : "Hapus"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}