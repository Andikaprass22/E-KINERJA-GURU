"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/types";

interface UserFormProps {
  user?: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    isActive: boolean;
  };
  mode?: "create" | "edit";
}

export function UserForm({ user, mode = "create" }: UserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    password: "",
    role: user?.role || "TEACHER",
    isActive: user?.isActive ?? true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    if (mode === "create" && formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = mode === "create" ? "/api/users/create" : "/api/users/update";
      const body = mode === "create" 
        ? formData 
        : { ...formData, userId: user?.id };
      
      console.log("Submitting to:", endpoint);
      console.log("Body:", body);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        console.error("API Error:", data);
        setError(data.error || "Gagal menyimpan user");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);

      setTimeout(() => {
        router.push("/admin/users");
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Terjadi kesalahan yang tidak terduga");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
      {mode === "create" && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TEACHER">Guru</SelectItem>
            <SelectItem value="PRINCIPAL">Kepala Sekolah</SelectItem>
            <SelectItem value="ADMIN">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {mode === "edit" && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Aktif
          </Label>
        </div>
      )}
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
          {mode === "create" ? "User berhasil dibuat" : "User berhasil diupdate"}. Anda akan di-redirect...
        </motion.div>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Memproses..." : mode === "create" ? "Buat User" : "Simpan Perubahan"}
      </Button>
    </form>
  );
}