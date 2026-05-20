import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function NewUserPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
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
          <h2 className="text-lg font-semibold text-slate-900">Tambah Pengguna Baru</h2>
          <p className="text-sm text-slate-500 mt-1">Buat akun baru untuk guru atau staf sekolah</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Form Pengguna</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Isi data pengguna baru di bawah ini. Username dan email harus unik.
          </p>
        </div>
        <UserForm mode="create" />
      </div>
    </div>
  );
}

export default NewUserPage;
