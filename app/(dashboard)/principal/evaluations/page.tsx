"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Pencil, History } from "lucide-react";
import { motion } from "framer-motion";
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

interface Semester {
  id: string;
  name: string;
  isActive: boolean;
}

interface EvaluationStats {
  totalTeachers: number;
  evaluated: number;
  distribution: Record<EvaluationCategory, number>;
}

function CategoryBadge({ category }: { category: EvaluationCategory }) {
  const variants: Record<EvaluationCategory, "default" | "secondary" | "destructive" | "outline"> = {
    A: "default",
    B: "secondary",
    C: "outline",
    D: "destructive",
  };
  const labels: Record<EvaluationCategory, string> = {
    A: "Sangat Baik",
    B: "Baik",
    C: "Cukup",
    D: "Kurang",
  };
  return (
    <Badge variant={variants[category]}>
      {category} - {labels[category]}
    </Badge>
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
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{score.toFixed(2)}</span>
    </div>
  );
}

export default function PrincipalEvaluationsPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [evaluations, setEvaluations] = useState<EvaluationRow[]>([]);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revisingEvaluation, setRevisingEvaluation] = useState<EvaluationRow | null>(null);
  const [historyEvaluationId, setHistoryEvaluationId] = useState<string | null>(null);

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
    loadSemesters();
  }, [loadSemesters]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Evaluasi Kinerja Guru</h1>
          <p className="text-muted-foreground">
            Tinjau dan revisi evaluasi yang telah dibuat oleh Admin
          </p>
        </div>
      </div>

      {revisingEvaluation ? (
        <Card>
          <CardHeader>
            <CardTitle>Revisi Evaluasi</CardTitle>
            <CardDescription>
              Revisi nilai evaluasi untuk {revisingEvaluation.teacher.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EvaluationForm
              teachers={[revisingEvaluation.teacher]}
              semesterId={selectedSemester}
              initialScores={revisingEvaluation.scores}
              initialTeacherId={revisingEvaluation.teacherId}
              onSubmit={handleRevise}
              onCancel={() => setRevisingEvaluation(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-4">
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
          </div>

          {stats && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Guru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sudah Dievaluasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.evaluated}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Distribusi Kategori
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {(["A", "B", "C", "D"] as EvaluationCategory[]).map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}: {stats.distribution[cat]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalTeachers > 0
                      ? Math.round((stats.evaluated / stats.totalTeachers) * 100)
                      : 0}
                    %
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Daftar Evaluasi</CardTitle>
              <CardDescription>
                Klik &quot;Revisi&quot; untuk mengubah nilai evaluasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Memuat data...
                </div>
              ) : evaluations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada evaluasi pada semester ini
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Guru</TableHead>
                        <TableHead>Evaluator</TableHead>
                        <TableHead>Nilai Akhir</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluations.map((evaluation, index) => (
                        <motion.tr
                          key={evaluation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <TableCell className="font-medium">
                            {evaluation.teacher.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
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
                                onClick={() => setRevisingEvaluation(evaluation)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
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
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={!!historyEvaluationId} onOpenChange={() => setHistoryEvaluationId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-lg">Riwayat Revisi Evaluasi</DialogTitle>
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
