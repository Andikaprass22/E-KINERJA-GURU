"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Star, BarChart3 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import { TeacherMonitoringTable } from "@/components/dashboard/teacher-monitoring-table";
import { getDashboardStats, type DashboardStats } from "@/lib/actions/stats";

export default function PrincipalDashboard() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    const result = await getDashboardStats(selectedSemester || undefined);
    if (result.success && result.data) {
      setStats(result.data);
      if (!selectedSemester && result.data.activeSemester) {
        setSelectedSemester(result.data.activeSemester.id);
      }
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
          <h1 className="text-2xl font-bold">Dashboard Kepala Sekolah</h1>
          <p className="text-muted-foreground">
            {stats?.activeSemester
              ? `Semester: ${stats.activeSemester.name}`
              : "Tidak ada semester aktif"}
          </p>
        </div>
        <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />
      </div>

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
          variant={
            (stats?.documentPercentage || 0) >= 80
              ? "success"
              : (stats?.documentPercentage || 0) >= 50
              ? "warning"
              : "danger"
          }
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
          description={`${stats?.totalTeachers || 0} guru total`}
          icon={BarChart3}
        />
      </div>

      {stats && stats.categoryDistribution && (
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori</CardTitle>
            <CardDescription>Hasil evaluasi berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {(["A", "B", "C", "D"] as const).map((cat) => (
                <div key={cat} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{stats.categoryDistribution[cat]}</div>
                  <div className="text-sm text-muted-foreground">
                    Kategori {cat}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Guru</CardTitle>
          <CardDescription>
            Pantau kelengkapan dokumen dan evaluasi kinerja guru
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSemester ? (
            <TeacherMonitoringTable semesterId={selectedSemester} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Pilih semester untuk melihat data monitoring
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Monitoring dan evaluasi kinerja guru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/principal/evaluations"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Evaluasi Kinerja</p>
                <p className="text-sm text-muted-foreground">Lihat dan revisi penilaian guru</p>
              </div>
            </a>
            <a
              href="/principal/archive"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Arsip Laporan</p>
                <p className="text-sm text-muted-foreground">Lihat data historis</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
