import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SemesterForm } from "@/components/forms/semester-form";

async function NewSemesterPage() {
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
          <Link href="/admin/semesters">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Tambah Semester Baru</h2>
          <p className="text-sm text-slate-500 mt-1">Buat semester baru dan atur batas waktu dokumen</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Form Semester</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Isi data semester baru di bawah ini. Setelah semester dibuat, Anda dapat mengatur batas waktu untuk setiap dokumen.
          </p>
        </div>
        <SemesterForm />
      </div>
    </div>
  );
}

export default NewSemesterPage;
