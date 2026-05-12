"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import bcrypt from "bcrypt";

export async function createUserAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "ADMIN" | "PRINCIPAL" | "TEACHER";

  console.log("=== CREATE USER ACTION START ===");
  console.log("Input data:", { name, email, username, role, passwordLength: password?.length });

  if (!name || !email || !username || !password || !role) {
    console.log("❌ Missing fields:", { name: !!name, email: !!email, username: !!username, password: !!password, role: !!role });
    return { success: false, error: "Semua field harus diisi" };
  }

  if (password.length < 8) {
    console.log("❌ Password too short:", password.length);
    return { success: false, error: "Password minimal 8 karakter" };
  }

  try {
    console.log("🔍 Checking session...");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      console.log("❌ Unauthorized - Session:", session?.user?.role);
      return { success: false, error: "Unauthorized" };
    }

    console.log("✅ Session valid, checking existing users...");
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        console.log("❌ Email already exists:", email);
        return { success: false, error: "Email sudah terdaftar" };
      }
      if (existingUser.username === username) {
        console.log("❌ Username already exists:", username);
        return { success: false, error: "Username sudah terdaftar" };
      }
    }

    console.log("✅ No existing user, creating user...");
    console.log("🔐 Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log("📝 Creating user in database...");
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        role,
        isActive: true,
        emailVerified: false,
      },
    });

    console.log("✅ User created:", newUser.id);
    console.log("📝 Creating account...");
    await prisma.account.create({
      data: {
        userId: newUser.id,
        accountId: newUser.id,
        providerId: "credential",
        password: passwordHash,
      },
    });

    console.log("✅ Account created successfully");
    console.log("🔄 Updating cache...");
    revalidateTag("users-list", "max");
    console.log("=== CREATE USER ACTION SUCCESS ===");
    return { success: true };
  } catch (error) {
    console.error("❌ Create user error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { success: false, error: "Gagal membuat user: " + (error as Error).message };
  }
}

export async function updateUserAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as "ADMIN" | "PRINCIPAL" | "TEACHER";
  const isActive = formData.get("isActive") === "true";

  console.log("Update user action:", { userId, name, role, isActive });

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      console.log("Unauthorized update user");
      return { success: false, error: "Unauthorized" };
    }

    if (!userId) {
      console.log("Missing userId");
      return { success: false, error: "User ID diperlukan" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        role,
        isActive,
      },
    });

    console.log("User updated successfully:", userId);

    revalidateTag("users-list", "max");
    return { success: true };
  } catch (error) {
    console.error("Update user error:", error);
    return { success: false, error: "Gagal mengupdate user" };
  }
}

export async function toggleUserStatusAction(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    if (user.id === session.user.id) {
      return { success: false, error: "Tidak dapat menonaktifkan akun sendiri" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: !user.isActive,
      },
    });

    revalidateTag("users-list", "max");
    return { success: true };
  } catch (error) {
    console.error("Toggle user status error:", error);
    return { success: false, error: "Gagal mengubah status user" };
  }
}

export async function resetPasswordAction(userId: string, newPassword: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.account.updateMany({
      where: {
        userId,
        providerId: "credential",
      },
      data: {
        password: passwordHash,
      },
    });

    revalidateTag("users-list", "max");
    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Gagal mereset password" };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    if (user.id === session.user.id) {
      return { success: false, error: "Tidak dapat menghapus akun sendiri" };
    }

    await prisma.account.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidateTag("users-list", "max");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Gagal menghapus user" };
  }
}