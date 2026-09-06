# Flowchart E-Kinerja Guru - SD N 1 Pancor

## 1. Flowchart Utama (Autentikasi & Navigasi Role)

```mermaid
flowchart TB
    START["User Membuka Aplikasi"] --> LOGIN["Halaman Login"]
    LOGIN --> INPUT["Input Username & Password"]
    INPUT --> AUTH{"Autentikasi Berhasil?"}
    AUTH -->|Gagal| ERROR["Tampilkan Error Message"]
    ERROR --> LOGIN
    AUTH -->|Berhasil| CHECK_ROLE{"Cek Role User"}

    CHECK_ROLE -->|ADMIN| ADMIN_DASH["Dashboard Admin"]
    CHECK_ROLE -->|PRINCIPAL| PRINCIPAL_DASH["Dashboard Kepala Sekolah"]
    CHECK_ROLE -->|TEACHER| TEACHER_DASH["Dashboard Guru"]

    ADMIN_DASH --> A1["Kelola User"]
    ADMIN_DASH --> A2["Kelola Semester"]
    ADMIN_DASH --> A3["Evaluasi Kinerja"]
    ADMIN_DASH --> A4["Monitoring Submissions"]
    ADMIN_DASH --> A5["Arsip Laporan"]

    PRINCIPAL_DASH --> P1["Review Evaluasi"]
    PRINCIPAL_DASH --> P2["Revisi Evaluasi"]
    PRINCIPAL_DASH --> P3["Arsip Laporan"]

    TEACHER_DASH --> T1["Lihat Status Dokumen"]
    TEACHER_DASH --> T2["Upload Dokumen"]
    TEACHER_DASH --> T3["Lihat Progress"]

    style START fill:#6366f1,stroke:#4f46e5,color:#fff
    style LOGIN fill:#818cf8,stroke:#6366f1,color:#fff
    style AUTH fill:#f59e0b,stroke:#d97706,color:#fff
    style CHECK_ROLE fill:#f59e0b,stroke:#d97706,color:#fff
    style ADMIN_DASH fill:#6366f1,stroke:#4f46e5,color:#fff
    style PRINCIPAL_DASH fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style TEACHER_DASH fill:#10b981,stroke:#059669,color:#fff
```

## 2. Flowchart Admin

```mermaid
flowchart TB
    ADMIN_START["Admin Login"] --> ADMIN_DASH["Dashboard Admin"]

    ADMIN_DASH --> STATS["Statistik Dashboard"]
    STATS --> S1["Total Guru Terdaftar"]
    STATS --> S2["Persentase Dokumen Terkumpul"]
    STATS --> S3["Rata-rata Nilai Evaluasi"]
    STATS --> S4["Jumlah Evaluasi Selesai"]

    ADMIN_DASH --> SEMESTER_SELECT["Pilih Semester"]

    ADMIN_DASH --> U1["Manajemen User"]
    U1 --> U2["Lihat Daftar Guru"]
    U2 --> U3{"Aksi?"}
    U3 -->|Tambah| U4["Form Tambah User Baru"]
    U3 -->|Edit| U5["Form Edit User"]
    U3 -->|Nonaktifkan| U6["Update Status isActive"]

    ADMIN_DASH --> SM1["Manajemen Semester"]
    SM1 --> SM2["Lihat Daftar Semester"]
    SM2 --> SM3{"Aksi?"}
    SM3 -->|Tambah| SM4["Form Tambah Semester"]
    SM3 -->|Set Aktif| SM5["Toggle isActive Semester"]
    SM3 -->|Kelola Deadline| SM6["Atur Deadline per Dokumen"]

    ADMIN_DASH --> E1["Evaluasi Kinerja"]
    E1 --> E2["Lihat Daftar Evaluasi"]
    E2 --> E3{"Aksi?"}
    E3 -->|Tambah| E4["Pilih Guru & Beri Nilai 1-5"]
    E4 --> E5["Hitung Nilai Akhir"]
    E5 --> E6{"Kategori?"}
    E6 -->|4.56-5.00| E7["A - Sangat Baik"]
    E6 -->|3.00-4.50| E8["B - Baik"]
    E6 -->|2.00-2.99| E9["C - Cukup"]
    E6 -->|1.00-1.99| E10["D - Kurang"]
    E3 -->|Edit| E12["Update Evaluasi"]
    E3 -->|Hapus| E13["Hapus Evaluasi"]

    ADMIN_DASH --> SUB1["Monitoring Submissions"]
    SUB1 --> SUB2["Tabel Monitoring Semua Guru"]
    SUB2 --> SUB3["Status: COMPLETED / LATE / MISSING"]

    ADMIN_DASH --> AR1["Arsip Laporan"]
    AR1 --> AR2["Filter per Semester"]
    AR2 --> AR3["Rekap Evaluasi & Dokumen"]

    style ADMIN_START fill:#6366f1,stroke:#4f46e5,color:#fff
    style ADMIN_DASH fill:#6366f1,stroke:#4f46e5,color:#fff
    style E7 fill:#10b981,stroke:#059669,color:#fff
    style E8 fill:#3b82f6,stroke:#2563eb,color:#fff
    style E9 fill:#f59e0b,stroke:#d97706,color:#fff
    style E10 fill:#ef4444,stroke:#dc2626,color:#fff
```

