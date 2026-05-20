"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { getTeacherSubmissionsOverview, type TeacherSubmissionRow } from "@/lib/actions/admin";
import { getEvaluationsBySemester } from "@/lib/actions/evaluations";
import { type DocumentType, type EvaluationCategory } from "@/lib/types";

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
        {labels[category]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-slate-100 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg transition-shadow">
        <CardContent className="py-12 text-center text-slate-400">
          Memuat data monitoring...
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="border-slate-100 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg transition-shadow">
        <CardContent className="py-12 text-center text-slate-400">
          Belum ada data guru
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-100 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-slate-900">Data Guru</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {submissions.length} guru terdaftar
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="min-w-[150px] font-bold text-slate-700">Nama Guru</TableHead>
                <TableHead className="min-w-[120px] font-bold text-slate-700 hidden sm:table-cell">Dokumen</TableHead>
                <TableHead className="min-w-[100px] font-bold text-slate-700 hidden md:table-cell">Progress</TableHead>
                <TableHead className="min-w-[100px] font-bold text-slate-700">Nilai</TableHead>
                <TableHead className="min-w-[100px] font-bold text-slate-700">Kategori</TableHead>
                <TableHead className="min-w-[80px] font-bold text-slate-700 hidden sm:table-cell">Status</TableHead>
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
                    className="hover:bg-slate-50"
                  >
                    <TableCell className="font-semibold text-slate-900">{row.teacherName}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-slate-600">{row.completedCount}/8</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="h-2 w-20" />
                        <span className="text-xs text-slate-500 font-medium">{percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {evaluation ? (
                        <span className="font-bold text-slate-900">{evaluation.finalScore.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {evaluation ? getCategoryBadge(evaluation.category) : <span className="text-slate-400">-</span>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {isComplete ? (
                        <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Lengkap</span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">Belum</span>
                      )}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
