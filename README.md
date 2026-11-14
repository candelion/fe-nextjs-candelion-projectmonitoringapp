# Sistem Pemantauan Terpadu — Candelion Digital

Front-End Dashboard Enterprise untuk pemantauan progres fisik proyek, integrasi pagu RAB real-time, akuntabilitas PIC lapangan, dan kepatuhan dokumen kontrak.

Dibangun dengan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Lucide Icons**, dan **Recharts** berdasarkan gaya desain SaaS modern dengan estetika *iOS Glassmorphism*.

---

## 🚀 Fitur Utama & Modul Sistem

1. **Halaman Login Interaktif & Simulasi Role**:
   - Pemilihan role simulasi:
     - `Project Controller` (Diana Putri, S.T., M.M.)
     - `Auditor Head` (Budi Santoso, S.E., Ak.)
     - `PIC Lapangan` (Hendra Wijaya, S.T.)
   - State role tersimpan di `RoleContext` dan dapat diganti secara langsung melalui quick switcher di header kapan saja.

2. **Dashboard Utama & Integrasi RAB**:
   - **Hero Gradient Banner** bergaya SaaS (diadaptasi langsung dari referensi layar `IMG_4852.heic`).
   - **4-Grid KPI Summary Cards**:
     - *Total Pagu RAB*: Rp 450.000.000 (42 Pos Terdaftar, 100% Terpetakan)
     - *Kemajuan Fisik*: 86.40% (+2.40% On Track)
     - *Akuntabilitas PIC*: 4 Zona Aktif (100% Sign-off Valid)
     - *Ref Dokumen Kontrak*: KTR-2026/CND/089 (Strict Compliance)
   - **Badge "RAB Live Sync"** dengan indikator denyut hijau dan aksi sinkronisasi interaktif.
   - **Zone Grid Cards** (Kas / Setara Kas / Piutang style) lengkap dengan checklist: Prosedur Teknis SNI, Dokumen BAP & RAB, dan Sign-off PIC.

3. **Dasbor Pemantauan Progres Real-Time (`/dashboard/analytics`)**:
   - Circular Progress Gauge: **75% Selesai**.
   - Grafik batang interaktif Recharts: Perbandingan **Target Rencana vs Realisasi Aktual** per minggu kurva S.
   - **Sistem Peringatan Dini Proyek**: Panel peringatan dini dengan level Kritis, Perhatian, dan Info dengan aksi ubah status resolusi.

4. **Dokumentasi Lapangan & Geotagging (`/dashboard/dokumentasi`)**:
   - **Field Camera UI View**: Layar bidik kamera dengan frame fokus, grid 3x3, flash, dan tombol shutter interaktif.
   - **Watermark Geotagging Digital Overlay**:
     - Tanggal & Waktu: `12 Mei 2024, 14:30 WIB`
     - Koordinat: `Lat: -7.17542, Long: 106.62719`
     - Elevasi: `+42.8 mdpl` | Akurasi: `± 2.4 meter`
     - PIC Lapangan: `Hendra Wijaya, S.T.`
   - **Interactive Before / After Image Slider**: Slider komparasi foto fisik tapak awal vs progres terkini dengan drag sentuh/mouse.

5. **Site Intelligence & Peta Geospasial (`/dashboard/site-intelligence`)**:
   - Mock peta interaktif dengan switch layer (Blueprint CAD vs Citra Satelit).
   - **Status Pins Berwarna**:
     - 🟢 **Hijau (Completed)**: Zona A (100%)
     - 🟡 **Kuning (In Progress)**: Zona C (62%) & Zona D (25%)
     - 🔴 **Merah (Delayed)**: Zona B (45%)
   - Klik pin membuka *Floating Detail Drawer* zona.
   - **Bottom Summary Intelligence Bar**:
     - *Overall Progress*: **78%**
     - *Budget Utilization*: **65%**
     - *Safety Incidents*: **0 Kejadian (Zero Accident Award)**

6. **Otomasi Pembuatan Laporan (`/dashboard/laporan`)**:
   - Metrik efisiensi:
     - *Total RAB Anggaran*: **Rp 1.485.500.000**
     - *Akumulasi Dokumen*: **142 Dokumen Terbit**
     - *Efisiensi Waktu Rekap*: **38.5 Jam/Bln**
   - Tombol interaktif: **"Generate PDF Laporan"** dan **"Ekstrak RAB (.xlsx)"** dengan simulasi loading dan download toast.
   - Tabel riwayat dokumen terbit lengkap dengan filter dan aksi unduh.

---

## 🛠️ Menjalankan Aplikasi Secara Lokal

```bash
# Menjalankan server pengembangan Next.js
npm run dev

# Membuka di browser
http://localhost:3000/login
```

Untuk memverifikasi build produksi static export:
```bash
npm run build
```
Hasil build statis tersimpan di folder `out/`.