## 3. Flowchart Kepala Sekolah (Principal)

```mermaid
flowchart TB
    PRINC_START["Kepala Sekolah Login"] --> PRINC_DASH["Dashboard Kepala Sekolah"]

    PRINC_DASH --> STATS["Statistik Dashboard"]
    STATS --> S1["Total Guru Terdaftar"]
    STATS --> S2["Persentase Dokumen Terkumpul"]
    STATS --> S3["Rata-rata Nilai Evaluasi"]
    STATS --> S4["Jumlah Evaluasi Selesai"]

    PRINC_DASH --> SEMESTER_SELECT["Pilih Semester"]
    PRINC_DASH --> MONITORING["Tabel Monitoring Guru"]

    PRINC_DASH --> E1["Review & Revisi Evaluasi"]
    E1 --> E2["Lihat Daftar Evaluasi"]
    E2 --> E3["Pilih Evaluasi"]
    E3 --> E4{"Aksi?"}
    E4 -->|Revisi| E5["Buka Form Revisi"]
    E5 --> E6["Ubah Nilai 1-5"]
    E6 --> E7["Simpan Perubahan"]
    E7 --> E8["Catat di EvaluationHistory"]
    E4 -->|Lihat Riwayat| E9["Dialog Riwayat Revisi"]
    E9 --> E10["Tampilkan Siapa & Kapan Diubah"]

    PRINC_DASH --> AR1["Arsip Laporan"]
    AR1 --> AR2["Filter per Semester"]
    AR2 --> AR3["Rekap Evaluasi & Dokumen"]

    style PRINC_START fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style PRINC_DASH fill:#8b5cf6,stroke:#7c3aed,color:#fff
```

## 4. Flowchart Guru (Teacher)

