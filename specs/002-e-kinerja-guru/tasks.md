# Tasks: E-KINERJA GURU

**Input**: Design documents dari `/specs/002-e-kinerja-guru/`
**Branch**: `002-e-kinerja-guru`
**Stack**: Next.js 16, Prisma V7 + Neon, Better Auth, Uploadthing v7, shadcn/ui, Framer Motion
**Runtime**: Bun

**Aturan Wajib**:
- ❌ Tidak ada komentar di kode
- ✅ Selalu gunakan `bun` untuk install (bukan npm/yarn/pnpm)
- ✅ Cache semua komponen data dengan `'use cache'` + `cacheTag()`
- ✅ Gunakan `proxy.ts` — bukan `middleware.ts`
- ✅ Gunakan `updateTag` di Server Actions, `revalidateTag` di Route Handlers

## Format: `[ID] [P?] [Story] Deskripsi`

- **[P]**: Dapat dijalankan paralel (file berbeda, tidak ada dependensi)
- **[Story]**: User story yang dikerjakan (US1–US6)

---

## Phase 1: Setup (Infrastruktur Awal)

**Tujuan**: Instalasi dependency dan konfigurasi dasar yang belum ada

- [X] T001 Install dependency inti: `bun add better-auth @prisma/adapter-neon @neondatabase/serverless ws`
- [X] T002 Install Framer Motion: `bun add framer-motion`
- [X] T003 Install Uploadthing: `bun add uploadthing @uploadthing/react`
- [X] T004 [P] Install type definitions: `bun add -d @types/ws`
- [X] T005 [P] Buat file `.env` berdasarkan `.env.example` dengan variabel: `DATABASE_URL`, `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK`, `UPLOADTHING_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- [X] T006 [P] Tambahkan shadcn component yang dibutuhkan: `bunx --bun shadcn@latest add button card badge avatar dropdown-menu sidebar skeleton table dialog form input label select textarea star-rating progress`
- [X] T007 Update `next.config.ts` — tambahkan `experimental.dynamicIO: true` untuk mengaktifkan `use cache` directive dan konfigurasi `serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon']`

---

## Phase 2: Foundational (Prasyarat Blocking)

**Tujuan**: Infrastruktur inti yang HARUS selesai sebelum user story manapun bisa dikerjakan

**⚠️ CRITICAL**: Tidak ada pekerjaan user story sebelum phase ini selesai

