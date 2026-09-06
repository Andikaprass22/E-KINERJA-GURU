# Feature Specification: E-KINERJA GURU

**Feature Branch**: `002-e-kinerja-guru`  
**Created**: 2026-05-08  
**Status**: Draft  
**Input**: User description: "E-KINERJA GURU - Sistem Manajemen Kinerja dan Administrasi Guru SD N 1 Pancor"

---

## Ringkasan Fitur

E-KINERJA GURU adalah sistem berbasis web untuk SD N 1 Pancor yang membantu mengelola dokumen administrasi pengajaran guru, memantau progress pengumpulan dokumen, serta mengevaluasi kinerja guru secara terstruktur. Sistem ini mendukung tiga peran pengguna (Admin, Kepala Sekolah, dan Guru) dengan hak akses berbeda, dan mencatat semua data berdasarkan periode semester sehingga arsip semester sebelumnya tetap tersedia.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autentikasi dan Manajemen Akun (Priority: P1)

Sebagai pengguna sistem (Admin, Kepala Sekolah, atau Guru), saya perlu masuk menggunakan kredensial pribadi dan mengelola kata sandi saya sendiri agar keamanan akun terjaga.

**Why this priority**: Autentikasi adalah fondasi dari semua fungsi sistem. Tanpa login yang aman, tidak ada peran lain yang dapat diakses.

**Independent Test**: Dapat diuji sepenuhnya dengan membuat akun guru, masuk ke sistem, lalu mengganti kata sandi — menghasilkan kontrol akses berbasis peran yang berfungsi.

**Acceptance Scenarios**:

1. **Given** pengguna berada di halaman login, **When** memasukkan username dan kata sandi yang valid, **Then** sistem mengarahkan ke dashboard sesuai perannya (Admin/Kepala Sekolah/Guru).
2. **Given** pengguna memasukkan kredensial yang salah, **When** menekan tombol masuk, **Then** sistem menampilkan pesan kesalahan dan tidak memberikan akses.
3. **Given** guru sudah masuk, **When** mengganti kata sandi dari halaman profil, **Then** kata sandi baru berlaku dan sesi aktif tetap berjalan.
4. **Given** Admin masuk, **When** mereset kata sandi guru dari panel manajemen pengguna, **Then** guru harus menggunakan kata sandi baru untuk masuk berikutnya.
5. **Given** pengguna sudah masuk, **When** mengakses halaman yang tidak sesuai perannya, **Then** sistem menampilkan pesan "akses ditolak" dan tidak menampilkan data.

---

### User Story 2 - Unggah Dokumen Administrasi Guru (Priority: P1)

Sebagai Guru, saya perlu mengunggah 8 jenis dokumen administrasi pengajaran yang dipersyaratkan sebelum batas waktu yang ditentukan Admin, agar status kelengkapan dokumen saya tercatat dalam sistem.

**Why this priority**: Fungsi inti sistem adalah manajemen dokumen guru. Fitur unggah dokumen adalah aktivitas utama guru di dalam sistem.

**Independent Test**: Dapat diuji oleh satu guru yang masuk, mengunggah satu dokumen (misal: RPP), dan melihat status dokumen berubah menjadi "sudah diunggah" di dashboard-nya.

**Acceptance Scenarios**:

1. **Given** guru sudah masuk dan semester aktif tersedia, **When** membuka halaman unggah dan memilih jenis dokumen (RPP, Silabus, dll.), **Then** sistem menampilkan formulir unggah dengan batas waktu pengumpulan untuk dokumen tersebut.
2. **Given** guru mengunggah file untuk dokumen yang belum dikumpulkan, **When** proses unggah selesai, **Then** status dokumen berubah menjadi "sudah dikumpulkan" dan timestamp pengumpulan tercatat.
3. **Given** batas waktu pengumpulan salah satu dokumen telah lewat dan guru belum mengunggahnya, **When** sistem memeriksa status, **Then** dokumen tersebut secara otomatis diberi nilai 0 dan ditandai "melewati batas waktu".
4. **Given** guru sudah mengunggah dokumen, **When** melihat dashboard progres, **Then** sistem menampilkan berapa dokumen sudah lengkap dan berapa yang masih kurang dari 8 dokumen yang dipersyaratkan.
5. **Given** guru mencoba mengunggah dokumen dengan format file yang tidak diizinkan, **When** proses unggah dilakukan, **Then** sistem menolak file dan menampilkan informasi format yang diperbolehkan.

