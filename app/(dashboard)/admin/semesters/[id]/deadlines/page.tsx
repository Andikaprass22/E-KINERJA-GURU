import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeadlineForm } from "@/components/forms/deadline-form";
import { notFound } from "next/navigation";

async function DeadlineSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const semester = await prisma.semester.findUnique({
    where: { id },
  });

  if (!semester) {
    notFound();
  }

  const deadlines = await prisma.documentDeadline.findMany({
    where: { semesterId: id },
  });

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
          <h2 className="text-lg font-semibold text-slate-900">Atur Deadline</h2>
          <p className="text-sm text-slate-500 mt-1">
            Atur batas waktu dokumen untuk {semester.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Form Deadline</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Atur batas waktu untuk setiap dokumen. Pastikan tanggal dengan benar.
          </p>
        </div>
        <DeadlineForm semesterId={semester.id} existingDeadlines={deadlines} />
      </div>
    </div>
  );
}

export default DeadlineSettingsPage;
