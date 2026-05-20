"use client";

import { useState, useEffect, useCallback } from "react";
import { Archive, Users, FileText, Star, BarChart3 } from "lucide-react";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import { TeacherMonitoringTable } from "@/components/dashboard/teacher-monitoring-table";
import { AdminDonutChart } from "@/components/dashboard/admin-donut-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { getDashboardStats, type DashboardStats } from "@/lib/actions/stats";

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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Arsip Laporan</h2>
          <p className="text-sm text-slate-500 mt-1">
            Data historis per semester (read-only)
          </p>
        </div>
        <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />
      </div>

      {!selectedSemester ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
          <Archive className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Pilih Semester</h3>
          <p className="text-sm text-slate-500">Pilih semester untuk melihat data arsip</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center text-slate-400">
          Memuat data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard
              title="Total Guru"
              value={stats?.totalTeachers || 0}
              description="Guru terdaftar"
              icon={Users}
              color="text-blue-500"
              bgColor="bg-blue-50"
            />
            <StatsCard
              title="Dokumen Terkumpul"
              value={stats?.documentPercentage || 0}
              suffix="%"
              description="Kelengkapan dokumen"
              icon={FileText}
              color="text-amber-500"
              bgColor="bg-amber-50"
            />
            <StatsCard
              title="Rata-rata Nilai"
              value={stats?.averageScore || 0}
              description="Skala 1-5"
              icon={Star}
              color="text-emerald-500"
              bgColor="bg-emerald-50"
            />
            <StatsCard
              title="Evaluasi Selesai"
              value={stats?.evaluatedTeachers || 0}
              description="Guru dievaluasi"
              icon={BarChart3}
              color="text-indigo-500"
              bgColor="bg-indigo-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900">Distribusi Kategori</h3>
                <p className="text-sm text-slate-500 mt-0.5">Hasil evaluasi semester ini</p>
              </div>
              <AdminDonutChart
                distribution={stats?.categoryDistribution || { A: 0, B: 0, C: 0, D: 0 }}
                total={stats?.evaluatedTeachers || 0}
              />
            </div>

            <div className="lg:col-span-2">
              <TeacherMonitoringTable semesterId={selectedSemester} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
