import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BarChart3, Shield, Clock, CheckCircle2, ArrowRight, BookOpen, Award } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">E-KINERJA GURU</h1>
              <p className="text-xs text-gray-500">SD N 1 Pancor</p>
            </div>
          </div>
        </div>
      </header>

      <section className="w-full px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              Sistem Informasi Kinerja Guru
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Kelola Kinerja Guru
              <span className="text-indigo-600"> Lebih Efisien</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Platform manajemen administrasi dan evaluasi kinerja guru yang modern, terstruktur, dan mudah digunakan untuk SD N 1 Pancor.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 text-white border-0">
                <Link href="/login">
                  Masuk ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-sm">Dokumen</CardTitle>
                <CardDescription className="text-xs">Kelola 8 jenis dokumen pengajaran</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-sm">Multi-Role</CardTitle>
                <CardDescription className="text-xs">Admin, Kepala Sekolah, Guru</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-sm">Evaluasi</CardTitle>
                <CardDescription className="text-xs">Penilaian kinerja bintang 1-5</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-sm">Kategori</CardTitle>
                <CardDescription className="text-xs">Kalkulasi otomatis A-D</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full px-6 lg:px-10 py-16 bg-white">
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Fitur Utama</h3>
          <p className="text-gray-500">Semua yang Anda butuhkan untuk mengelola kinerja guru</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: FileText, color: "blue", title: "Upload Dokumen", desc: "Unggah 8 jenis dokumen administrasi dengan format PDF dan Word" },
            { icon: Clock, color: "orange", title: "Deadline per Dokumen", desc: "Atur batas waktu per dokumen per semester dengan notifikasi otomatis" },
            { icon: BarChart3, color: "purple", title: "Dashboard Statistik", desc: "Pantau persentase kelengkapan dokumen dan rata-rata evaluasi" },
            { icon: Shield, color: "red", title: "Keamanan Role-Based", desc: "Akses terpisah untuk Admin, Kepala Sekolah, dan Guru" },
            { icon: Award, color: "green", title: "Evaluasi Bintang", desc: "Penilaian 8 aspek dengan skala 1-5 dan kategori A-D" },
            { icon: Users, color: "indigo", title: "Monitoring Guru", desc: "Pantau progress upload dan evaluasi setiap guru secara real-time" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-lg bg-${item.color}-50 flex items-center justify-center shrink-0`}>
                <item.icon className={`h-5 w-5 text-${item.color}-600`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full px-6 lg:px-10 py-6 border-t bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs text-gray-500">E-KINERJA GURU &mdash; SD N 1 Pancor</span>
          </div>
          <p className="text-xs text-gray-400">Sistem Manajemen Kinerja Guru</p>
        </div>
      </footer>
    </div>
  );
}
