"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, FileText, Star, BarChart3 } from "lucide-react";
import { AdminStatsCard } from "@/components/dashboard/admin-stats-card";
import { AdminDonutChart } from "@/components/dashboard/admin-donut-chart";
import { AdminMonitoringTable } from "@/components/dashboard/admin-monitoring-table";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import { getDashboardStats, type DashboardStats } from "@/lib/actions/stats";
import Link from "next/link";

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
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Dashboard Kepala Sekolah</h2>
          <p className="text-sm text-slate-500 mt-1">
            {stats?.activeSemester
              ? `Semester: ${stats.activeSemester.name}`
              : "Pantau ringkasan kinerja dan kelengkapan dokumen guru."}
          </p>
        </div>
        <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard
          title="Total Guru"
          value={stats?.totalTeachers || 0}
          subtitle="Guru terdaftar"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <AdminStatsCard
          title="Dokumen Terkumpul"
          value={stats?.documentPercentage || 0}
          suffix="%"
          subtitle="Kelengkapan dokumen"
          icon={FileText}
          color="text-amber-500"
          bgColor="bg-amber-50"
        />
        <AdminStatsCard
          title="Rata-rata Nilai"
          value={stats?.averageScore || 0}
          subtitle="Skala 1-5"
          icon={Star}
          color="text-emerald-500"
          bgColor="bg-emerald-50"
        />
        <AdminStatsCard
          title="Evaluasi Selesai"
          value={stats?.evaluatedTeachers || 0}
          subtitle={`${stats?.totalTeachers || 0} guru total`}
          icon={BarChart3}
          color="text-indigo-500"
          bgColor="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Distribusi Kategori</h3>
            <p className="text-sm text-slate-500 mt-0.5">Hasil evaluasi berdasarkan kategori</p>
          </div>
          <AdminDonutChart
            distribution={stats?.categoryDistribution || { A: 0, B: 0, C: 0, D: 0 }}
            total={stats?.evaluatedTeachers || 0}
          />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Aksi Cepat</h3>
            <p className="text-sm text-slate-500 mt-0.5">Monitoring dan evaluasi kinerja guru</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
            <Link
              href="/principal/evaluations"
              className="group p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition-all duration-200 flex items-start gap-4 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all duration-200">
                <Star size={22} className="text-emerald-600 transition-colors group-hover:scale-110" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Evaluasi Kinerja</h4>
                <p className="text-xs text-slate-500 mt-1">Lihat dan revisi penilaian</p>
              </div>
            </Link>
            <Link
              href="/principal/archive"
              className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 flex items-start gap-4 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all duration-200">
                <BarChart3 size={22} className="text-indigo-600 transition-colors group-hover:scale-110" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Arsip Laporan</h4>
                <p className="text-xs text-slate-500 mt-1">Data historis</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {selectedSemester && (
        <AdminMonitoringTable semesterId={selectedSemester} />
      )}
    </div>
  );
}