---

### User Story 3 - Manajemen Periode Semester dan Batas Waktu (Priority: P2)

Sebagai Admin, saya perlu membuat dan mengelola periode semester serta menetapkan batas waktu pengumpulan yang berbeda untuk setiap jenis dokumen, agar sistem dapat memantau kepatuhan guru terhadap tenggat waktu.

**Why this priority**: Data semester dan batas waktu adalah prasyarat sebelum guru dapat mengunggah dokumen atau dievaluasi. Tanpa pengaturan ini sistem tidak dapat beroperasi dengan benar.

**Independent Test**: Dapat diuji oleh Admin yang membuat semester baru, menetapkan batas waktu per dokumen, dan memverifikasi bahwa halaman unggah guru menampilkan batas waktu yang benar.

**Acceptance Scenarios**:

1. **Given** Admin masuk ke panel manajemen semester, **When** membuat semester baru dengan nama dan tanggal periode, **Then** semester baru tersedia sebagai semester aktif dan semua guru dapat menggunakannya.
2. **Given** Admin memilih semester aktif, **When** menetapkan batas waktu berbeda untuk 8 jenis dokumen, **Then** setiap jenis dokumen menyimpan batas waktunya sendiri yang tampil di formulir unggah guru.
3. **Given** Admin mengubah batas waktu dokumen yang belum melewati tenggat, **When** perubahan disimpan, **Then** batas waktu baru langsung berlaku dan terlihat oleh guru.
4. **Given** periode semester telah berakhir dan semester baru dibuat, **When** Admin mengaktifkan semester baru, **Then** data semester lama tetap tersimpan dan dapat diakses sebagai arsip.

---

### User Story 4 - Evaluasi Kinerja Guru (Priority: P2)

Sebagai Admin dan Kepala Sekolah, saya perlu memberikan penilaian kinerja guru menggunakan skala bintang 1–5 untuk setiap item penilaian, agar nilai akhir kinerja guru dapat dihitung secara otomatis dan dikategorikan.

**Why this priority**: Evaluasi adalah output utama sistem yang digunakan untuk pengambilan keputusan terkait kualitas pengajaran.

**Independent Test**: Dapat diuji oleh Admin yang memberikan penilaian pada semua 8 item dokumen guru, lalu memverifikasi bahwa skor akhir terhitung otomatis dengan rumus rata-rata dan kategori yang benar.

**Acceptance Scenarios**:

1. **Given** Admin membuka halaman evaluasi untuk seorang guru, **When** memberikan rating bintang (1–5) untuk setiap item penilaian, **Then** sistem menyimpan nilai per item dan menghitung nilai akhir secara otomatis menggunakan rumus: Total Poin ÷ Jumlah Item Penilaian.
2. **Given** nilai akhir telah dihitung, **When** sistem memetakan nilai ke kategori, **Then** nilai ≥ 4.7 = A (Sangat Memuaskan), 4.0–4.6 = B (Memuaskan), 3.5–3.9 = C (Cukup Memuaskan), < 3.5 = D (Kurang Memuaskan).
3. **Given** guru tidak mengunggah dokumen sebelum batas waktu, **When** Admin membuka evaluasi, **Then** nilai dokumen tersebut otomatis tercatat sebagai 0 (nol).
4. **Given** Admin telah menyimpan evaluasi, **When** Kepala Sekolah membuka halaman evaluasi guru yang sama, **Then** Kepala Sekolah dapat melihat nilai Admin dan merevisi atau memberikan evaluasi mandiri.
5. **Given** Kepala Sekolah merevisi nilai yang diberikan Admin, **When** perubahan disimpan, **Then** riwayat perubahan tercatat beserta informasi siapa yang merevisi dan kapan.

---

### User Story 5 - Monitoring dan Dashboard Statistik (Priority: P3)

Sebagai Admin dan Kepala Sekolah, saya perlu melihat ringkasan statistik dan status pengumpulan dokumen seluruh guru melalui dashboard, agar dapat memantau kepatuhan dan kinerja secara keseluruhan.

