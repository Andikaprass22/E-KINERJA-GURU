"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Pencil, History, Users, FileText, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import {
  getEvaluationsBySemester,
  getEvaluationStats,
  reviseEvaluation,
} from "@/lib/actions/evaluations";
import { EvaluationForm } from "@/components/dashboard/evaluation-form";
import { EvaluationHistory } from "@/components/dashboard/evaluation-history";
import type { EvaluationCategory, DocumentType } from "@/lib/types";

interface EvaluationRow {
  id: string;
  teacherId: string;
  teacher: { id: string; name: string; username: string };
  evaluator: { id: string; name: string; role: string };
  scores: Record<string, number>;
  finalScore: number;
  category: EvaluationCategory;
  updatedAt: Date;
  histories?: { changedBy: { id: string; name: string } }[];
}

interface EvaluationStats {
  totalTeachers: number;
  evaluated: number;
  distribution: Record<EvaluationCategory, number>;
}

function CategoryBadge({ category }: { category: EvaluationCategory }) {
  const colors: Record<EvaluationCategory, string> = {
    A: "bg-emerald-100 text-emerald-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-amber-100 text-amber-700",
    D: "bg-red-100 text-red-700",
  };
  const labels: Record<EvaluationCategory, string> = {
    A: "Sangat Baik",
    B: "Baik",
    C: "Cukup",
    D: "Kurang",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colors[category]}`}>
      {category} - {labels[category]}
    </span>
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.round(score)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-bold text-slate-900">{score.toFixed(2)}</span>
    </div>
  );
}

export default function PrincipalEvaluationsPage() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [evaluations, setEvaluations] = useState<EvaluationRow[]>([]);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revisingEvaluation, setRevisingEvaluation] = useState<EvaluationRow | null>(null);
  const [historyEvaluationId, setHistoryEvaluationId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!selectedSemester) return;

    setIsLoading(true);
    try {
      const [evaluationsRes, statsRes] = await Promise.all([
        getEvaluationsBySemester(selectedSemester),
        getEvaluationStats(selectedSemester),
      ]);

      if (evaluationsRes.success && evaluationsRes.data) {
        setEvaluations(evaluationsRes.data as unknown as EvaluationRow[]);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Failed to load evaluations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRevise = async (teacherId: string, scores: Record<string, number>) => {
    if (!revisingEvaluation) return { success: false, error: "Tidak ada evaluasi yang dipilih" };
    const result = await reviseEvaluation(revisingEvaluation.id, scores);
    if (result.success) {
      setRevisingEvaluation(null);
      loadData();
    }
    return result;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Evaluasi Kinerja Guru</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tinjau dan revisi evaluasi yang telah dibuat oleh Admin
          </p>
        </div>
      </div>

      {revisingEvaluation ? (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Revisi Evaluasi</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Revisi nilai evaluasi untuk {revisingEvaluation.teacher.name}
            </p>
          </div>
          <EvaluationForm
            teachers={[revisingEvaluation.teacher]}
            semesterId={selectedSemester}
            initialScores={revisingEvaluation.scores}
            initialTeacherId={revisingEvaluation.teacherId}
            onSubmit={handleRevise}
            onCancel={() => setRevisingEvaluation(null)}
          />
        </div>
      ) : (
        <>
          <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />

          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Total Guru</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.totalTeachers}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Users size={22} />
                  </div>
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500">Guru terdaftar</div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Sudah Dievaluasi</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.evaluated}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <FileText size={22} />
                  </div>
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500">Guru dinilai</div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Distribusi</p>
                    <div className="flex gap-1.5 mt-1">
                      {(["A", "B", "C", "D"] as EvaluationCategory[]).map((cat) => (
                        <span key={cat} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {cat}:{stats.distribution[cat]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Star size={22} />
                  </div>
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500">Kategori evaluasi</div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">Progress</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {stats.totalTeachers > 0
                        ? Math.round((stats.evaluated / stats.totalTeachers) * 100)
                        : 0}
                      %
                    </h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <BarChart3 size={22} />
                  </div>
                </div>
                <div className="flex items-center text-xs font-medium text-slate-500">Evaluasi selesai</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900">Daftar Evaluasi</h3>
              <p className="text-sm text-slate-500 mt-0.5">Klik &quot;Revisi&quot; untuk mengubah nilai evaluasi</p>
            </div>
            {isLoading ? (
              <div className="text-center py-8 text-slate-400">Memuat data...</div>
            ) : evaluations.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Belum ada evaluasi pada semester ini
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-bold text-slate-700">Nama Guru</TableHead>
                      <TableHead className="font-bold text-slate-700">Evaluator</TableHead>
                      <TableHead className="font-bold text-slate-700">Nilai Akhir</TableHead>
                      <TableHead className="font-bold text-slate-700">Kategori</TableHead>
                      <TableHead className="w-[100px] font-bold text-slate-700">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evaluations.map((evaluation, index) => (
                      <motion.tr
                        key={evaluation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="font-semibold text-slate-900">
                          {evaluation.teacher.name}
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {evaluation.evaluator.name}
                        </TableCell>
                        <TableCell>
                          <StarRating score={evaluation.finalScore} />
                        </TableCell>
                        <TableCell>
                          <CategoryBadge category={evaluation.category} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => setRevisingEvaluation(evaluation)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => setHistoryEvaluationId(evaluation.id)}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}

      <Dialog open={!!historyEvaluationId} onOpenChange={() => setHistoryEvaluationId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-900">Riwayat Revisi Evaluasi</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 px-1">
            {historyEvaluationId && (
              <EvaluationHistory evaluationId={historyEvaluationId} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
