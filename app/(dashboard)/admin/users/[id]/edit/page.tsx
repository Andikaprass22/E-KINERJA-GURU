import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Edit Pengguna</h2>
          <p className="text-sm text-slate-500 mt-1">Edit data pengguna: {user.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Form Pengguna</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Edit data pengguna. Email dan username tidak dapat diubah.
          </p>
        </div>
        <UserForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role as "ADMIN" | "PRINCIPAL" | "TEACHER",
            isActive: user.isActive,
          }}
          mode="edit"
        />
      </div>
    </div>
  );
}

export default EditUserPage;