**Why this priority**: Dashboard membantu pengambilan keputusan cepat tanpa harus memeriksa data setiap guru satu per satu.

**Independent Test**: Dapat diuji dengan melihat apakah dashboard menampilkan jumlah guru yang sudah dan belum lengkap dokumennya untuk semester aktif.

**Acceptance Scenarios**:

1. **Given** Admin masuk dan semester aktif ada, **When** membuka dashboard, **Then** sistem menampilkan: jumlah guru terdaftar, persentase dokumen yang sudah dikumpulkan, daftar guru dengan dokumen belum lengkap, dan ringkasan evaluasi.
2. **Given** Kepala Sekolah membuka dashboard, **When** melihat statistik, **Then** tampil data yang sama dengan Admin namun tanpa akses ke fungsi manajemen sistem (pengguna, batas waktu, semester).
3. **Given** Admin atau Kepala Sekolah memilih semester di arsip, **When** mengakses data arsip, **Then** data semester yang dipilih tampil lengkap termasuk dokumen yang dikumpulkan dan hasil evaluasi.

---

### User Story 6 - Manajemen Pengguna oleh Admin (Priority: P2)

Sebagai Admin, saya perlu mengelola akun pengguna (tambah, edit, hapus guru; kelola Kepala Sekolah), agar akun terdaftar selalu akurat sesuai data kepegawaian.

**Why this priority**: Manajemen pengguna memastikan hanya staf yang berwenang yang memiliki akses ke sistem.

**Independent Test**: Dapat diuji dengan Admin menambahkan akun guru baru, guru tersebut masuk dengan kredensial yang diberikan, dan berhasil mengakses dashboard guru.

**Acceptance Scenarios**:

1. **Given** Admin membuka halaman manajemen pengguna, **When** menambahkan guru baru dengan nama, username, dan kata sandi awal, **Then** akun guru tersedia dan guru dapat masuk ke sistem.
2. **Given** Admin ingin menonaktifkan guru yang sudah tidak bertugas, **When** menonaktifkan akun, **Then** guru tidak dapat masuk lagi namun data historisnya tetap tersimpan di arsip.
3. **Given** Admin mereset kata sandi guru, **When** guru mencoba masuk dengan kata sandi lama, **Then** login gagal dan guru harus menggunakan kata sandi baru.

---

### Edge Cases

- Apa yang terjadi jika Admin menetapkan batas waktu dokumen di masa lalu saat membuat semester baru?
- Bagaimana sistem menangani guru yang mencoba mengunggah ulang dokumen yang sudah dikumpulkan sebelum batas waktu?
- Apa yang terjadi jika Admin menghapus semester yang masih aktif?
- Bagaimana sistem menangani nilai akhir jika sebagian item penilaian belum diberi nilai oleh evaluator?
- Apa yang terjadi jika dua Admin memberikan evaluasi pada guru yang sama secara bersamaan?
- Bagaimana sistem menangani file dokumen yang terlalu besar saat diunggah?

---

## Requirements *(mandatory)*

### Functional Requirements

**Autentikasi & Keamanan**

- **FR-001**: Sistem HARUS menyediakan halaman login dengan form username dan kata sandi untuk semua pengguna.
- **FR-002**: Sistem HARUS membatasi akses fitur berdasarkan peran pengguna (Admin, Kepala Sekolah, Guru).
- **FR-003**: Pengguna HARUS dapat mengubah kata sandi mereka sendiri setelah masuk.
- **FR-004**: Admin HARUS dapat mereset kata sandi akun guru maupun Kepala Sekolah.
- **FR-005**: Sistem HARUS mengakhiri sesi pengguna yang tidak aktif setelah periode waktu tertentu.

**Manajemen Pengguna (Admin)**

- **FR-006**: Admin HARUS dapat membuat, mengedit, dan menonaktifkan akun guru.
- **FR-007**: Admin HARUS dapat membuat dan mengelola akun Kepala Sekolah.
- **FR-008**: Sistem HARUS memastikan username bersifat unik di seluruh sistem.
- **FR-009**: Data historis guru yang dinonaktifkan HARUS tetap tersimpan dan dapat diakses di arsip.

**Manajemen Semester & Batas Waktu (Admin)**

