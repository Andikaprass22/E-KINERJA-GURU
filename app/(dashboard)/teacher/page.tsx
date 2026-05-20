import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, FileText } from "lucide-react";
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Terkumpul</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}/8</div>
            <p className="text-xs text-muted-foreground">Dari 8 dokumen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((completedCount / 8) * 100)}%</div>
            <p className="text-xs text-muted-foreground">Kelengkapan dokumen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadline Terdekat</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysRemaining !== null ? `${daysRemaining} hari` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {nearestDeadline
                ? DocumentTypeLabel[nearestDeadline.documentType as DocumentType]
                : "Semua deadline terlewati"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Tertinggal</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.filter((s) => s.status === "LATE").length}
            </div>
            <p className="text-xs text-muted-foreground">Melewati batas waktu</p>
          </CardContent>
        </Card>
      </div>

      <SubmissionProgress completed={completedCount} total={8} />

      <Card>
        <CardHeader>
          <CardTitle>Status Dokumen</CardTitle>
          <CardDescription>Daftar dokumen yang perlu diunggah untuk semester aktif</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        <p className="text-muted-foreground">Selamat datang, {session.user.name}</p>
      </div>

      {activeSemester ? (
        <TeacherSubmissionsContent
          teacherId={session.user.id}
          semesterId={activeSemester.id}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Status Dokumen</CardTitle>
            <CardDescription>Daftar dokumen yang perlu diunggah</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Belum ada semester aktif. Silakan hubungi Admin.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TeacherDashboard;
