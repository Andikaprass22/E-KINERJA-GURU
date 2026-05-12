"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "PRINCIPAL":
        return "default";
      case "TEACHER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "PRINCIPAL":
        return "Kepala Sekolah";
      case "TEACHER":
        return "Guru";
      default:
        return role;
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setLoading(userId);
    try {
      const response = await fetch("/api/users/toggle-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
                      className="text-destructive focus:text-destructive"
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
  );
}