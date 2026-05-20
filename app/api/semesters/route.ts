import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const semesters = await prisma.semester.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    return NextResponse.json(semesters);
  } catch (error) {
    console.error("Failed to fetch semesters:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data semester" },
      { status: 500 }
    );
  }
}
