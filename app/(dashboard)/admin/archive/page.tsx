"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive } from "lucide-react";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import { TeacherMonitoringTable } from "@/components/dashboard/teacher-monitoring-table";
import { getDashboardStats, type DashboardStats } from "@/lib/actions/stats";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, FileText, Star, BarChart3 } from "lucide-react";
import { useEffect, useCallback } from "react";

export default function AdminArchivePage() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!selectedSemester) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await getDashboardStats(selectedSemester);
    if (result.success && result.data) {
      setStats(result.data);
    }
    setIsLoading(false);
  }, [selectedSemester]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Arsip Laporan</h1>
          <p className="text-muted-foreground">
            Data historis per semester (read-only)
          </p>
        </div>
        <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />
      </div>

      {!selectedSemester ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Pilih Semester</p>
              <p className="text-sm">Pilih semester untuk melihat data arsip</p>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Memuat data...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Guru"
              value={stats?.totalTeachers || 0}
              description="Guru terdaftar"
              icon={Users}
            />
            <StatsCard
              title="Dokumen Terkumpul"
              value={stats?.documentPercentage || 0}
              suffix="%"
              description="Kelengkapan dokumen"
              icon={FileText}
            />
            <StatsCard
              title="Rata-rata Nilai"
              value={stats?.averageScore || 0}
              description="Skala 1-5"
              icon={Star}
            />
            <StatsCard
              title="Evaluasi Selesai"
              value={stats?.evaluatedTeachers || 0}
              description="Guru dievaluasi"
              icon={BarChart3}
            />
          </div>

          {stats && stats.categoryDistribution && (
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kategori</CardTitle>
                <CardDescription>Hasil evaluasi semester ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {(["A", "B", "C", "D"] as const).map((cat) => (
                    <div key={cat} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{stats.categoryDistribution[cat]}</div>
                      <div className="text-sm text-muted-foreground">Kategori {cat}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Data Guru</CardTitle>
              <CardDescription>Detail dokumen dan evaluasi per guru</CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherMonitoringTable semesterId={selectedSemester} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
