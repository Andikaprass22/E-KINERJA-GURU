"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, ArrowLeft, Users, FileText, BarChart3 } from "lucide-react";
import { EvaluationsTable } from "@/components/dashboard/evaluations-table";
import { EvaluationForm } from "@/components/dashboard/evaluation-form";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import {
  getEvaluationsBySemester,
  upsertEvaluation,
  deleteEvaluation,
  getEvaluationStats,
} from "@/lib/actions/evaluations";
import type { EvaluationCategory, DocumentType } from "@/lib/types";

type Scores = Record<DocumentType, number>;

interface EvaluationRow {
  id: string;
  teacherId: string;
  teacher: { id: string; name: string; username: string };
  evaluator: { id: string; name: string };
  scores: Record<string, number>;
  finalScore: number;
  category: EvaluationCategory;
  updatedAt: Date;
}

interface Teacher {
  id: string;
  name: string;
  username: string;
}

interface EvaluationStats {
  totalTeachers: number;
  evaluated: number;
  distribution: Record<EvaluationCategory, number>;
}

export default function EvaluationsPage() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [evaluations, setEvaluations] = useState<EvaluationRow[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<EvaluationRow | null>(null);

  const loadTeachers = useCallback(async () => {
    try {
      const res = await fetch("/api/users?role=TEACHER");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    }
  }, []);

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
    loadTeachers();
  }, [loadTeachers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (teacherId: string, scores: Record<string, number>) => {
    const result = await upsertEvaluation(teacherId, selectedSemester, scores);
    if (result.success) {
      setShowForm(false);
      setEditingEvaluation(null);
      loadData();
    }
    return result;
  };

  const handleEdit = (evaluation: EvaluationRow) => {
    setEditingEvaluation(evaluation);
    setShowForm(true);
  };

  const handleDelete = async (evaluationId: string) => {
    const result = await deleteEvaluation(evaluationId);
    if (result.success) {
      loadData();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvaluation(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Evaluasi Kinerja Guru</h2>
          <p className="text-sm text-slate-500 mt-1">
            Berikan penilaian untuk kinerja guru
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Evaluasi
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingEvaluation ? "Edit Evaluasi" : "Tambah Evaluasi Baru"}
              </h3>
              <p className="text-sm text-slate-500">Berikan nilai 1-5 untuk 8 aspek penilaian</p>
            </div>
          </div>
          <EvaluationForm
            teachers={teachers}
            semesterId={selectedSemester}
            initialScores={editingEvaluation?.scores}
            initialTeacherId={editingEvaluation?.teacherId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
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

          {isLoading ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center text-slate-400">Memuat data...</div>
          ) : (
            <EvaluationsTable
              evaluations={evaluations}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
