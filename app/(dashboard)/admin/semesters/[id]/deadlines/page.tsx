import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/semesters">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Atur Deadline</h1>
          <p className="text-muted-foreground">
            Atur batas waktu dokumen untuk {semester.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Deadline</CardTitle>
          <CardDescription>
            Atur batas waktu untuk setiap dokumen. Pastikan tanggal dengan benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeadlineForm semesterId={semester.id} existingDeadlines={deadlines} />
        </CardContent>
      </Card>
    </div>
  );
}

export default DeadlineSettingsPage;