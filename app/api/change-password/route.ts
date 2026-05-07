import { NextRequest, NextResponse } from "next/server";
import { changePasswordAction } from "@/lib/actions/profile";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = new FormData();

    formData.append("currentPassword", body.currentPassword);
    formData.append("newPassword", body.newPassword);

    const result = await changePasswordAction(formData);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (error) {
    console.error("Change password API error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}