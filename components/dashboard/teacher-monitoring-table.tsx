"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getTeacherSubmissionsOverview, type TeacherSubmissionRow } from "@/lib/actions/admin";
import { getEvaluationsBySemester } from "@/lib/actions/evaluations";
import { DocumentTypeLabel, type DocumentType, type EvaluationCategory } from "@/lib/types";

interface TeacherMonitoringTableProps {
  semesterId: string;
}

interface EvaluationData {
  teacherId: string;
  finalScore: number;
  category: EvaluationCategory;
}

export function TeacherMonitoringTable({ semesterId }: TeacherMonitoringTableProps) {
  const [submissions, setSubmissions] = useState<TeacherSubmissionRow[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
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
        setDocumentTypes(subResult.documentTypes || []);
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

  const getCategoryBadge = (category: EvaluationCategory) => {
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
    return <Badge variant={variants[category]}>{labels[category]}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Memuat data monitoring...
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada data guru
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Nama Guru</TableHead>
            <TableHead className="min-w-[120px]">Dokumen</TableHead>
            <TableHead className="min-w-[100px]">Progress</TableHead>
            <TableHead className="min-w-[100px]">Nilai</TableHead>
            <TableHead className="min-w-[100px]">Kategori</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((row, index) => {
            const evaluation = getEvaluation(row.teacherId);
            const percentage = Math.round((row.completedCount / 8) * 100);
            const isComplete = row.completedCount === 8;

            return (
              <motion.tr
                key={row.teacherId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <TableCell className="font-medium">{row.teacherName}</TableCell>
                <TableCell>
                  {row.completedCount}/8
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={percentage} className="h-2 w-20" />
                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {evaluation ? (
                    <span className="font-medium">{evaluation.finalScore.toFixed(2)}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {evaluation ? (
                    getCategoryBadge(evaluation.category)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {isComplete ? (
                    <Badge variant="default">Lengkap</Badge>
                  ) : (
                    <Badge variant="outline">Belum</Badge>
                  )}
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
