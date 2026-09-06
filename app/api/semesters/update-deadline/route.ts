import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import type { DocumentType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { semesterId, deadlines } = body;

    if (!semesterId || !deadlines) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Updating deadlines for semester:", semesterId, deadlines);

    const semester = await prisma.semester.findUnique({
      where: { id: semesterId },
    });

    if (!semester) {
      return NextResponse.json({ error: "Semester not found" }, { status: 404 });
    }

    for (const [documentType, deadline] of Object.entries(deadlines)) {
      await prisma.documentDeadline.upsert({
        where: {
          semesterId_documentType: {
            semesterId,
            documentType: documentType as DocumentType,
          },
        },
        update: {
          deadline: new Date(deadline as string),
        },
        create: {
          semesterId,
          documentType: documentType as DocumentType,
          deadline: new Date(deadline as string),
        },
      });
    }

    revalidateTag("semesters", "max");
    revalidateTag(`semester-${semesterId}`, "max");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update deadline error:", error);
    return NextResponse.json({ error: "Failed to update deadlines" }, { status: 500 });
  }
}