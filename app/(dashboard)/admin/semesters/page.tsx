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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Semester</h1>
          <p className="text-muted-foreground">Kelola semester dan batas waktu dokumen</p>
        </div>
        <Button asChild>
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