- [X] T008 Buat Prisma singleton dengan Neon adapter di `lib/prisma.ts` — gunakan `globalThis` pattern, `PrismaNeon` dari `@prisma/adapter-neon`, `Pool` dari `@neondatabase/serverless`, set `neonConfig.webSocketConstructor = ws`
- [X] T009 Tulis Prisma schema lengkap di `prisma/schema.prisma` — definisikan model: `User` (id, name, email, username, role ENUM[ADMIN, PRINCIPAL, TEACHER], isActive, createdAt, updatedAt), `Semester` (id, name, startDate, endDate, isActive), `DocumentDeadline` (id, semesterId, documentType ENUM[RPP, SYLLABUS, LEARNING_ACHIEVEMENT, TIME_ALLOCATION, KKTP, SEMESTER_PROGRAM, ANNUAL_PROGRAM, TEACHING_JOURNAL], deadline), `DocumentSubmission` (id, teacherId, semesterId, documentType, fileUrl, fileKey, uploadedAt, status ENUM[COMPLETED, LATE, MISSING]), `Evaluation` (id, teacherId, semesterId, evaluatorId, scores Json, finalScore Float, category ENUM[A, B, C, D], createdAt, updatedAt), `EvaluationHistory` (id, evaluationId, changedById, previousScores Json, newScores Json, reason String?, changedAt)
- [X] T010 Generate Better Auth schema dengan perintah `bun x auth@latest generate` — ini akan append model `Session`, `Account`, `Verification` ke `prisma/schema.prisma`
- [X] T011 Jalankan `bun x prisma db push` untuk sinkronisasi schema ke Neon database
- [X] T012 Jalankan `bun x prisma generate` untuk generate Prisma Client
- [X] T013 Buat konfigurasi Better Auth di `lib/auth.ts` — gunakan `betterAuth()` dengan `prismaAdapter(prisma, { provider: "postgresql" })`, aktifkan plugin `username()` untuk login, plugin `admin()` dengan role `ADMIN`, `PRINCIPAL`, `TEACHER`, set `session.cookieCache.enabled: true`
- [X] T014 [P] Buat Better Auth client di `lib/auth-client.ts` — gunakan `createAuthClient()` dengan `usernameClient()`, `adminClient()` plugins, export typed `authClient`
- [X] T015 Buat route handler Better Auth di `app/api/auth/[...all]/route.ts` — gunakan `toNextJsHandler(auth.handler)` dari `better-auth/next-js`
- [X] T016 Buat `proxy.ts` di root project — export fungsi `proxy(request: Request)` yang memproteksi routes berdasarkan role: `/admin/*` hanya untuk ADMIN, `/principal/*` hanya untuk PRINCIPAL, `/teacher/*` hanya untuk TEACHER. Redirect ke `/` jika tidak terautentikasi, 403 jika role tidak sesuai. **Gunakan Node.js runtime (bukan edge)**
- [X] T017 [P] Buat helper types di `lib/types.ts` — definisikan `UserRole`, `DocumentType`, `SubmissionStatus`, `EvaluationCategory`, `DocumentTypeLabel` (map enum ke label Bahasa Indonesia)
- [X] T018 [P] Buat utility functions di `lib/utils.ts` — tambahkan `calculateFinalScore(scores: number[]): number`, `getCategory(score: number): EvaluationCategory`, `formatDate(date: Date): string`, `cn()` dari shadcn (sudah ada, pastikan terintegrasi)
- [X] T019 Buat root layout di `app/layout.tsx` — setup font Inter dari Google Fonts, global dark/light theme, metadata title "E-KINERJA GURU — SD N 1 Pancor"
- [X] T020 [P] Buat halaman login di `app/(public)/login/page.tsx` — form login dengan username + password menggunakan `authClient.signIn.username()`, tambahkan Framer Motion entrance animation, redirect ke dashboard sesuai role setelah login berhasil
- [X] T021 [P] Buat Server Action untuk auth di `lib/actions/auth.ts` — `loginAction()`, `logoutAction()` menggunakan Better Auth server-side methods, gunakan `updateTag('user-session')` setelah login/logout

**Checkpoint**: Foundation ready — semua user story bisa mulai diimplementasi

---

## Phase 3: User Story 1 — Autentikasi & Manajemen Akun (P1) 🎯 MVP

**Goal**: Semua pengguna dapat login, logout, ganti password. Admin dapat reset password.

**Independent Test**: Buat akun guru baru via Admin, login sebagai guru, ganti password, verifikasi akses dashboard sesuai role.

### Implementasi US1

- [X] T022 [P] [US1] Buat shared layout sidebar di `app/(dashboard)/layout.tsx` — sidebar dinamis berdasarkan role dengan Framer Motion slide animation, header dengan nama sekolah dan avatar user
- [X] T023 [P] [US1] Buat komponen `components/dashboard/sidebar-nav.tsx` — render menu berbeda untuk ADMIN, PRINCIPAL, TEACHER menggunakan shadcn `Sidebar`, animasi hover dengan Framer Motion
- [X] T024 [US1] Buat halaman profil user di `app/(dashboard)/profile/page.tsx` — tampilkan info user (nama, username, role), form ganti password dengan validasi konfirmasi password
- [X] T025 [US1] Buat Server Action ganti password di `lib/actions/profile.ts` — fungsi `changePasswordAction()` menggunakan Better Auth `auth.api.changePassword()`, call `updateTag('user-profile')` setelah berhasil
- [X] T026 [P] [US1] Buat komponen form ganti password di `components/forms/change-password-form.tsx` — gunakan shadcn Form, Input (type password), Button, tampilkan toast sukses/error

**Checkpoint**: User Story 1 selesai — semua role dapat login, logout, ganti password

---

## Phase 4: User Story 6 — Manajemen Pengguna oleh Admin (P2)

**Goal**: Admin dapat membuat, mengedit, menonaktifkan akun guru dan Kepala Sekolah.

**Independent Test**: Admin buka halaman manajemen pengguna, tambah guru baru, login sebagai guru baru, verifikasi berhasil masuk.

