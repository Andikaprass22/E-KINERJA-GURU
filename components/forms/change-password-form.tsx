"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/lib/actions/profile";

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const result = await changePasswordAction(formData);

      if (!result.success) {
        setError(result.error || "Gagal mengubah password");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsLoading(false);

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 2000);
    } catch {
      setError("Terjadi kesalahan yang tidak terduga");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Password Saat Ini</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Password Baru</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 bg-red-50 p-3 rounded-md"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600 bg-green-50 p-3 rounded-md"
        >
          Password berhasil diubah. Anda akan di-redirect ke dashboard...
        </motion.div>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Memproses..." : "Ganti Password"}
      </Button>
    </form>
  );
}