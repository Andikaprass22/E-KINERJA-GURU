import { NextRequest, NextResponse } from "next/server";
import { createUserAction } from "@/lib/actions/users";

export async function POST(request: NextRequest) {
  console.log("=== CREATE USER API START ===");
  
  try {
    const body = await request.json();
    console.log("📥 Request body received:", body);
    
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    console.log("📝 FormData created:", Array.from(formData.entries()));

    const result = await createUserAction(formData);

    console.log("📤 Action result:", result);

    if (result.success) {
      console.log("✅ CREATE USER API SUCCESS ===");
      return NextResponse.json({ success: true });
    }

    console.log("❌ CREATE USER API FAILED ===");
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  } catch (error) {
    console.error("❌ CREATE USER API ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", (error as Error).message);
    console.error("Error stack:", (error as Error).stack);
    
    return NextResponse.json({ 
      success: false, 
      error: "Terjadi kesalahan server: " + (error as Error).message 
    }, { status: 500 });
  }
}