# UI Contract: Layout & Navigation

## Global Navigation
- **Header**: Contains Logo "E-KINERJA GURU", Active Semester display, and User Account dropdown.
- **Sidebar**: Dynamic content based on `User.role`.

## Role-Based Sidebar Items

### Admin
- Statistik & Monitoring (Dashboard)
- Kelola Guru/Staf
- Pengaturan Semester
- Pengaturan Deadline
- Arsip Laporan

### Principal
- Statistik Sekolah (Dashboard)
- Monitor Dokumen Guru
- Review Evaluasi Admin
- Arsip Laporan

### Teacher
- Dashboard Progres
- Upload Dokumen
- Riwayat Pengumpulan

## Performance Contract
- **Navigation**: Uses Framer Motion transitions (fade/slide) between dashboard views.
- **Data Loading**: Skeleton loaders for all cards fetching data via `use cache`.
- **Active State**: Navigation items highlight based on route patterns.