**Catatan**: US6 didahulukan sebelum US2/US3/US4 karena US2+ membutuhkan data guru yang terdaftar.

### Implementasi US6

- [X] T027 [P] [US6] Buat Server Action manajemen user di `lib/actions/users.ts` — fungsi `createUserAction()`, `updateUserAction()`, `toggleUserStatusAction()`, `resetPasswordAction()`. Setiap action call `updateTag('users-list')` setelah mutasi. Gunakan Better Auth admin API untuk `createUser` dan `setRole`.
- [X] T028 [US6] Buat halaman daftar pengguna di `app/(dashboard)/admin/users/page.tsx` — async Server Component dengan `'use cache'` + `cacheTag('users-list')`, query semua user dari Prisma, render `UsersTable`
- [X] T029 [P] [US6] Buat komponen tabel pengguna di `components/dashboard/users-table.tsx` — shadcn Table dengan kolom: Nama, Username, Role (Badge), Status (Badge aktif/nonaktif), Aksi (Edit, Reset Password, Toggle Status). Tambahkan animasi row dengan Framer Motion
- [X] T030 [US6] Buat halaman tambah pengguna di `app/(dashboard)/admin/users/new/page.tsx` — form tambah guru/kepala sekolah dengan field: nama lengkap, username (unik), password awal, role selector
- [X] T031 [P] [US6] Buat komponen form user di `components/forms/user-form.tsx` — shadcn Form, Input, Select untuk role, Button, validasi username unik via Server Action
- [X] T032 [US6] Buat halaman edit pengguna di `app/(dashboard)/admin/users/[id]/edit/page.tsx` — preload data user, form edit nama dan status aktif, konfirmasi reset password

**Checkpoint**: User Story 6 selesai — Admin dapat mengelola semua akun pengguna

---

## Phase 5: User Story 3 — Manajemen Semester & Batas Waktu (P2)

**Goal**: Admin dapat membuat semester dan menetapkan batas waktu per dokumen.

**Independent Test**: Admin buat semester baru, set 8 batas waktu dokumen, buka halaman guru, verifikasi batas waktu tampil benar.

### Implementasi US3

- [X] T033 [P] [US3] Buat Server Actions semester di `lib/actions/semesters.ts` — fungsi `createSemesterAction()`, `activateSemesterAction()` (deactivate yang lain dulu), `updateDeadlineAction()`. Setiap action call `updateTag('semesters')` + `updateTag('deadlines')`
- [X] T034 [US3] Buat halaman daftar semester di `app/(dashboard)/admin/semesters/page.tsx` — async Server Component `'use cache'` + `cacheTag('semesters')`, tampilkan daftar semester dengan status aktif/arsip
- [X] T035 [P] [US3] Buat komponen kartu semester di `components/dashboard/semester-card.tsx` — tampilkan nama, periode, status (Badge), tombol aktivasi, animasi Framer Motion
- [X] T036 [US3] Buat halaman buat semester baru di `app/(dashboard)/admin/semesters/new/page.tsx` — form nama semester, tanggal mulai, tanggal selesai
- [X] T037 [US3] Buat halaman pengaturan deadline di `app/(dashboard)/admin/semesters/[id]/deadlines/page.tsx` — tampilkan 8 dokumen dengan input DateTime per dokumen, tombol simpan semua sekaligus
- [X] T038 [P] [US3] Buat komponen form deadline di `components/forms/deadline-form.tsx` — render 8 input datetime untuk setiap DocumentType, label Bahasa Indonesia, validasi tidak boleh di masa lampau saat semester baru

**Checkpoint**: User Story 3 selesai — Semester aktif dan batas waktu sudah terkonfigurasi

---

## Phase 6: User Story 2 — Unggah Dokumen Administrasi Guru (P1)

**Goal**: Guru dapat upload 8 dokumen, lihat progress, sistem otomatis beri nilai 0 jika terlambat.

**Independent Test**: Login guru, upload satu dokumen (RPP), verifikasi status berubah jadi "Terkumpul", cek progress bar naik 1/8.

### Implementasi US2

