import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/dashboard/users-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function UsersListPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Kelola Pengguna</h2>
          <p className="text-sm text-muted-foreground mt-1">Kelola akun guru dan staf sekolah</p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm"
        >
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Link>
        </Button>
      </div>

      <UsersTable users={users} />
    </div>
  );
}

export default UsersListPage;