- **FR-010**: Admin HARUS dapat membuat periode semester baru dengan nama dan rentang tanggal.
- **FR-011**: Admin HARUS dapat menetapkan batas waktu pengumpulan yang berbeda untuk setiap dari 8 jenis dokumen per semester.
- **FR-012**: Sistem HARUS hanya memiliki satu semester aktif pada satu waktu.
- **FR-013**: Sistem HARUS menyimpan semua data semester sebelumnya sebagai arsip yang dapat diakses.
- **FR-014**: Admin HARUS dapat mengubah batas waktu dokumen selama semester masih aktif.

**Unggah Dokumen (Guru)**

- **FR-015**: Guru HARUS dapat mengunggah dokumen untuk 8 jenis dokumen berikut dalam semester aktif: RPP, Silabus, Dokumen Capaian Pembelajaran, Alokasi Waktu Pembelajaran, KKTP, Program Semester, Program Tahunan, dan Jurnal Mengajar.
- **FR-016**: Sistem HARUS menampilkan batas waktu pengumpulan untuk setiap jenis dokumen pada halaman unggah guru.
- **FR-017**: Sistem HARUS mencatat timestamp saat dokumen berhasil diunggah.
- **FR-018**: Guru HARUS dapat mengganti dokumen yang sudah diunggah selama batas waktu belum terlewati.
- **FR-019**: Sistem HARUS memberikan nilai 0 secara otomatis untuk dokumen yang tidak diunggah setelah batas waktu terlewati.
- **FR-020**: Sistem HARUS menampilkan progres pengumpulan dokumen guru (jumlah dokumen terkumpul dari total 8).

**Evaluasi Kinerja (Admin & Kepala Sekolah)**

- **FR-021**: Admin HARUS dapat memberikan penilaian bintang (1–5) untuk setiap item penilaian dokumen guru.
- **FR-022**: Sistem HARUS menghitung nilai akhir secara otomatis menggunakan rumus: Total Poin ÷ Jumlah Item Penilaian.
- **FR-023**: Sistem HARUS mengategorikan nilai akhir: A (≥ 4.7), B (4.0–4.6), C (3.5–3.9), D (< 3.5).
- **FR-024**: Kepala Sekolah HARUS dapat melihat evaluasi yang diberikan Admin dan merevisi nilai tersebut.
- **FR-025**: Kepala Sekolah HARUS dapat memberikan evaluasi mandiri terpisah dari evaluasi Admin.
- **FR-026**: Sistem HARUS menyimpan riwayat perubahan evaluasi beserta identitas evaluator dan waktu perubahan.
- **FR-027**: Dokumen yang tidak diunggah sebelum batas waktu HARUS secara otomatis mendapat nilai 0 dalam kalkulasi evaluasi.

**Dashboard & Monitoring**

- **FR-028**: Dashboard Admin HARUS menampilkan: total guru, persentase kelengkapan dokumen per semester, daftar guru dengan dokumen belum lengkap, dan ringkasan hasil evaluasi.
- **FR-029**: Dashboard Kepala Sekolah HARUS menampilkan informasi monitoring yang sama dengan Admin tetapi tanpa akses fungsi manajemen sistem.
- **FR-030**: Dashboard Guru HARUS menampilkan: status unggah setiap dokumen, progres keseluruhan, dokumen yang sudah lengkap, dan dokumen yang masih kurang.
- **FR-031**: Admin dan Kepala Sekolah HARUS dapat mengakses dan melihat data arsip semester-semester sebelumnya.

**Laporan & Arsip**

- **FR-032**: Sistem HARUS menyimpan semua data (dokumen, evaluasi, pengguna) berdasarkan periode semester.
- **FR-033**: Admin dan Kepala Sekolah HARUS dapat memfilter tampilan data berdasarkan semester.

### Key Entities