- [X] T039 [US2] Buat Uploadthing router di `lib/uploadthing.ts` — definisikan `createUploadthing()` dari `uploadthing/next`, buat `documentUploader` endpoint yang terima PDF/DOCX max 10MB, middleware validasi user sudah login via Better Auth session
- [X] T040 [US2] Buat route handler Uploadthing di `app/api/uploadthing/route.ts` — gunakan `createRouteHandler({ router: uploadRouter, config: { token: process.env.UPLOADTHING_TOKEN } })` dari `uploadthing/next`
- [X] T041 [P] [US2] Buat Server Action submission di `lib/actions/submissions.ts` — fungsi `saveSubmissionAction(fileUrl, fileKey, documentType)` simpan ke DB, `checkAndApplyLateSubmissions()` yang cek semua dokumen melewati deadline dan set status MISSING dengan nilai 0, call `updateTag('submissions-[teacherId]')` setelah mutasi
- [X] T042 [US2] Buat halaman utama guru di `app/(Dashboard)/teacher/page.tsx` — async Server Component `'use cache'` + `cacheTag('submissions-[teacherId]')`, tampilkan grid 8 dokumen dengan status masing-masing dan progress summary
- [X] T043 [P] [US2] Buat komponen kartu dokumen di `components/dashboard/document-card.tsx` — tampilkan: nama dokumen (label Indonesia), batas waktu upload, status (Badge: Terkumpul/Belum/Terlambat), tombol upload jika belum ada atau belum lewat deadline, Framer Motion hover effect
- [X] T044 [P] [US2] Buat komponen progress bar di `components/dashboard/submission-progress.tsx` — shadcn Progress, tampilkan "X dari 8 dokumen terkumpul", animasi Framer Motion ketika nilai berubah
- [X] T045 [US2] Buat komponen Uploadthing di `components/forms/document-uploader.tsx` — gunakan `UploadButton` atau `UploadDropzone` dari `@uploadthing/react`, on-success call `saveSubmissionAction`, tampilkan loading state dan pesan sukses/error
- [X] T046 [US2] Buat background job check deadline di `app/api/cron/check-deadlines/route.ts` — Route Handler yang dipanggil periodik, jalankan `checkAndApplyLateSubmissions()`, update status MISSING untuk dokumen yang terlewat deadline

**Checkpoint**: User Story 2 selesai — Guru dapat upload dokumen, progress tampil, sistem otomatis beri nilai 0

---

## Phase 7: User Story 4 — Evaluasi Kinerja Guru (P2)

**Goal**: Admin/Kepala Sekolah beri penilaian bintang, nilai akhir terhitung otomatis, Kepala Sekolah bisa revisi.

**Independent Test**: Admin buka evaluasi guru, isi 8 rating bintang, simpan, verifikasi nilai akhir = total/8 dan kategori benar.

### Implementasi US4

- [X] T047 [P] [US4] Buat Server Action evaluasi di `lib/actions/evaluations.ts` — fungsi `upsertEvaluation(teacherId, semesterId, scores)` hitung `finalScore` dan `category` otomatis, `getEvaluationsBySemester`, `deleteEvaluation`, `getEvaluationStats`
- [X] T048 [US4] Buat halaman evaluasi di `app/(dashboard)/admin/evaluations/page.tsx` — tampilkan tabel evaluasi, statistik distribusi kategori, filter semester, form evaluasi inline
- [X] T049 [US4] Buat komponen form evaluasi di `components/dashboard/evaluation-form.tsx` — 8 aspek penilaian dengan star rating 1-5, preview nilai akhir live, kalkulasi kategori otomatis
- [X] T050 [P] [US4] Buat komponen star rating di `components/dashboard/evaluation-form.tsx` — interactive 1-5 bintang dengan hover effect
- [X] T051 [P] [US4] Buat komponen kartu nilai akhir di `components/dashboard/evaluation-form.tsx` — tampilkan: nilai akhir (format desimal), kategori (A/B/C/D) dengan warna Badge
- [X] T052 [US4] Buat halaman evaluasi untuk Kepala Sekolah di `app/(dashboard)/principal/evaluations/page.tsx` — sama dengan admin tapi tampilkan evaluasi Admin dan opsi "Revisi" atau "Beri Evaluasi Mandiri"
- [X] T053 [US4] Buat halaman revisi evaluasi di `app/(dashboard)/principal/evaluations/[teacherId]/page.tsx` — preload nilai Admin, Kepala Sekolah bisa ubah nilai, simpan menyimpan EvaluationHistory dengan `changedById`
- [X] T054 [P] [US4] Buat komponen riwayat evaluasi di `components/dashboard/evaluation-history.tsx` — tampilkan log perubahan: siapa yang evaluasi, kapan, nilai sebelum dan sesudah

