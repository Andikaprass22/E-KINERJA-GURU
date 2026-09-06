"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EvaluationForm } from "@/components/dashboard/evaluation-form";
import { EvaluationHistory } from "@/components/dashboard/evaluation-history";
import { SemesterSelector } from "@/components/dashboard/semester-selector";
import { getEvaluationsBySemester, reviseEvaluation } from "@/lib/actions/evaluations";

interface EvaluationRow {
  id: string;
  teacherId: string;
  teacher: { id: string; name: string; username: string };
  evaluator: { id: string; name: string };
  scores: Record<string, number>;
  finalScore: number;
  category: string;
}

export default function RevisionPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = use(params);
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvaluation = useCallback(async () => {
    if (!selectedSemester) return;

    setIsLoading(true);
    try {
      const result = await getEvaluationsBySemester(selectedSemester);
      if (result.success && result.data) {
        const found = (result.data as unknown as EvaluationRow[]).find(
          (e) => e.teacherId === teacherId
        );
        setEvaluation(found || null);
      }
    } catch (error) {
      console.error("Failed to load evaluation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSemester, teacherId]);

  useEffect(() => {
    loadEvaluation();
  }, [loadEvaluation]);

  const handleSubmit = async (tid: string, scores: Record<string, number>) => {
    if (!evaluation) return { success: false, error: "Evaluasi tidak ditemukan" };
    const result = await reviseEvaluation(evaluation.id, scores);
    if (result.success) {
      loadEvaluation();
    }
    return result;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Revisi Evaluasi</h2>
          <p className="text-sm text-slate-500 mt-1">
            Revisi nilai evaluasi kinerja guru
          </p>
        </div>
      </div>

      <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />

      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center text-slate-400">
          Memuat data...
        </div>
      ) : !evaluation ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center text-slate-400">
          Evaluasi tidak ditemukan untuk guru ini pada semester yang dipilih
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900">Form Revisi</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Evaluasi oleh: {evaluation.evaluator.name}
              </p>
            </div>
            <EvaluationForm
              teachers={[evaluation.teacher]}
              semesterId={selectedSemester}
              initialScores={evaluation.scores}
              initialTeacherId={teacherId}
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
            />
          </div>

          <div>
            <EvaluationHistory evaluationId={evaluation.id} />
          </div>
        </div>
      )}
    </div>
  );
}
