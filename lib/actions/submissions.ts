"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import type { DocumentType, SubmissionStatus } from "@/lib/types";

export async function saveSubmissionAction(
  fileUrl: string,
  fileKey: string,
  documentType: DocumentType,
  semesterId: string
) {
  console.log("=== SAVE SUBMISSION ACTION START ===");
  console.log("Input:", { fileUrl, fileKey, documentType, semesterId });

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log("❌ Unauthorized - no session");
      return { success: false, error: "Unauthorized" };
    }

    if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
      console.log("❌ Forbidden - role:", session.user.role);
      return { success: false, error: "Hanya guru yang dapat mengunggah dokumen" };
    }

    const teacherId = session.user.id;

    const deadline = await prisma.documentDeadline.findUnique({
      where: {
        semesterId_documentType: {
          semesterId,
          documentType,
        },
      },
    });

    if (!deadline) {
      console.log("❌ Deadline not found for:", { semesterId, documentType });
      return { success: false, error: "Deadline dokumen tidak ditemukan" };
    }

    const now = new Date();
    const isLate = now > deadline.deadline;
    const status: SubmissionStatus = isLate ? "LATE" : "COMPLETED";

    console.log("Deadline check:", { now, deadline: deadline.deadline, isLate, status });

    const submission = await prisma.documentSubmission.upsert({
      where: {
        teacherId_semesterId_documentType: {
          teacherId,
          semesterId,
          documentType,
        },
      },
      update: {
        fileUrl,
        fileKey,
        uploadedAt: now,
        status,
      },
      create: {
        teacherId,
        semesterId,
        documentType,
        fileUrl,
        fileKey,
        uploadedAt: now,
        status,
      },
    });

    console.log("✅ Submission saved:", submission.id, "status:", status);

    updateTag(`submissions-${teacherId}`);
    updateTag("submissions");

    console.log("=== SAVE SUBMISSION ACTION SUCCESS ===");
    return { success: true, submissionId: submission.id, status };
  } catch (error) {
    console.error("❌ Save submission error:", error);
    return { success: false, error: "Gagal menyimpan dokumen" };
  }
}

export async function checkAndApplyLateSubmissions() {
  console.log("=== CHECK AND APPLY LATE SUBMISSIONS START ===");

  try {
    const activeSemester = await prisma.semester.findFirst({
      where: { isActive: true },
      include: { deadlines: true },
    });

    if (!activeSemester) {
      console.log("No active semester found");
      return { success: true, updated: 0 };
    }

    console.log("Active semester:", activeSemester.name, "with", activeSemester.deadlines.length, "deadlines");

    const now = new Date();
    let updatedCount = 0;

    for (const deadline of activeSemester.deadlines) {
      if (now <= deadline.deadline) continue;

      const result = await prisma.documentSubmission.updateMany({
        where: {
          semesterId: activeSemester.id,
          documentType: deadline.documentType,
          status: "MISSING",
          uploadedAt: null,
        },
        data: {
          status: "MISSING",
        },
      });

      if (result.count > 0) {
        console.log("Marked", result.count, deadline.documentType, "submissions as MISSING");
        updatedCount += result.count;
      }
    }

    console.log("=== CHECK AND APPLY LATE SUBMISSIONS COMPLETE === updated:", updatedCount);
    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error("❌ Check late submissions error:", error);
    return { success: false, error: "Gagal memeriksa dokumen terlambat" };
  }
}

export async function getTeacherSubmissions(teacherId: string, semesterId: string) {
  console.log("Getting submissions for teacher:", teacherId, "semester:", semesterId);

  try {
    const submissions = await prisma.documentSubmission.findMany({
      where: {
        teacherId,
        semesterId,
      },
    });

    const deadlines = await prisma.documentDeadline.findMany({
      where: {
        semesterId,
      },
    });

    return { success: true, submissions, deadlines };
  } catch (error) {
    console.error("Get teacher submissions error:", error);
    return { success: false, error: "Gagal mengambil data dokumen" };
  }
}