```mermaid
flowchart TB
    TEACHER_START["Guru Login"] --> TEACHER_DASH["Dashboard Guru"]

    TEACHER_DASH --> CHECK_SEMESTER{"Ada Semester Aktif?"}
    CHECK_SEMESTER -->|Tidak| NO_SEMESTER["Tampilkan Pesan: Hubungi Admin"]
    CHECK_SEMESTER -->|Ya| SHOW_DASHBOARD["Tampilkan Dashboard"]

    SHOW_DASHBOARD --> STATS["Statistik Guru"]
    STATS --> S1["Dokumen Terkumpul: X/8"]
    STATS --> S2["Progress Kelengkapan: X%"]
    STATS --> S3["Deadline Terdekat: X Hari"]
    STATS --> S4["Dokumen Terlambat: X"]

    SHOW_DASHBOARD --> PROGRESS["Progress Bar Kelengkapan"]

    SHOW_DASHBOARD --> DOC_LIST["Daftar 8 Jenis Dokumen"]

    DOC_LIST --> D1["RPP"]
    DOC_LIST --> D2["Syllabus"]
    DOC_LIST --> D3["Capaian Pembelajaran"]
    DOC_LIST --> D4["Alokasi Waktu"]
    DOC_LIST --> D5["KKTP"]
    DOC_LIST --> D6["Program Semester"]
    DOC_LIST --> D7["Program Tahunan"]
    DOC_LIST --> D8["Jurnal Mengajar"]

    D1 --> DA1{"Status?"}
    D2 --> DA1
    D3 --> DA1
    D4 --> DA1
    D5 --> DA1
    D6 --> DA1
    D7 --> DA1
    D8 --> DA1

    DA1 -->|MISSING| DA2["Upload File"]
    DA1 -->|COMPLETED| DA3["Sudah Terkumpul"]
    DA1 -->|LATE| DA4["Upload File Terlambat"]
    DA2 --> DA5["Simpan ke Database"]
    DA4 --> DA5
    DA5 --> DA6["Update Status COMPLETED/LATE"]

    style TEACHER_START fill:#10b981,stroke:#059669,color:#fff
    style TEACHER_DASH fill:#10b981,stroke:#059669,color:#fff
    style NO_SEMESTER fill:#ef4444,stroke:#dc2626,color:#fff
    style D1 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D2 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D3 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D4 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D5 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D6 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D7 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
    style D8 fill:#e0e7ff,stroke:#6366f1,color:#1e1b4b
```

## 5. Flowchart Proses Evaluasi (End-to-End)

```mermaid
flowchart LR
    A1["Buat Semester"] --> A2["Atur Deadline Dokumen"]
    A2 --> A3["Monitoring Upload Guru"]
    A3 --> A4["Buat Evaluasi Guru"]
    A4 --> A5["Berikan Nilai 1-5 per Aspek"]
    A5 --> A6["Hitung Nilai Akhir & Kategori"]

    A6 --> P1["Review Evaluasi"]
    P1 --> P2{"Setuju?"}
    P2 -->|Ya| P3["Simpan"]
    P2 -->|Tidak| P4["Revisi Nilai"]
    P4 --> P5["Catat Riwayat Perubahan"]

    T1["Login ke Dashboard"] --> T2["Lihat Status Dokumen"]
    T2 --> T3["Upload Dokumen"]
    T3 --> T4["Lihat Hasil Evaluasi"]

    A1 --> DB1[("Semester")]
    A2 --> DB2[("DocumentDeadline")]
    A3 --> DB3[("DocumentSubmission")]
    A6 --> DB4[("Evaluation")]
    P4 --> DB4
    P5 --> DB5[("EvaluationHistory")]
    T3 --> DB3

    style A1 fill:#6366f1,stroke:#4f46e5,color:#fff
    style A2 fill:#6366f1,stroke:#4f46e5,color:#fff
    style A3 fill:#6366f1,stroke:#4f46e5,color:#fff
    style A4 fill:#6366f1,stroke:#4f46e5,color:#fff
    style A5 fill:#6366f1,stroke:#4f46e5,color:#fff
    style A6 fill:#6366f1,stroke:#4f46e5,color:#fff
    style P1 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style P2 fill:#f59e0b,stroke:#d97706,color:#fff
    style P3 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style P4 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style P5 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style T1 fill:#10b981,stroke:#059669,color:#fff
    style T2 fill:#10b981,stroke:#059669,color:#fff
    style T3 fill:#10b981,stroke:#059669,color:#fff
    style T4 fill:#10b981,stroke:#059669,color:#fff
```

