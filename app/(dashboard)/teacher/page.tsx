import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";
import { CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";
import { DocumentCard } from "@/components/dashboard/document-card";
import { SubmissionProgress } from "@/components/dashboard/submission-progress";
import type { DocumentType } from "@/lib/types";
import { DocumentTypeLabel } from "@/lib/types";

const DOCUMENT_TYPES: DocumentType[] = [
  "RPP",
  "SYLLABUS",
  "LEARNING_ACHIEVEMENT",
  "TIME_ALLOCATION",
  "KKTP",
  "SEMESTER_PROGRAM",
  "ANNUAL_PROGRAM",
  "TEACHING_JOURNAL",
];

async function TeacherSubmissionsContent({ teacherId, semesterId }: { teacherId: string; semesterId: string }) {
  "use cache";
  cacheTag(`submissions-${teacherId}`);

  const [submissions, deadlines] = await Promise.all([
    prisma.documentSubmission.findMany({
      where: {
        teacherId,
        semesterId,
      },
    }),
    prisma.documentDeadline.findMany({
      where: {
        semesterId,
      },
    }),
  ]);

  const submissionMap = new Map(
    submissions.map((s) => [s.documentType, s])
  );

  const deadlineMap = new Map(
    deadlines.map((d) => [d.documentType, d])
  );

  const completedCount = submissions.filter(
    (s) => s.status === "COMPLETED" || s.status === "LATE"
  ).length;

  const nearestDeadline = deadlines
    .filter((d) => d.deadline > new Date())
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())[0];

  const daysRemaining = nearestDeadline
    ? Math.ceil(
        (nearestDeadline.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg hover:border-slate-200 transition-all group ring-1 ring-slate-900/5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 mb-1">Dokumen Terkumpul</p>
              <h3 className="text-2xl font-bold text-slate-900">{completedCount}/8</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500">Dari 8 dokumen</div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 border-l-4 border-l-indigo-500 shadow-md hover:shadow-lg hover:border-slate-200 transition-all group ring-1 ring-slate-900/5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 mb-1">Progress</p>
              <h3 className="text-2xl font-bold text-slate-900">{Math.round((completedCount / 8) * 100)}%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <FileText size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500">Kelengkapan dokumen</div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 border-l-4 border-l-amber-500 shadow-md hover:shadow-lg hover:border-slate-200 transition-all group ring-1 ring-slate-900/5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 mb-1">Deadline Terdekat</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {daysRemaining !== null ? `${daysRemaining} hari` : "-"}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Clock size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500">
            {nearestDeadline
              ? DocumentTypeLabel[nearestDeadline.documentType as DocumentType]
              : "Semua deadline terlewati"}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 border-l-4 border-l-red-500 shadow-md hover:shadow-lg hover:border-slate-200 transition-all group ring-1 ring-slate-900/5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 mb-1">Dokumen Terlambat</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {submissions.filter((s) => s.status === "LATE").length}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-500 group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <AlertCircle size={22} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500">Melewati batas waktu</div>
        </div>
      </div>

      <SubmissionProgress completed={completedCount} total={8} />

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-md ring-1 ring-slate-900/5">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Status Dokumen</h3>
          <p className="text-sm text-slate-500 mt-0.5">Daftar dokumen yang perlu diunggah untuk semester aktif</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {DOCUMENT_TYPES.map((docType) => {
            const submission = submissionMap.get(docType);
            const deadline = deadlineMap.get(docType);

            return (
              <DocumentCard
                key={docType}
                documentType={docType}
                submission={submission || null}
                deadline={deadline?.deadline || null}
                semesterId={semesterId}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

async function TeacherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const activeSemester = await prisma.semester.findFirst({
    where: { isActive: true },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Dashboard Guru</h2>
          <p className="text-sm text-slate-500 mt-1">
            Selamat datang, {session.user.name}
          </p>
        </div>
      </div>

      {activeSemester ? (
        <TeacherSubmissionsContent
          teacherId={session.user.id}
          semesterId={activeSemester.id}
        />
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Belum Ada Semester Aktif</h3>
          <p className="text-sm text-slate-500">Silakan hubungi Admin untuk mengatur semester.</p>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
