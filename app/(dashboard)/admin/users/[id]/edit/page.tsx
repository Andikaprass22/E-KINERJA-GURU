import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/forms/user-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
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
          <h1 className="text-2xl font-bold">Edit Pengguna</h1>
          <p className="text-muted-foreground">Edit data pengguna: {user.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Pengguna</CardTitle>
          <CardDescription>
            Edit data pengguna. Email dan username tidak dapat diubah.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
              role: user.role as "ADMIN" | "PRINCIPAL" | "TEACHER",
              isActive: user.isActive,
            }}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default EditUserPage;