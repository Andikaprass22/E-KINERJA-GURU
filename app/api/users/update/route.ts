import { NextRequest, NextResponse } from "next/server";
import { updateUserAction } from "@/lib/actions/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Update user API received:", body);
    
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    console.log("FormData created:", Array.from(formData.entries()));

    const result = await updateUserAction(formData);

    console.log("Update user action result:", result);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (error) {
    console.error("Update user API error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}