## 6. Flowchart Database Schema (ERD)

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UK
        string username UK
        string role
        boolean isActive
        datetime createdAt
    }

    Semester {
        string id PK
        string name
        datetime startDate
        datetime endDate
        boolean isActive
    }

    DocumentDeadline {
        string id PK
        string semesterId FK
        string documentType
        datetime deadline
    }

    DocumentSubmission {
        string id PK
        string teacherId FK
        string semesterId FK
        string documentType
        string fileUrl
        string status
        datetime uploadedAt
    }

    Evaluation {
        string id PK
        string teacherId FK
        string semesterId FK
        string evaluatorId FK
        float finalScore
        string category
    }

    EvaluationHistory {
        string id PK
        string evaluationId FK
        string changedById FK
        string userId FK
        string reason
        datetime changedAt
    }

    User ||--o{ session : "has"
    User ||--o{ account : "has"
    User ||--o{ DocumentSubmission : "submits"
    User ||--o{ Evaluation : "evaluated_as_teacher"
    User ||--o{ Evaluation : "evaluates_as_evaluator"
    User ||--o{ EvaluationHistory : "changed_by"
    User ||--o{ EvaluationHistory : "history_for"
    Semester ||--o{ DocumentDeadline : "has"
    Semester ||--o{ DocumentSubmission : "has"
    Semester ||--o{ Evaluation : "has"
    Evaluation ||--o{ EvaluationHistory : "has"
```

## 7. Flowchart Kategori Evaluasi (Penilaian)

```mermaid
flowchart TD
    START["Mulai Evaluasi"] --> SELECT["Pilih Guru"]
    SELECT --> SCORE["Berikan Nilai 1-5"]

    SCORE --> A1["RPP"]
    SCORE --> A2["Syllabus"]
    SCORE --> A3["Capaian Pembelajaran"]
    SCORE --> A4["Alokasi Waktu"]
    SCORE --> A5["KKTP"]
    SCORE --> A6["Program Semester"]
    SCORE --> A7["Program Tahunan"]
    SCORE --> A8["Jurnal Mengajar"]

    A1 --> CALC
    A2 --> CALC
    A3 --> CALC
    A4 --> CALC
    A5 --> CALC
    A6 --> CALC
    A7 --> CALC
    A8 --> CALC

    CALC["Hitung Nilai Akhir - Rata-rata 8 Aspek"] --> CATEGORY{"Kategori?"}
    CATEGORY -->|4.56 - 5.00| A_CAT["A - Sangat Baik"]
    CATEGORY -->|3.00 - 4.50| B_CAT["B - Baik"]
    CATEGORY -->|2.00 - 2.99| C_CAT["C - Cukup"]
    CATEGORY -->|1.00 - 1.99| D_CAT["D - Kurang"]

    A_CAT --> SAVE["Simpan ke Database"]
    B_CAT --> SAVE
    C_CAT --> SAVE
    D_CAT --> SAVE

    SAVE --> REVIEW{"Kepala Sekolah Review?"}
    REVIEW -->|Setuju| DONE["Evaluasi Final"]
    REVIEW -->|Revisi| REVISE["Ubah Nilai"]
    REVISE --> HISTORY["Catat di EvaluationHistory"]
    HISTORY --> SAVE

    style START fill:#6366f1,stroke:#4f46e5,color:#fff
    style A_CAT fill:#10b981,stroke:#059669,color:#fff
    style B_CAT fill:#3b82f6,stroke:#2563eb,color:#fff
    style C_CAT fill:#f59e0b,stroke:#d97706,color:#fff
    style D_CAT fill:#ef4444,stroke:#dc2626,color:#fff
    style DONE fill:#6366f1,stroke:#4f46e5,color:#fff
```

---

**Keterangan Warna:**
- **Indigo** = Proses Admin
- **Violet** = Proses Kepala Sekolah
- **Emerald** = Proses Guru
- **Amber** = Keputusan/Kondisi
- **Merah** = Error/Status Kritis
- **Biru** = Kategori Baik
