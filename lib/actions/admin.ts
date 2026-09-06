"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { DocumentType, SubmissionStatus } from "@/lib/types";

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

export async function getAdminDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const [totalTeachers, activeSemester, totalEvaluations] = await Promise.all([
    prisma.user.count({ where: { role: "TEACHER", isActive: true } }),
    prisma.semester.findFirst({ where: { isActive: true } }),
    prisma.evaluation.count(),
  ]);

  let documentPercentage = 0;

  if (activeSemester) {
    const [totalSubmissions, completedSubmissions] = await Promise.all([
      prisma.documentSubmission.count({
        where: { semesterId: activeSemester.id },
      }),
      prisma.documentSubmission.count({
        where: {
          semesterId: activeSemester.id,
          status: { in: ["COMPLETED", "LATE"] },
        },
      }),
    ]);

    const maxPossible = totalTeachers * DOCUMENT_TYPES.length;
    documentPercentage =
      maxPossible > 0
        ? Math.round((completedSubmissions / maxPossible) * 100)
        : 0;
  }

  return {
    success: true,
    data: {
      totalTeachers,
      activeSemesterCount: activeSemester ? 1 : 0,
      documentPercentage,
      totalEvaluations,
      activeSemesterId: activeSemester?.id || null,
      activeSemesterName: activeSemester?.name || null,
    },
  };
}

export interface TeacherSubmissionRow {
  teacherId: string;
  teacherName: string;
  submissions: Record<DocumentType, SubmissionStatus>;
  completedCount: number;
}

export async function getTeacherSubmissionsOverview(semesterId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
    return { success: false, error: "Unauthorized" };
  }

  const [teachers, submissions] = await Promise.all([
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.documentSubmission.findMany({
      where: { semesterId },
    }),
  ]);

  const submissionMap = new Map<string, Map<DocumentType, SubmissionStatus>>();

  for (const sub of submissions) {
    if (!submissionMap.has(sub.teacherId)) {
      submissionMap.set(sub.teacherId, new Map());
    }
    submissionMap.get(sub.teacherId)!.set(sub.documentType, sub.status);
  }

  const rows: TeacherSubmissionRow[] = teachers.map((teacher) => {
    const teacherSubs = submissionMap.get(teacher.id) || new Map();
    const submissions: Record<DocumentType, SubmissionStatus> = {} as Record<DocumentType, SubmissionStatus>;

    for (const docType of DOCUMENT_TYPES) {
      submissions[docType] = teacherSubs.get(docType) || "MISSING";
    }

    const completedCount = DOCUMENT_TYPES.filter(
      (dt) => submissions[dt] === "COMPLETED" || submissions[dt] === "LATE"
    ).length;

    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      submissions,
      completedCount,
    };
  });

  return {
    success: true,
    data: rows,
    documentTypes: DOCUMENT_TYPES,
  };
}
