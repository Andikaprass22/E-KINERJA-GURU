"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { EvaluationForm } from "@/components/dashboard/evaluation-form";
import { EvaluationHistory } from "@/components/dashboard/evaluation-history";
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

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
}

export default function RevisionPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = use(params);
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSemesters = useCallback(async () => {
    try {
      const res = await fetch("/api/semesters");
      const data = await res.json();
      setSemesters(data);
      const active = data.find((s: Semester) => s.isActive);
      if (active) setSelectedSemester(active.id);
    } catch (error) {
      console.error("Failed to load semesters:", error);
    }
  }, []);

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
    loadSemesters();
  }, [loadSemesters]);

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Revisi Evaluasi</h1>
          <p className="text-muted-foreground">
            Revisi nilai evaluasi kinerja guru
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Semester:</span>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Pilih semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name}
                {semester.isActive && " (Aktif)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Memuat data...
          </CardContent>
        </Card>
      ) : !evaluation ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Evaluasi tidak ditemukan untuk guru ini pada semester yang dipilih
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Revisi</CardTitle>
              <CardDescription>
                Evaluasi oleh: {evaluation.evaluator.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EvaluationForm
                teachers={[evaluation.teacher]}
                semesterId={selectedSemester}
                initialScores={evaluation.scores}
                initialTeacherId={teacherId}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
              />
            </CardContent>
          </Card>

          <div>
            <EvaluationHistory evaluationId={evaluation.id} />
          </div>
        </div>
      )}
    </div>
  );
}
