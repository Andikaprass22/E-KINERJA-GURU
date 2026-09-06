import { createSemesterAction } from "@/lib/actions/semesters";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const result = await createSemesterAction(formData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create semester API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat semester" },
      { status: 500 }
    );
  }
}
