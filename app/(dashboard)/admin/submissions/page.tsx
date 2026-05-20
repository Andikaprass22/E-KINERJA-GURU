import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FileCheck } from "lucide-react";
import { getTeacherSubmissionsOverview } from "@/lib/actions/admin";
import { AdminSubmissionsTable } from "@/components/dashboard/admin-submissions-table";

async function SubmissionsContent({ semesterId }: { semesterId: string }) {
  const result = await getTeacherSubmissionsOverview(semesterId);

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-8 text-slate-400">
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
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Progress Upload Guru</h2>
          <p className="text-sm text-slate-500 mt-1">Pantau kelengkapan dokumen guru</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
          <FileCheck className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Belum Ada Semester</h3>
          <p className="text-sm text-slate-500">Buat semester terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Progress Upload Guru</h2>
          <p className="text-sm text-slate-500 mt-1">
            Pantau kelengkapan dokumen - {activeSemester.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl">
        <FileCheck className="h-4 w-4 text-indigo-500" />
        <span className="text-sm text-slate-600">
          <span className="font-bold text-emerald-600">Hijau</span> = Selesai,{" "}
          <span className="font-bold text-red-600">Merah</span> = Terlambat,{" "}
          <span className="font-bold text-slate-500">Abu-abu</span> = Belum Unggah
        </span>
      </div>

      <SubmissionsContent semesterId={activeSemester.id} />
    </div>
  );
}

export default AdminSubmissionsPage;
