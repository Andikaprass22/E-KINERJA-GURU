"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { EvaluationCategory } from "@/lib/types";

const DOCUMENT_TYPES_COUNT = 8;

export interface DashboardStats {
  totalTeachers: number;
  evaluatedTeachers: number;
  documentPercentage: number;
  averageScore: number;
  categoryDistribution: Record<EvaluationCategory, number>;
  incompleteTeachers: number;
  activeSemester: { id: string; name: string } | null;
}

export async function getDashboardStats(semesterId?: string): Promise<{
  success: boolean;
  data?: DashboardStats;
  error?: string;
}> {
  console.log("=== GET DASHBOARD STATS ===");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
      return { success: false, error: "Unauthorized" };
    }

    let targetSemesterId = semesterId;

    if (!targetSemesterId) {
      const activeSemester = await prisma.semester.findFirst({
        where: { isActive: true },
        select: { id: true, name: true },
      });

      if (!activeSemester) {
        return {
          success: true,
          data: {
            totalTeachers: 0,
            evaluatedTeachers: 0,
            documentPercentage: 0,
            averageScore: 0,
            categoryDistribution: { A: 0, B: 0, C: 0, D: 0 },
            incompleteTeachers: 0,
            activeSemester: null,
          },
        };
      }

      targetSemesterId = activeSemester.id;
    }

    const [totalTeachers, submissions, evaluations] = await Promise.all([
      prisma.user.count({ where: { role: "TEACHER", isActive: true } }),
      prisma.documentSubmission.findMany({
        where: { semesterId: targetSemesterId },
        select: { teacherId: true, status: true },
      }),
      prisma.evaluation.findMany({
        where: { semesterId: targetSemesterId },
        select: { finalScore: true, category: true },
      }),
    ]);

    const teacherSubmissionMap = new Map<string, number>();
    for (const sub of submissions) {
      if (sub.status === "COMPLETED" || sub.status === "LATE") {
        teacherSubmissionMap.set(
          sub.teacherId,
          (teacherSubmissionMap.get(sub.teacherId) || 0) + 1
        );
      }
    }

    const maxPossible = totalTeachers * DOCUMENT_TYPES_COUNT;
    const totalCompleted = submissions.filter(
      (s) => s.status === "COMPLETED" || s.status === "LATE"
    ).length;
    const documentPercentage =
      maxPossible > 0 ? Math.round((totalCompleted / maxPossible) * 100) : 0;

    const incompleteTeachers = Array.from(teacherSubmissionMap.values()).filter(
      (count) => count < DOCUMENT_TYPES_COUNT
    ).length + (totalTeachers - teacherSubmissionMap.size);

    const categoryDistribution: Record<EvaluationCategory, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };

    let averageScore = 0;

    if (evaluations.length > 0) {
      const totalScore = evaluations.reduce((sum, e) => sum + e.finalScore, 0);
      averageScore = parseFloat((totalScore / evaluations.length).toFixed(2));

      for (const evaluation of evaluations) {
        categoryDistribution[evaluation.category as EvaluationCategory]++;
      }
    }

    const semester = await prisma.semester.findUnique({
      where: { id: targetSemesterId },
      select: { id: true, name: true },
    });

    console.log("✅ Stats calculated:", {
      totalTeachers,
      evaluatedTeachers: evaluations.length,
      documentPercentage,
      averageScore,
    });

    return {
      success: true,
      data: {
        totalTeachers,
        evaluatedTeachers: evaluations.length,
        documentPercentage,
        averageScore,
        categoryDistribution,
        incompleteTeachers,
        activeSemester: semester,
      },
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}
