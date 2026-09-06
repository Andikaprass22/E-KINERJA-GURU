import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BarChart3, Shield, Clock, CheckCircle2, ArrowRight, BookOpen, Award } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/30">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center shadow-sm shadow-primary/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">E-KINERJA GURU</h1>
              <p className="text-xs text-muted-foreground">SD N 1 Pancor</p>
            </div>
          </div>
        </div>
      </header>

      <section className="w-full px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Sistem Informasi Kinerja Guru
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Kelola Kinerja Guru
              <span className="text-primary"> Lebih Efisien</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Platform manajemen administrasi dan evaluasi kinerja guru yang modern, terstruktur, dan mudah digunakan untuk SD N 1 Pancor.
            </p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-primary to-teal-700 hover:from-primary/90 hover:to-teal-800 shadow-md shadow-primary/20 text-white border-0">
                <Link href="/login">
                  Masuk ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">Dokumen</CardTitle>
                <CardDescription className="text-xs">Kelola 8 jenis dokumen pengajaran</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-teal-700" />
                </div>
                <CardTitle className="text-sm">Multi-Role</CardTitle>
                <CardDescription className="text-xs">Admin, Kepala Sekolah, Guru</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">Evaluasi</CardTitle>
                <CardDescription className="text-xs">Penilaian kinerja bintang 1-5</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader className="pb-3 items-start text-left">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle className="text-sm">Kategori</CardTitle>
                <CardDescription className="text-xs">Kalkulasi otomatis A-D</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full px-6 lg:px-10 py-16 bg-card">
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-foreground mb-2">Fitur Utama</h3>
          <p className="text-muted-foreground">Semua yang Anda butuhkan untuk mengelola kinerja guru</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: FileText, bg: "bg-secondary", iconColor: "text-primary", title: "Upload Dokumen", desc: "Unggah 8 jenis dokumen administrasi dengan format PDF dan Word" },
            { icon: Clock, bg: "bg-amber-50", iconColor: "text-amber-600", title: "Deadline per Dokumen", desc: "Atur batas waktu per dokumen per semester dengan notifikasi otomatis" },
            { icon: BarChart3, bg: "bg-secondary", iconColor: "text-primary", title: "Dashboard Statistik", desc: "Pantau persentase kelengkapan dokumen dan rata-rata evaluasi" },
            { icon: Shield, bg: "bg-red-50", iconColor: "text-red-600", title: "Keamanan Role-Based", desc: "Akses terpisah untuk Admin, Kepala Sekolah, dan Guru" },
            { icon: Award, bg: "bg-accent", iconColor: "text-teal-700", title: "Evaluasi Bintang", desc: "Penilaian 8 aspek dengan skala 1-5 dan kategori A-D" },
            { icon: Users, bg: "bg-secondary", iconColor: "text-primary", title: "Monitoring Guru", desc: "Pantau progress upload dan evaluasi setiap guru secara real-time" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-muted transition-colors">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="w-full px-6 lg:px-10 py-6 border-t border-border bg-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs text-muted-foreground">E-KINERJA GURU &mdash; SD N 1 Pancor</span>
          </div>
          <p className="text-xs text-muted-foreground">Sistem Manajemen Kinerja Guru</p>
        </div>
      </footer>
    </div>
  );
}
