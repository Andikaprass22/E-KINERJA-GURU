"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Key, Power, PowerOff, Trash2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const getRoleBadge = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      ADMIN: "bg-red-100 text-red-700",
      PRINCIPAL: "bg-indigo-100 text-indigo-700",
      TEACHER: "bg-blue-100 text-blue-700",
    };
    const labels: Record<UserRole, string> = {
      ADMIN: "Administrator",
      PRINCIPAL: "Kepala Sekolah",
      TEACHER: "Guru",
    };
    return (
      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colors[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const handleToggleStatus = async (userId: string) => {
    setLoading(userId);
    try {
      const response = await fetch("/api/users/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || "Gagal mengubah status");
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(null);
    }
  };

  const handleResetPassword = async (user: User) => {
    const newPassword = prompt("Masukkan password baru untuk user ini:");
    if (!newPassword || newPassword.length < 8) {
      alert("Password minimal 8 karakter");
      return;
    }
    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Password berhasil direset untuk ${user.name}`);
      } else {
        alert(data.error || "Gagal mereset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setLoading(user.id);
    try {
      const response = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || "Gagal menghapus user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-slate-900">Daftar Pengguna</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {users.length} pengguna terdaftar
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-bold text-slate-700">Nama</TableHead>
                <TableHead className="font-bold text-slate-700">Username</TableHead>
                <TableHead className="font-bold text-slate-700">Email</TableHead>
                <TableHead className="font-bold text-slate-700">Role</TableHead>
                <TableHead className="font-bold text-slate-700">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 group"
                >
                  <TableCell className="font-semibold text-slate-900">{user.name}</TableCell>
                  <TableCell className="text-slate-500">@{user.username}</TableCell>
                  <TableCell className="text-slate-500">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      user.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={loading === user.id}
                        >
                          {user.isActive ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Aktifkan
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          disabled={loading === user.id}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
