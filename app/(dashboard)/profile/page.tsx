import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordForm } from "@/components/forms/change-password-form";
import { User, Mail, Shield, Calendar, Clock } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  PRINCIPAL: "Kepala Sekolah",
  TEACHER: "Guru",
};

async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const initial = user.name?.charAt(0).toUpperCase() || "U";
  const role = user.role as string;
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profil Saya</h2>
        <p className="text-sm text-muted-foreground mt-1">Kelola informasi akun dan keamanan</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#1E3A6B] to-teal-800 p-5 sm:p-6 lg:p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-xl">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">{user.name}</h1>
            <p className="text-blue-200 text-sm mb-3">@{user.username}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                <Shield className="h-3 w-3" />
                {roleLabels[role] || role}
              </span>
              <span className="text-blue-200 text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {today}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Informasi Akun</h3>
              <p className="text-xs text-muted-foreground">Detail profil pengguna</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium">Nama Lengkap</p>
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium">Email</p>
                <p className="text-sm font-semibold text-foreground truncate">{user.email || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium">Username</p>
                <p className="text-sm font-semibold text-foreground truncate">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium">Role</p>
                <p className="text-sm font-semibold text-foreground">{roleLabels[role] || role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Keamanan</h3>
              <p className="text-xs text-muted-foreground">Ubah password untuk keamanan akun</p>
            </div>
          </div>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
