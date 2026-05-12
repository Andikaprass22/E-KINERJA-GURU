import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, CheckCircle2, Clock } from "lucide-react";

async function TeacherDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN" && session.user.role !== "PRINCIPAL")) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        <p className="text-muted-foreground">Selamat datang, {session.user.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Terkumpul</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0/8</div>
            <p className="text-xs text-muted-foreground">Dari 8 dokumen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Kelengkapan dokumen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadline Terdekat</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Hari tersisa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Kinerja</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Belum dievaluasi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unggah Dokumen Administrasi</CardTitle>
          <CardDescription>Kelola dan unggah dokumen administrasi pengajaran Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/teacher"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Upload className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Unggah Dokumen</p>
                <p className="text-sm text-muted-foreground">Kelola 8 dokumen administrasi</p>
              </div>
            </a>
            <a
              href="/profile"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Profil Saya</p>
                <p className="text-sm text-muted-foreground">Kelola informasi akun</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}

export default TeacherDashboard;
