import { NextRequest, NextResponse } from "next/server";
import { resetPasswordAction } from "@/lib/actions/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await resetPasswordAction(body.userId, body.newPassword);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}