import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BarChart3, Shield, Clock, CheckCircle2, ArrowRight, BookOpen, Award } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              E-KINERJA GURU
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              SD N 1 Pancor
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Sistem manajemen kinerja dan administrasi guru yang modern, efisien, dan terintegrasi
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Manajemen Dokumen</CardTitle>
                <CardDescription>
                  Kelola 8 jenis dokumen administrasi pengajaran dengan mudah dan terstruktur
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Multi-Role Access</CardTitle>
                <CardDescription>
                  Akses berbeda untuk Admin, Kepala Sekolah, dan Guru sesuai kebutuhan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Evaluasi Kinerja</CardTitle>
                <CardDescription>
                  Sistem penilaian kinerja guru dengan skala bintang dan kategorisasi otomatis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Batas Waktu Dokumen</CardTitle>
                <CardDescription>
                  Pengaturan deadline per dokumen dengan monitoring kepatuhan otomatis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Keamanan Terjamin</CardTitle>
                <CardDescription>
                  Sistem autentikasi modern dengan proteksi role-based dan data terenkripsi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Arsip Semester</CardTitle>
                <CardDescription>
                  Penyimpanan data berbasis semester dengan akses arsip yang mudah
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Fitur Unggulan
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Upload Dokumen Mudah</p>
                  <p className="text-sm text-gray-600">Unggah 8 jenis dokumen dengan format yang didukung</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Monitoring Real-time</p>
                  <p className="text-sm text-gray-600">Pantau progress dan status dokumen secara langsung</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Evaluasi Otomatis</p>
                  <p className="text-sm text-gray-600">Kalkulasi nilai dan kategorisasi otomatis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Laporan Lengkap</p>
                  <p className="text-sm text-gray-600">Akses arsip dan laporan per semester</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Siap Menggunakan Sistem?
            </h2>
            <p className="text-gray-600 mb-6">
              Login untuk mengakses dashboard dan mulai mengelola kinerja guru
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/login">
                  Login ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
