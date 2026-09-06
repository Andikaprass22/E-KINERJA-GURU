import { deleteUserAction } from "@/lib/actions/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID diperlukan" },
        { status: 400 }
      );
    }

    const result = await deleteUserAction(userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete user API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