**Checkpoint**: User Story 4 selesai — Sistem evaluasi bintang berfungsi penuh dengan kalkulasi otomatis

---

## Phase 8: User Story 5 — Monitoring & Dashboard Statistik (P3)

**Goal**: Admin dan Kepala Sekolah lihat statistik ringkasan kelengkapan dokumen dan hasil evaluasi.

**Independent Test**: Login Admin, buka dashboard, verifikasi tampil jumlah guru, persentase dokumen terkumpul, dan ringkasan evaluasi untuk semester aktif.

### Implementasi US5

- [X] T055 [P] [US5] Buat Server Action statistik di `lib/actions/stats.ts` — fungsi `getDashboardStats(semesterId)`: hitung total guru, persentase submission, rata-rata nilai evaluasi. Gunakan Prisma aggregate queries
- [X] T056 [US5] Buat dashboard Admin di `app/(dashboard)/admin/page.tsx` — async Server Component `'use cache'` + `cacheTag('stats')`, render grid statistik: total guru, % dokumen terkumpul, jumlah guru belum lengkap, ringkasan evaluasi
- [X] T057 [P] [US5] Buat komponen kartu statistik di `components/dashboard/stats-card.tsx` — shadcn Card dengan ikon, angka besar, label, warna berbeda per metrik, Framer Motion count-up animation
- [X] T058 [P] [US5] Buat komponen tabel monitoring guru di `components/dashboard/teacher-monitoring-table.tsx` — tampilkan nama guru, jumlah dokumen terkumpul (X/8), nilai evaluasi, status (Badge), filter per semester
- [X] T059 [US5] Buat dashboard Kepala Sekolah di `app/(dashboard)/principal/page.tsx` — identik dengan Admin tapi tanpa akses ke fungsi manajemen sistem, `'use cache'` + `cacheTag('stats')`
- [X] T060 [P] [US5] Buat komponen selector semester di `components/dashboard/semester-selector.tsx` — dropdown pilih semester termasuk arsip, trigger revalidasi tampilan saat berubah (client component)
- [X] T061 [US5] Buat halaman arsip laporan Admin di `app/(dashboard)/admin/archive/page.tsx` — filter per semester, tampilkan data historis read-only: submission dan evaluasi
- [X] T062 [US5] Buat halaman arsip laporan Kepala Sekolah di `app/(dashboard)/principal/archive/page.tsx` — identik dengan arsip Admin, read-only

**Checkpoint**: User Story 5 selesai — Dashboard monitoring real-time berfungsi

---

## Phase 9: Polish & Cross-Cutting Concerns

**Tujuan**: UX refinement, error handling, dan konsistensi antarmuka

- [X] T063 [P] Buat komponen error boundary global di `app/error.tsx` dan `app/not-found.tsx` — pesan error dan 404 dalam Bahasa Indonesia, tombol kembali ke dashboard
- [X] T064 [P] Buat loading skeleton untuk semua halaman data-heavy di `app/(dashboard)/admin/loading.tsx`, `app/(dashboard)/principal/loading.tsx`, `app/(dashboard)/teacher/loading.tsx` — gunakan shadcn Skeleton
- [X] T065 [P] Tambahkan Framer Motion page transition di `app/(dashboard)/layout.tsx` — `AnimatePresence` + `motion.div` dengan `initial`, `animate`, `exit` props untuk smooth navigasi antar halaman
- [X] T066 [P] Implementasi toast notifications di `components/providers.tsx` — tambahkan `Toaster` dari shadcn untuk feedback aksi (upload berhasil, simpan evaluasi, dll.)
- [X] T067 Pastikan semua teks antarmuka dalam Bahasa Indonesia — review semua file komponen dan pastikan tidak ada teks Inggris yang tertampil ke user
- [X] T068 [P] Optimasi caching — audit semua Server Components, pastikan `'use cache'` + `cacheTag()` diimplementasi konsisten, verifikasi `updateTag`/`revalidateTag` dipanggil setelah setiap mutasi
- [X] T069 Jalankan `bun run build` untuk validasi tidak ada type errors atau build failures, perbaiki semua error yang muncul

