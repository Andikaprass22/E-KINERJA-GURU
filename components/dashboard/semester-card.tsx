"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, XCircle, Power } from "lucide-react";
import Link from "next/link";

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
      const response = await fetch("/api/semesters/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ semesterId: semester.id }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.reload();
      } else {
        alert(data.error || "Gagal mengaktifkan semester");
      }
    } catch (error) {
      console.error("Activate semester error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={isExpired ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{semester.name}</CardTitle>
            <Badge variant={semester.isActive ? "default" : "secondary"}>
              {semester.isActive ? "Aktif" : "Arsip"}
            </Badge>
          </div>
          <CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={isExpired ? "text-red-600" : "text-muted-foreground"}>
                {isExpired ? "Sudah berakhir" : "Sedang berjalan"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {semester.isActive ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                {semester.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="flex gap-2">
              {!semester.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleActivate}
                  disabled={loading}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {loading ? "Memproses..." : "Aktifkan"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/admin/semesters/${semester.id}/deadlines`}>
                  Atur Deadline
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}