- **Pengguna (User)**: Mewakili semua pengguna sistem dengan atribut: nama lengkap, username, kata sandi (terenkripsi), peran (Admin/Kepala Sekolah/Guru), status aktif/nonaktif.
- **Semester**: Mewakili periode akademik dengan atribut: nama semester, tanggal mulai, tanggal selesai, status aktif. Berelasi dengan semua data dokumen dan evaluasi.
- **Jenis Dokumen (DocumentType)**: Daftar tetap 8 jenis dokumen administrasi yang dipersyaratkan (RPP, Silabus, Dokumen Capaian Pembelajaran, Alokasi Waktu, KKTP, Program Semester, Program Tahunan, Jurnal Mengajar).
- **Batas Waktu Dokumen (DocumentDeadline)**: Mewakili batas waktu pengumpulan spesifik untuk setiap jenis dokumen per semester. Berelasi dengan Semester dan JeniseDokumen.
- **Unggahan Dokumen (DocumentSubmission)**: Mewakili file yang diunggah guru untuk jenis dokumen tertentu dalam semester tertentu. Atribut: file, waktu unggah, status (terkumpul/terlambat). Berelasi dengan Pengguna (Guru), JenisDokumen, Semester.
- **Evaluasi (Evaluation)**: Mewakili penilaian yang diberikan evaluator untuk seorang guru per semseter. Atribut: nilai per item (1–5), nilai akhir kalkulasi, kategori (A/B/C/D), evaluator, waktu evaluasi. Berelasi dengan Pengguna (Guru), Pengguna (Evaluator), Semester.
- **Riwayat Evaluasi (EvaluationHistory)**: Menyimpan jejak perubahan nilai evaluasi beserta evaluator yang melakukan perubahan dan waktunya.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Seluruh guru dapat mengunggah dokumen dan melihat status progres mereka dalam waktu kurang dari 2 menit per sesi penggunaan.
- **SC-002**: Sistem secara otomatis menerapkan nilai 0 pada dokumen yang tidak diunggah dalam 24 jam setelah batas waktu terlewati, tanpa intervensi manual.
- **SC-003**: Nilai akhir evaluasi guru terhitung dan terkategorikan secara otomatis segera setelah evaluator menyimpan semua penilaian item.
- **SC-004**: Admin dapat membuat semester baru dan menetapkan seluruh batas waktu dokumen dalam waktu kurang dari 10 menit.
- **SC-005**: Data arsip seluruh semester sebelumnya dapat diakses Admin dan Kepala Sekolah kapan saja tanpa kehilangan data.
- **SC-006**: 100% dokumen yang diunggah oleh guru terhubung dengan semester dan periode yang benar dalam sistem.
- **SC-007**: Kepala Sekolah dapat melihat dan merevisi evaluasi Admin serta hasil revisi tersimpan dengan riwayat perubahan yang akurat.
- **SC-008**: Sistem dapat digunakan oleh semua guru SD N 1 Pancor secara bersamaan tanpa gangguan performa yang signifikan.
- **SC-009**: Semua halaman dan fitur sistem menggunakan Bahasa Indonesia sebagai bahasa antarmuka.

---

## Assumptions

- Setiap guru hanya memiliki satu set dokumen per jenis per semester (tidak ada pengumpulan ganda dalam semester yang sama).
- Terdapat tepat 8 jenis dokumen administrasi yang dipersyaratkan dan daftar ini bersifat tetap (tidak berubah antar semester).
- Admin bertanggung jawab membuat akun semua pengguna termasuk guru dan Kepala Sekolah; tidak ada pendaftaran mandiri (self-registration).
- Hanya ada satu akun Admin utama yang mengelola sistem, namun sistem dapat mendukung lebih dari satu Admin jika diperlukan di masa mendatang.
- Format file dokumen yang diterima meliputi format umum dokumen digital (PDF, DOCX, dll.) dengan batas ukuran file yang wajar.
- Kepala Sekolah tidak memiliki akses untuk memodifikasi pengaturan sistem (semester, batas waktu, manajemen pengguna) — hanya monitoring dan evaluasi.
- Semua pengguna mengakses sistem melalui peramban web modern di perangkat komputer atau laptop sekolah.
- Sistem berjalan di jaringan internal sekolah atau dapat diakses melalui internet dengan keamanan dasar (HTTPS).
- Tidak ada integrasi dengan sistem eksternal atau dinas pendidikan yang diperlukan pada tahap ini.
- Data yang sudah diarsipkan bersifat read-only dan tidak dapat dimodifikasi (hanya dapat dilihat).
- Satu semester aktif berlaku untuk semua guru secara bersamaan; tidak ada pengaturan semester berbeda per guru.
