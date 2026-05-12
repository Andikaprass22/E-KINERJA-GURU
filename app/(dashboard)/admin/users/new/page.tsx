import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function NewUserPage() {
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
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Tambah Pengguna Baru</h1>
          <p className="text-muted-foreground">Buat akun baru untuk guru atau staf sekolah</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Pengguna</CardTitle>
          <CardDescription>
            Isi data pengguna baru di bawah ini. Username dan email harus unik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}

export default NewUserPage;