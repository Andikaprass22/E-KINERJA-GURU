import { activateSemesterAction } from "@/lib/actions/semesters";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { semesterId } = await request.json();

    if (!semesterId) {
      return NextResponse.json(
        { success: false, error: "Semester ID diperlukan" },
        { status: 400 }
      );
    }

    const result = await activateSemesterAction(semesterId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Activate semester API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengaktifkan semester" },
      { status: 500 }
    );
  }
}
