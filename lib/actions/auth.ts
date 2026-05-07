"use server";

import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-in/username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    revalidateTag("user-session", "max");
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login gagal. Periksa username dan password." };
  }
}

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    revalidateTag("user-session", "max");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout gagal." };
  }
}