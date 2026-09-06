# FLOWMAP SISTEM BERJALAN (MANUAL) - E-KINERJA GURU SD N 1 PANCOR
> Kondisi Saat Ini: Belum Ada Sistem Komputerisasi, Masih Manual (Kertas & Excel)

## Diagram Flowmap Sistem Berjalan

```mermaid
flowchart TB
    START([Mulai]) --> G1

    subgraph GURU [👨‍🏫 GURU]
        G1["1. Menyusun 8 Dokumen Kinerja<br/>- RPP, Silabus, CP, Alokasi Waktu<br/>- KKTP, Promes, Prota, Jurnal"]
        G1 --> G2{"Cek Kelengkapan<br/>Dokumen?"}
        G2 -->|Belum Lengkap| G1
        G2 -->|Lengkap| G3["2. Print / Fotocopy<br/>Dokumen Fisik"]
        G3 --> G4["3. Serahkan Berkas Fisik<br/>ke Tata Usaha"]
    end

    subgraph TU [📋 TATA USAHA / ADMIN]
        G4 --> TU1["4. Terima Berkas Fisik<br/>+ Cek Manual Satu per Satu"]
        TU1 --> TU2{"Berkas<br/>Lengkap?"}
        TU2 -->|Tidak Lengkap| TU3["5a. Kembalikan ke Guru<br/>+ Catat di Buku Kekurangan"]
        TU3 --> G1
        TU2 -->|Lengkap| TU4["5b. Catat di Buku Besar & Excel Manual<br/>Tanggal Terima, Nama Guru, Jenis Dokumen"]
        TU4 --> TU5["6. Beri Tanda Terima & Paraf"]
        TU5 --> TU6["7. Arsipkan di Map per Guru<br/>di Lemari Arsip"]
        TU6 --> TU7["8. Rekap di Excel<br/>Status: Ada / Terlambat / Belum Ada"]
        TU7 --> TU8["9. Teruskan Rekap + Berkas<br/>ke Kepala Sekolah"]
    end

    subgraph KEPSEK [👨‍💼 KEPALA SEKOLAH]
        TU8 --> KS1["10. Terima & Periksa Berkas Fisik"]
        KS1 --> KS2{"Verifikasi & Evaluasi<br/>Manual 1-5 per Aspek?"}
        KS2 -->|Revisi / Nilai Kurang| KS3["11a. Panggil Guru<br/>Koreksi Manual Pakai Pulpen"]
        KS3 --> G1
        KS2 -->|Setuju| KS4["11b. Beri Nilai & Kategori<br/>A/B/C/D Manual di Kertas"]
        KS4 --> KS5["12. Tanda Tangan & Stempel"]
        KS5 --> KS6["13. Kembalikan ke TU<br/>untuk Arsip Final"]
    end

    KS6 --> TU9["14. Simpan Arsip Final di Lemari<br/>+ Input Ulang Nilai ke Excel Rekap"]
    TU9 --> TU10["15. Buat Laporan Semester Manual<br/>Print untuk Dinas Pendidikan"]
    TU10 --> END([Selesai])

    %% Styling
    style START fill:#1f2937,stroke:#111827,color:#fff
    style END fill:#1f2937,stroke:#111827,color:#fff
    style GURU fill:#ecfdf5,stroke:#10b981,stroke-width:2px
    style TU fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style KEPSEK fill:#f5f3ff,stroke:#8b5cf6,stroke-width:2px
    style G2 fill:#fef3c7,stroke:#f59e0b,color:#92400e
    style TU2 fill:#fef3c7,stroke:#f59e0b,color:#92400e
    style KS2 fill:#fef3c7,stroke:#f59e0b,color:#92400e
    style TU3 fill:#fee2e2,stroke:#ef4444,color:#991b1b
    style KS3 fill:#fee2e2,stroke:#ef4444,color:#991b1b
```

### Alternatif Tampilan Swimlane Horizontal (Lebih Rapi untuk Skripsi)

```mermaid
flowchart LR
    A["GURU<br/>Susun & Print<br/>8 Dokumen"] --> B["TATA USAHA<br/>Cek & Catat di<br/>Buku Besar + Excel"]
    B --> C{"Lengkap?"}
    C -->|Tidak| A
    C -->|Ya| D["TATA USAHA<br/>Arsip Map Fisik<br/>& Rekap Excel"]
    D --> E["KEPALA SEKOLAH<br/>Verifikasi & Nilai<br/>Manual 1-5"]
    E --> F{"Setuju?"}
    F -->|Revisi| A
    F -->|Ya| G["KEPALA SEKOLAH<br/>TTD & Stempel"]
    G --> H["TATA USAHA<br/>Arsip Final &<br/>Laporan Dinas"]
```

---

## Penjelasan Alur (Narasi Flowmap)

| No | Pelaku | Proses | Dokumen / Output | Keterangan Manual |
|---|---|---|---|---|
| 1 | Guru | Menyusun 8 dokumen kinerja | File Word/Excel di Laptop Guru (belum terpusat) | Dikerjakan masing-masing, format tidak standar |
| 2 | Guru | Cetak & Fotocopy | Berkas Fisik 8 Dokumen | Boros kertas, resiko hilang |
| 3 | Guru -> TU | Penyerahan Fisik | Tanda Terima Tulisan Tangan | Antri, tidak ada bukti digital |
| 4 | TU | Pencatatan Manual | Buku Besar + File Excel di 1 Komputer | Rawan salah input, tidak realtime |
| 5 | TU | Pengarsipan | Map Plastik per Guru di Lemari | Sulit dicari, lemari penuh, rawan rusak |
| 6 | Kepsek | Penilaian Manual | Lembar Penilaian Kertas (Nilai 1-5, Kategori A-D) | Hitung manual pakai kalkulator, lama |
| 7 | Kepsek | Revisi | Coretan Pulpen di Kertas | Tidak ada history perubahan |
| 8 | TU | Laporan Akhir | Print-out Rekap Excel untuk Dinas | Harus rekap ulang tiap semester |

## Kelemahan Sistem Berjalan (Untuk Justifikasi BAB I & III Skripsi)

| Masalah | Dampak |
|---|---|
| **Tidak ada database terpusat** | Data tersebar di laptop masing-masing guru |
| **Pencatatan di buku & 1 file Excel** | Tidak bisa diakses bersamaan, tidak realtime |
| **Arsip Fisik di Lemari** | Pencarian lama, dokumen hilang/rusak karena banjir/rayap |
| **Penilaian Hitung Manual** | Rawan salah hitung rata-rata & kategori |
| **Tidak ada deadline system** | Guru sering terlambat tanpa notifikasi |
| **Tidak ada history revisi** | Tidak tau siapa mengubah nilai kapan |
| **Laporan ke Dinas Lambat** | Harus rekap manual berhari-hari |

## Simbol Flowmap yang Digunakan

- Oval = Terminator (Mulai/Selesai)
- Persegi Panjang = Proses Manual
- Belah Ketupat = Keputusan (Decision)
- Dokumen = Berkas Fisik / Print-out
- Panah = Alur Dokumen

> File ini siap dimasukkan ke BAB III Analisis Sistem Berjalan. Untuk Flowmap Sistem Usulan (Terkomputerisasi) lihat `flowchart-e-kinerja-guru.md`
