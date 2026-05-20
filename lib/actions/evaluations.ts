"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import type { DocumentType, EvaluationCategory } from "@/lib/types";

const DOCUMENT_TYPES: DocumentType[] = [
  "RPP",
  "SYLLABUS",
  "LEARNING_ACHIEVEMENT",
  "TIME_ALLOCATION",
  "KKTP",
  "SEMESTER_PROGRAM",
  "ANNUAL_PROGRAM",
  "TEACHING_JOURNAL",
];

function calculateCategory(finalScore: number): EvaluationCategory {
  if (finalScore >= 4.56) return "A";
  if (finalScore >= 3.0) return "B";
  if (finalScore >= 2.0) return "C";
  return "D";
}

function validateScores(scores: unknown): scores is Record<string, number> {
  if (!scores || typeof scores !== "object") return false;
  const s = scores as Record<string, unknown>;
  for (const dt of DOCUMENT_TYPES) {
    if (typeof s[dt] !== "number" || s[dt] < 1 || s[dt] > 5) return false;
  }
  return true;
}

export async function upsertEvaluation(
  teacherId: string,
  semesterId: string,
  scores: Record<string, number>
) {
  console.log("=== UPSERT EVALUATION START ===");
  console.log("Input:", { teacherId, semesterId, scores });

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
      console.log("❌ Unauthorized");
      return { success: false, error: "Unauthorized" };
    }

    if (!validateScores(scores)) {
      console.log("❌ Invalid scores");
      return { success: false, error: "Skor harus antara 1-5 untuk setiap aspek" };
    }

    const teacher = await prisma.user.findUnique({
      where: { id: teacherId, role: "TEACHER" },
    });

    if (!teacher) {
      console.log("❌ Teacher not found");
      return { success: false, error: "Guru tidak ditemukan" };
    }

    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
    });

    if (!semester) {
      console.log("❌ Semester not found");
      return { success: false, error: "Semester tidak ditemukan" };
    }

    const values = Object.values(scores);
    const finalScore = values.reduce((a, b) => a + b, 0) / values.length;
    const category = calculateCategory(finalScore);

    console.log("Calculated:", { finalScore, category });

    const evaluation = await prisma.evaluation.upsert({
      where: {
        teacherId_semesterId_evaluatorId: {
          teacherId,
          semesterId,
          evaluatorId: session.user.id,
        },
      },
      update: {
        scores,
        finalScore,
        category,
      },
      create: {
        teacherId,
        semesterId,
        evaluatorId: session.user.id,
        scores,
        finalScore,
        category,
      },
    });

    console.log("✅ Evaluation saved:", evaluation.id);
    revalidateTag("evaluations", "max");

    return { success: true, data: evaluation };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function getEvaluationsBySemester(semesterId: string) {
  console.log("=== GET EVALUATIONS BY SEMESTER ===");
  console.log("semesterId:", semesterId);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
      return { success: false, error: "Unauthorized" };
    }

    const evaluations = await prisma.evaluation.findMany({
      where: { semesterId },
      include: {
        teacher: {
          select: { id: true, name: true, username: true },
        },
        evaluator: {
          select: { id: true, name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    console.log("✅ Found evaluations:", evaluations.length);
    return { success: true, data: evaluations };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function getEvaluationStats(semesterId: string) {
  console.log("=== GET EVALUATION STATS ===");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
      return { success: false, error: "Unauthorized" };
    }

    const [evaluations, totalTeachers] = await Promise.all([
      prisma.evaluation.findMany({
        where: { semesterId },
        select: { category: true },
      }),
      prisma.user.count({ where: { role: "TEACHER", isActive: true } }),
    ]);

    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    for (const e of evaluations) {
      distribution[e.category]++;
    }

    console.log("✅ Stats:", { totalTeachers, evaluated: evaluations.length, distribution });
    return {
      success: true,
      data: {
        totalTeachers,
        evaluated: evaluations.length,
        distribution,
      },
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function deleteEvaluation(evaluationId: string) {
  console.log("=== DELETE EVALUATION ===");
  console.log("evaluationId:", evaluationId);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.evaluationHistory.deleteMany({
      where: { evaluationId },
    });

    await prisma.evaluation.delete({
      where: { id: evaluationId },
    });

    console.log("✅ Evaluation deleted");
    revalidateTag("evaluations", "max");

    return { success: true };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function reviseEvaluation(
  evaluationId: string,
  scores: Record<string, number>,
  reason?: string
) {
  console.log("=== REVISE EVALUATION ===");
  console.log("evaluationId:", evaluationId, "scores:", scores);

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "PRINCIPAL") {
      return { success: false, error: "Hanya Kepala Sekolah yang bisa merevisi evaluasi" };
    }

    if (!validateScores(scores)) {
      return { success: false, error: "Skor harus antara 1-5 untuk setiap aspek" };
    }

    const existing = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!existing) {
      return { success: false, error: "Evaluasi tidak ditemukan" };
    }

    const values = Object.values(scores);
    const finalScore = values.reduce((a, b) => a + b, 0) / values.length;
    const category = calculateCategory(finalScore);

    await prisma.evaluationHistory.create({
      data: {
        evaluationId,
        changedById: session.user.id,
        userId: existing.teacherId,
        previousScores: existing.scores as Record<string, number>,
        newScores: scores,
        reason,
      },
    });

    const updated = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        scores,
        finalScore,
        category,
        evaluatorId: session.user.id,
      },
    });

    console.log("✅ Evaluation revised:", updated.id);
    revalidateTag("evaluations", "max");

    return { success: true, data: updated };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function getEvaluationHistory(evaluationId: string) {
  console.log("=== GET EVALUATION HISTORY ===");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
      return { success: false, error: "Unauthorized" };
    }

    const history = await prisma.evaluationHistory.findMany({
      where: { evaluationId },
      include: {
        changedBy: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { changedAt: "desc" },
    });

    console.log("✅ Found history:", history.length);
    return { success: true, data: history };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}

export async function getEvaluationsForPrincipal(semesterId: string) {
  console.log("=== GET EVALUATIONS FOR PRINCIPAL ===");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "PRINCIPAL") {
      return { success: false, error: "Unauthorized" };
    }

    const evaluations = await prisma.evaluation.findMany({
      where: { semesterId },
      include: {
        teacher: {
          select: { id: true, name: true, username: true },
        },
        evaluator: {
          select: { id: true, name: true, role: true },
        },
        histories: {
          include: {
            changedBy: {
              select: { id: true, name: true },
            },
          },
          orderBy: { changedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    console.log("✅ Found evaluations:", evaluations.length);
    return { success: true, data: evaluations };
  } catch (error) {
    console.error("❌ Error:", error);
    return { success: false, error: "Terjadi kesalahan server" };
  }
}
