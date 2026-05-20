import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SemesterCard } from "@/components/dashboard/semester-card";
import { cacheTag } from "next/cache";

async function SemestersListContent() {
  "use cache";
  cacheTag("semesters");

  const semesters = await prisma.semester.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="grid gap-4 items-stretch md:grid-cols-2 lg:grid-cols-3">
      {semesters.map((semester) => (
        <SemesterCard key={semester.id} semester={semester} />
      ))}
    </div>
  );
}

async function SemestersListPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Pengaturan Semester</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola semester dan batas waktu dokumen</p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
        >
          <Link href="/admin/semesters/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Semester
          </Link>
        </Button>
      </div>

      <SemestersListContent />
    </div>
  );
}

export default SemestersListPage;
