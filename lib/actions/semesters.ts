"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import type { DocumentType } from "@/lib/types";

export async function createSemesterAction(formData: FormData) {
  const name = formData.get("name") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj >= endDateObj) {
      return { success: false, error: "Tanggal selesai harus setelah tanggal mulai" };
    }

    const semester = await prisma.semester.create({
      data: {
        name,
        startDate: startDateObj,
        endDate: endDateObj,
        isActive: false,
      },
    });

    revalidateTag("semesters", "max");
    return { success: true, semesterId: semester.id };
  } catch (error) {
    console.error("Create semester error:", error);
    return { success: false, error: "Gagal membuat semester" };
  }
}

export async function activateSemesterAction(semesterId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.semester.updateMany({
        where: { isActive: true },
        data: {
          isActive: false,
        },
      });

      await tx.semester.update({
        where: { id: semesterId },
        data: {
          isActive: true,
        },
      });
    });

    revalidateTag("semesters", "max");
    revalidateTag("deadlines", "max");
    return { success: true };
  } catch (error) {
    console.error("Activate semester error:", error);
    return { success: false, error: "Gagal mengaktifkan semester" };
  }
}

export async function updateDeadlineAction(formData: FormData) {
  const semesterId = formData.get("semesterId") as string;
  const documentType = formData.get("documentType") as DocumentType;
  const deadline = formData.get("deadline") as string;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const deadlineObj = new Date(deadline);

    await prisma.documentDeadline.upsert({
      where: {
        semesterId_documentType: {
          semesterId,
          documentType,
        },
      },
      update: {
        deadline: deadlineObj,
      },
      create: {
        semesterId,
        documentType,
        deadline: deadlineObj,
      },
    });

    revalidateTag("deadlines", "max");
    return { success: true };
  } catch (error) {
    console.error("Update deadline error:", error);
    return { success: false, error: "Gagal mengupdate deadline" };
  }
}

export async function deleteSemesterAction(semesterId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
    });

    if (!semester) {
      return { success: false, error: "Semester tidak ditemukan" };
    }

    if (semester.isActive) {
      return { success: false, error: "Tidak bisa menghapus semester yang sedang aktif" };
    }

    await prisma.semester.delete({
      where: { id: semesterId },
    });

    revalidateTag("semesters", "max");
    return { success: true };
  } catch (error) {
    console.error("Delete semester error:", error);
    return { success: false, error: "Gagal menghapus semester" };
  }
}