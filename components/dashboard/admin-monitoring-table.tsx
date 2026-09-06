"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { FileText, CheckSquare, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getTeacherSubmissionsOverview, type TeacherSubmissionRow } from "@/lib/actions/admin";
import { getEvaluationsBySemester } from "@/lib/actions/evaluations";
import type { EvaluationCategory } from "@/lib/types";

interface AdminMonitoringTableProps {
  semesterId: string;
}

interface EvaluationData {
  teacherId: string;
  finalScore: number;
  category: EvaluationCategory;
}

export function AdminMonitoringTable({ semesterId }: AdminMonitoringTableProps) {
  const [submissions, setSubmissions] = useState<TeacherSubmissionRow[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!semesterId) return;

    setIsLoading(true);
    try {
      const [subResult, evalResult] = await Promise.all([
        getTeacherSubmissionsOverview(semesterId),
        getEvaluationsBySemester(semesterId),
      ]);

      if (subResult.success && subResult.data) {
        setSubmissions(subResult.data);
      }

      if (evalResult.success && evalResult.data) {
        setEvaluations(
          evalResult.data.map((e: any) => ({
            teacherId: e.teacherId,
            finalScore: e.finalScore,
            category: e.category,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load monitoring data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [semesterId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getEvaluation = (teacherId: string) => {
    return evaluations.find((e) => e.teacherId === teacherId);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-slate-400">
        Memuat data...
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        Belum ada data guru
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow ring-1 ring-foreground/5">
      <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card relative z-10">
        <div>
          <h3 className="text-sm font-medium text-foreground">Monitoring Kinerja Guru</h3>
          <p className="text-xs text-muted-foreground">Pantau kelengkapan dokumen dan evaluasi</p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-sm font-semibold text-primary hover:text-primary bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-xl transition-colors active:scale-95 w-full sm:w-auto"
        >
          <Link href="/admin/submissions">Lihat Semua Data</Link>
        </Button>
      </div>

      <div className="overflow-x-auto relative shadow-[inset_-12px_0_15px_-10px_rgba(0,0,0,0.05)] sm:shadow-none">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4 pl-5 sm:pl-6">Nama Guru</th>
              <th className="p-4 hidden sm:table-cell">Dokumen</th>
              <th className="p-4 hidden md:table-cell">Progress Upload</th>
              <th className="p-4">Nilai</th>
              <th className="p-4">Kategori</th>
              <th className="p-4 hidden sm:table-cell">Status</th>
              <th className="p-4 pr-5 sm:pr-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {submissions.map((row) => {
              const evaluation = getEvaluation(row.teacherId);
              const percentage = Math.round((row.completedCount / 8) * 100);
              const isComplete = row.completedCount === 8;

              return (
                <tr key={row.teacherId} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-5 sm:pl-6">
                    <span className="font-semibold text-slate-800">{row.teacherName}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      <FileText size={14} /> {row.completedCount}/8
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-full max-w-[120px] h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            percentage === 100 ? "bg-emerald-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8">{percentage}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    {evaluation ? evaluation.finalScore.toFixed(2) : "-"}
                  </td>
                  <td className="p-4">
                    {evaluation ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                        evaluation.category === "A"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : evaluation.category === "B"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : evaluation.category === "C"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {evaluation.category === "A" ? "Sangat Baik" :
                         evaluation.category === "B" ? "Baik" :
                         evaluation.category === "C" ? "Cukup" : "Kurang"}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isComplete
                        ? "bg-slate-50 text-slate-700 border-slate-200"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {isComplete ? (
                        <><CheckSquare size={12} className="mr-1.5 text-slate-500" /> Lengkap</>
                      ) : (
                        <><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" /> Belum</>
                      )}
                    </span>
                  </td>
                  <td className="p-4 pr-5 sm:pr-6 text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <MoreVertical size={18} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
