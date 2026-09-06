"use server";

import { auth } from "@/lib/auth";
import { updateTag } from "next/cache";
import { headers } from "next/headers";

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Sesi tidak valid" };
    }

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        newPassword,
        currentPassword,
      },
    });

    updateTag("user-profile");
    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Gagal mengubah password. Periksa password saat ini." };
  }
}