---

## Dependencies & Urutan Eksekusi

### Dependensi Phase

- **Phase 1** (T001–T007): Tidak ada dependensi — mulai segera
- **Phase 2** (T008–T021): Bergantung Phase 1 — **MEMBLOKIR semua user story**
- **Phase 3–8** (User Stories): Semua bergantung Phase 2
  - US1 → selesai dulu (fondasi auth component)
  - US6 → setelah US1 (butuh auth, buat data guru untuk US2)
  - US3 → setelah US6 (butuh data guru terdaftar untuk test)
  - US2 → setelah US3 (butuh semester & deadline aktif)
  - US4 → setelah US2 (butuh submission data untuk evaluasi)
  - US5 → setelah US4 (butuh semua data untuk statistik)
- **Phase 9** (Polish): Setelah semua user story selesai

### Urutan User Story

| Story | Prioritas | Bergantung Pada | Dapat Paralel Dengan |
|-------|-----------|-----------------|----------------------|
| US1 | P1 | Phase 2 | — |
| US6 | P2 | US1 | — |
| US3 | P2 | US6 | — |
| US2 | P1 | US3 | — |
| US4 | P2 | US2 | — |
| US5 | P3 | US4 | — |

### Peluang Paralel dalam Setiap Phase

- **Dalam Phase 2**: T013, T014, T017, T018 dapat berjalan paralel setelah T008–T012
- **Dalam Phase 3 (US1)**: T022, T023, T026 dapat berjalan paralel
- **Dalam Phase 4 (US6)**: T027, T031 dapat berjalan paralel
- **Dalam Phase 5 (US3)**: T033, T035, T038 dapat berjalan paralel
- **Dalam Phase 6 (US2)**: T041, T043, T044, T045 dapat berjalan paralel setelah T039–T040
- **Dalam Phase 7 (US4)**: T047, T050, T051, T054 dapat berjalan paralel
- **Dalam Phase 8 (US5)**: T055, T057, T058, T060 dapat berjalan paralel

---

## Contoh Paralel: Phase 2 (Foundation)

```
# Jalankan bersamaan (file berbeda):
T013: lib/auth.ts
T014: lib/auth-client.ts
T017: lib/types.ts
T018: lib/utils.ts
```

---

## Strategi Implementasi

### MVP Pertama (US1 + US2 Saja)

1. Selesaikan Phase 1: Setup (T001–T007)
2. Selesaikan Phase 2: Foundation (T008–T021) — **WAJIB**
3. Selesaikan Phase 3: Autentikasi (T022–T026)
4. Selesaikan Phase 4: Manajemen User (T027–T032)
5. Selesaikan Phase 5: Semester & Deadline (T033–T038)
6. Selesaikan Phase 6: Upload Dokumen (T039–T046)
7. **STOP & VALIDASI**: Guru dapat login dan upload dokumen ✓

### Pengiriman Inkremental

1. Foundation → Login system berjalan → Demo
2. + Manajemen User → Admin dapat buat akun guru → Demo
3. + Semester & Deadline → Admin dapat konfigurasi deadline → Demo
4. + Upload Dokumen → Guru dapat upload dan lihat progres → Demo (MVP!)
5. + Evaluasi → Admin/Kepala Sekolah dapat evaluasi → Demo
6. + Dashboard Statistik → Monitoring menyeluruh → Demo
7. + Polish → Produksi siap

---

## Catatan Implementasi

- `[P]` = file berbeda, tidak ada dependensi, aman dijalankan paralel
- `[US#]` = label user story untuk traceabilitas ke spec.md
- Setiap task mengacu pada file path spesifik — langsung eksekusi tanpa ambiguitas
- Selalu jalankan `bun x prisma generate` setelah mengubah `schema.prisma`
- Gunakan `bun dev` untuk development, bukan `npm run dev`
- Shadcn components: Gunakan `bunx --bun shadcn@latest add [component]`
