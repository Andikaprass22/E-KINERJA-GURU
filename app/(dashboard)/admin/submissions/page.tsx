import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import { getTeacherSubmissionsOverview } from "@/lib/actions/admin";
import { AdminSubmissionsTable } from "@/components/dashboard/admin-submissions-table";

async function SubmissionsContent({ semesterId }: { semesterId: string }) {
  const result = await getTeacherSubmissionsOverview(semesterId);

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Gagal memuat data
      </div>
    );
  }

  return (
    <AdminSubmissionsTable
      rows={result.data}
      documentTypes={result.documentTypes}
    />
  );
}

async function AdminSubmissionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const semesters = await prisma.semester.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeSemester = semesters.find((s) => s.isActive) || semesters[0];

  if (!activeSemester) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Progress Upload Guru</h1>
          <p className="text-muted-foreground">
            Pantau kelengkapan dokumen guru
          </p>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Belum ada semester. Buat semester terlebih dahulu.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Progress Upload Guru</h1>
          <p className="text-muted-foreground">
            Pantau kelengkapan dokumen - {activeSemester.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <FileCheck className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          <span className="text-green-600 font-medium">Hijau</span> = Selesai,{" "}
          <span className="text-red-600 font-medium">Merah</span> = Terlambat,{" "}
          <span className="text-gray-500 font-medium">Abu-abu</span> = Belum Unggah
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Guru</CardTitle>
          <CardDescription>
            Status 8 dokumen untuk setiap guru pada semester {activeSemester.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionsContent semesterId={activeSemester.id} />
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSubmissionsPage;
