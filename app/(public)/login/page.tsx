"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { authClient, type User } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  BarChart3,
  Shield,
  ArrowRight,
  Users,
  Award,
  Loader2,
} from "lucide-react";

const features = [
  { icon: FileText, title: "Manajemen Dokumen", desc: "Kelola 8 jenis dokumen pengajaran guru" },
  { icon: BarChart3, title: "Evaluasi Kinerja", desc: "Penilaian bintang 1-5 dengan kategori A-D" },
  { icon: Users, title: "Multi-Role", desc: "Akses berbeda untuk Admin, Kepala Sekolah, dan Guru" },
  { icon: Award, title: "Dashboard Statistik", desc: "Monitoring real-time kelengkapan dan evaluasi" },
  { icon: Shield, title: "Keamanan Terjamin", desc: "Autentikasi modern dengan proteksi role-based" },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.username({
        username,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Login gagal");
        setLoading(false);
        return;
      }

      const session = result.data as unknown as { user: User };
      const role = session?.user?.role as "ADMIN" | "PRINCIPAL" | "TEACHER" | undefined;

      setLoggingIn(true);

      setTimeout(() => {
        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "PRINCIPAL") {
          router.push("/principal");
        } else {
          router.push("/teacher");
        }
      }, 600);
    } catch {
      setError("Terjadi kesalahan yang tidak terduga");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <AnimatePresence>
        {loggingIn && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-white"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium">Mengarahkan ke dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">E-KINERJA GURU</h1>
              <p className="text-indigo-200 text-xs">SD N 1 Pancor</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Sistem Manajemen<br />Kinerja Guru
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-sm">
            Platform modern untuk mengelola administrasi, evaluasi, dan monitoring kinerja guru secara terintegrasi.
          </p>

          <div className="space-y-3 pt-4">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-indigo-200" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-indigo-200 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-indigo-300 text-xs">Sistem Informasi Kinerja Guru</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-bold text-slate-900">E-KINERJA GURU</h1>
            <p className="text-xs text-slate-500">SD N 1 Pancor</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Masuk</h2>
            <p className="text-sm text-slate-500">Masukkan kredensial Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-slate-700">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="h-10 rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-10 rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-50"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-sm font-medium gap-2 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400">
              SD N 1 Pancor &mdash; Sistem Manajemen Kinerja Guru
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
