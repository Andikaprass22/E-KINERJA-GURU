import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/semesters">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tambah Semester Baru</h1>
          <p className="text-muted-foreground">Buat semester baru dan atur batas waktu dokumen</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Semester</CardTitle>
          <CardDescription>
            Isi data semester baru di bawah ini. Setelah semester dibuat, Anda dapat mengatur batas waktu untuk setiap dokumen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SemesterForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default NewSemesterPage;