'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTaskData } from '@/contexts/TaskDataContext'
import { useRole } from '@/contexts/RoleContext'
import { TaskPackageItem, SubTaskItem, TaskPriority, EvidenceType } from '@/types'
import { AVAILABLE_PICS, AVAILABLE_AUDITORS } from '@/data/dummyData'
import {
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Check,
  Clock,
  Layers,
  Building,
  Plus,
  Send,
  SlidersHorizontal,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Activity,
  FileCheck,
  LineChart,
  HardHat,
  Award,
  Wallet,
  Sparkles,
  RefreshCw,
  X,
  AlertTriangle,
  Compass,
} from 'lucide-react'

export default function CentralControllerAdminPanel() {
  const router = useRouter()
  const { currentUser, rabSyncStatus, triggerRabSync } = useRole()
  const {
    taskPackages,
    sitePoints,
    assignPersonnel,
    addTaskPackage,
    setSelectedMapPointId,
    getAuditStats,
  } = useTaskData()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterZone, setFilterZone] = useState('ALL')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal: Create New Task Package & Assign Personnel
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false)
  const [newPkgTitle, setNewPkgTitle] = useState('')
  const [newPkgCode, setNewPkgCode] = useState('')
  const [newPkgSubtitle, setNewPkgSubtitle] = useState('')
  const [newPkgPointId, setNewPkgPointId] = useState('P-01')
  const [newPkgPic, setNewPkgPic] = useState(AVAILABLE_PICS[0].name)
  const [newPkgAuditor, setNewPkgAuditor] = useState(AVAILABLE_AUDITORS[0].name)
  const [newPkgBudget, setNewPkgBudget] = useState(75000000)

  // Modal: Reassign Personnel
  const [reassignPackage, setReassignPackage] = useState<TaskPackageItem | null>(null)
  const [selectedPic, setSelectedPic] = useState('')
  const [selectedAuditor, setSelectedAuditor] = useState('')

  const stats = getAuditStats()

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handle Create New Task Package
  const handleCreatePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPkgTitle.trim() || !newPkgCode.trim()) return

    const matchedPoint = sitePoints.find((p) => p.id === newPkgPointId)

    const newPackage: TaskPackageItem = {
      id: `pkg_${Date.now()}`,
      code: newPkgCode.toUpperCase(),
      title: newPkgTitle.trim(),
      subtitle: newPkgSubtitle.trim() || 'Paket pengerjaan baru Telocor Sidoarjo',
      progress: 0,
      status: 'in_progress',
      statusLabel: 'Sedang Berjalan',
      iconType: 'building',
      color: 'bg-indigo-600 text-white',
      pointId: newPkgPointId,
      pointName: matchedPoint?.title || newPkgPointId,
      assignedPic: newPkgPic,
      assignedAuditor: newPkgAuditor,
      zoneCode: matchedPoint?.zoneCode || 'ZONA B',
      budget: newPkgBudget,
      subTasks: [
        {
          id: `sub_init_${Date.now()}`,
          packageId: `pkg_${Date.now()}`,
          packageTitle: newPkgTitle.trim(),
          title: `Pemeriksaan Awal & Opname Tapak ${newPkgTitle}`,
          description: `Pemeriksaan awal fisik dan verifikasi koordinat lokasi ${newPkgPointId} Telocor.`,
          priority: 'Wajib',
          isCompleted: false,
          hasCoordinates: true,
          pointId: newPkgPointId,
          pointName: matchedPoint?.title || newPkgPointId,
          coordinates: matchedPoint?.coordinates,
          evidenceRequired: 'form',
          evidenceSubmitted: false,
          assignedPic: newPkgPic,
          assignedAuditor: newPkgAuditor,
          auditStatus: 'pending',
        },
      ],
    }

    addTaskPackage(newPackage)
    showToast(`✓ Paket Tugas "${newPackage.title}" berhasil dibuat dan ditugaskan ke ${newPkgPic}!`)
    setIsCreatePackageOpen(false)
    setNewPkgTitle('')
    setNewPkgCode('')
    setNewPkgSubtitle('')
  }

  // Handle Reassign
  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reassignPackage) return

    assignPersonnel(reassignPackage.id, selectedPic, selectedAuditor)
    showToast(
      `✓ Penugasan "${reassignPackage.title}" diperbarui: PIC ${selectedPic} & Auditor ${selectedAuditor}`
    )
    setReassignPackage(null)
  }

  const handleOpenReassign = (pkg: TaskPackageItem) => {
    setReassignPackage(pkg)
    setSelectedPic(pkg.assignedPic || AVAILABLE_PICS[0].name)
    setSelectedAuditor(pkg.assignedAuditor || AVAILABLE_AUDITORS[0].name)
  }

  const handleGoToMapPoint = (pointId?: string) => {
    if (!pointId) return
    setSelectedMapPointId(pointId)
    router.push(`/dashboard/site-intelligence?point=${pointId}`)
  }

  // Filter packages
  const filteredPackages = taskPackages.filter((pkg) => {
    const matchesZone = filterZone === 'ALL' || pkg.zoneCode === filterZone
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.assignedPic && pkg.assignedPic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pkg.assignedAuditor && pkg.assignedAuditor.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesZone && matchesSearch
  })

  // Live HQ Activity Feed items
  const LIVE_COMMAND_LOG = [
    {
      time: '14:30 WIB',
      actor: 'Hendra Wijaya, S.T. (PIC)',
      roleBadge: 'bg-emerald-100 text-emerald-800',
      action: 'Menyelesaikan To-Do: Foto Pembesian Dermaga Kolom K4 (LAP-01)',
      target: 'Titik P-01 Telocor',
    },
    {
      time: '11:30 WIB',
      actor: 'Budi Santoso, S.E. (Auditor Head)',
      roleBadge: 'bg-teal-100 text-teal-800',
      action: 'Mencatat Catatan Temuan: Overlap sambungan Geotextile min 50cm',
      target: 'Titik P-02 Muara Porong',
    },
    {
      time: '10:00 WIB',
      actor: 'Diana Putri, S.T. (Admin Pusat)',
      roleBadge: 'bg-indigo-100 text-indigo-800',
      action: 'Menerbitkan Addendum Instruksi Pengecoran Balok Plat Jetty Zona B',
      target: 'Ref: KTR-2026/CND/089',
    },
    {
      time: '08:15 WIB',
      actor: 'Budi Santoso, S.E. (Auditor Head)',
      roleBadge: 'bg-teal-100 text-teal-800',
      action: 'Mengesahkan BAP K3: 18 Mandor Lengkap Life Vest & APD Standar SNI',
      target: 'Titik P-04 Gerbang Telocor',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-500/50 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. CENTRAL COMMAND HQ HERO BANNER ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Building className="w-7 h-7 text-indigo-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  ADMIN PUSAT • PENGENDALIAN & MONITORING PROYEK
                </span>
                <span className="text-xs text-indigo-200 flex items-center gap-1 font-mono">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Command Hub Telocor
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                Pusat Kendali Operasional & Penugasan Personel 🏛️
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-2xl leading-relaxed">
                Otoritas tertinggi pengelolaan tugas PIC Lapangan, penugasan Auditor Head, pengawasan deviasi Kurva S, dan sinkronisasi real-time integrasi RAB Telocor Sidoarjo.
              </p>
            </div>
          </div>

          {/* Quick Central Actions */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreatePackageOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Paket Tugas & Assign PIC</span>
            </button>

            <Link
              href="/dashboard/site-intelligence"
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition"
            >
              <Compass className="w-3.5 h-3.5 text-teal-300" />
              <span>Buka Site Intelligence & Buat Poligon ↗</span>
            </Link>
          </div>
        </div>

        {/* Executive Overall Progress Metric Strip */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-indigo-200/80 block text-[11px]">Kemajuan Fisik Global</span>
            <span className="text-lg font-black text-white">86.40%</span>
            <span className="text-[10px] text-emerald-300 font-bold block">+2.40% di Atas Kurva S</span>
          </div>

          <div>
            <span className="text-indigo-200/80 block text-[11px]">Total Pos RAB Diaudit</span>
            <span className="text-lg font-black text-white">Rp 450.000.000</span>
            <span className="text-[10px] text-indigo-200 font-bold block">42 Pos Anggaran Terdaftar</span>
          </div>

          <div>
            <span className="text-indigo-200/80 block text-[11px]">Personel Lapangan Aktif</span>
            <span className="text-lg font-black text-white">4 PIC & 2 Auditor</span>
            <span className="text-[10px] text-teal-300 font-bold block">100% Sign-off Valid</span>
          </div>

          <div>
            <span className="text-indigo-200/80 block text-[11px]">Status Kepatuhan KTR</span>
            <span className="text-lg font-black text-emerald-400">Strict Compliant</span>
            <span className="text-[10px] text-indigo-200 font-bold block">KTR-2026/CND/089</span>
          </div>
        </div>
      </div>

      {/* ── 2. TABEL PENGENDALIAN TUGAS, ASSIGN PIC & ASSIGN AUDITOR ──────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <UserCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Manajemen Personel & Penugasan
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Matriks Penugasan Tugas: PIC Lapangan ⇄ Auditor Head
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sebagai Admin Pusat, Anda dapat mengatur siapa PIC yang mengerjakan tugas lapangan dan siapa Auditor yang bertugas mengesahkan bukti fisiknya.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreatePackageOpen(true)}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Tugas</span>
          </button>
        </div>

        {/* Search & Zone Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-1 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari paket, PIC, auditor, atau kode..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">
              Filter Zona:
            </span>
            {['ALL', 'ZONA A', 'ZONA B', 'ZONA C', 'ZONA D'].map((z) => (
              <button
                key={z}
                onClick={() => setFilterZone(z)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterZone === z
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {z === 'ALL' ? 'Semua Zona' : z}
              </button>
            ))}
          </div>
        </div>

        {/* Task Assignment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] text-slate-400 uppercase font-black border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Paket Pekerjaan</th>
                <th className="py-3 px-4">Titik & Zona</th>
                <th className="py-3 px-4">PIC Lapangan (Pelaksana)</th>
                <th className="py-3 px-4">Auditor Head (Penilai)</th>
                <th className="py-3 px-4">Progres Fisik</th>
                <th className="py-3 px-4 text-right">Aksi Admin Pusat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/80 transition">
                  {/* Paket Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {pkg.code}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{pkg.title}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{pkg.subtitle}</span>
                      </div>
                    </div>
                  </td>

                  {/* Point & Zone */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleGoToMapPoint(pkg.pointId)}
                      className="font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>{pkg.pointId || 'P-01'}</span>
                      <span className="text-[10px] text-slate-400">({pkg.zoneCode || 'ZONA B'})</span>
                    </button>
                  </td>

                  {/* Assigned PIC */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <strong className="text-slate-800">{pkg.assignedPic || 'Hendra Wijaya, S.T.'}</strong>
                    </div>
                  </td>

                  {/* Assigned Auditor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <strong className="text-teal-900">{pkg.assignedAuditor || 'Budi Santoso, S.E., Ak.'}</strong>
                    </div>
                  </td>

                  {/* Physical Progress */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pkg.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${pkg.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11px] text-slate-800">{pkg.progress}%</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOpenReassign(pkg)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      Ganti Personel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. LIVE COMMAND ACTIVITY STREAM (ADMIN PUSAT PROGRESS FEED) ──── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Log Komando & Aktivitas Proyek Terpadu (Live Progress Feed)
              </h4>
              <p className="text-xs text-slate-400">
                Pemantauan real-time aksi penyelesaian to-do oleh PIC dan evaluasi pengesahan oleh Auditor di lapangan.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ● Real-Time Feed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {LIVE_COMMAND_LOG.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3 hover:bg-white transition"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 font-mono text-[10px] text-slate-500 font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.roleBadge}`}>
                    {item.actor}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                </div>
                <p className="font-medium text-slate-800 text-[11px] leading-snug">{item.action}</p>
                <span className="text-[10px] text-teal-700 font-semibold block mt-1">
                  Target: {item.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL CREATE TASK PACKAGE & ASSIGN PERSONEL (REQUIREMENT 1) ──── */}
      {isCreatePackageOpen && (
        <div className="fixed inset-0 z-500 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                  Admin Pusat • Otorisasi Penugasan
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-0.5">
                  Buat Paket Tugas Baru & Assign Personel
                </h3>
                <p className="text-xs text-slate-500">
                  Tetapkan PIC pelaksana dan Auditor penguji untuk paket pekerjaan baru di Telocor Sidoarjo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatePackageOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackageSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Paket Pekerjaan:</label>
                  <input
                    type="text"
                    value={newPkgTitle}
                    onChange={(e) => setNewPkgTitle(e.target.value)}
                    placeholder="Misal: Pengecoran Plat Jetty Dermaga"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Paket:</label>
                  <input
                    type="text"
                    value={newPkgCode}
                    onChange={(e) => setNewPkgCode(e.target.value)}
                    placeholder="TLC-J2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono uppercase font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan Spesifikasi Teknis:</label>
                <input
                  type="text"
                  value={newPkgSubtitle}
                  onChange={(e) => setNewPkgSubtitle(e.target.value)}
                  placeholder="Pengecekan bekisting, penulangan D16, dan selimut beton 40mm"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Titik Lokasi Telocor:</label>
                <select
                  value={newPkgPointId}
                  onChange={(e) => setNewPkgPointId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {sitePoints.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code}: {p.title} ({p.zoneCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign PIC & Auditor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assign PIC Lapangan:
                  </label>
                  <select
                    value={newPkgPic}
                    onChange={(e) => setNewPkgPic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                  >
                    {AVAILABLE_PICS.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assign Auditor Head:
                  </label>
                  <select
                    value={newPkgAuditor}
                    onChange={(e) => setNewPkgAuditor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                  >
                    {AVAILABLE_AUDITORS.map((a) => (
                      <option key={a.name} value={a.name}>
                        {a.name} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alokasi Pos Pagu RAB (Rp):
                </label>
                <input
                  type="number"
                  value={newPkgBudget}
                  onChange={(e) => setNewPkgBudget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                  step="5000000"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePackageOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Terbitkan Paket Tugas & Assign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL REASSIGN PERSONEL (PIC & AUDITOR) ──────────────────────── */}
      {reassignPackage && (
        <div className="fixed inset-0 z-500 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                  Ganti Penugasan Personel • {reassignPackage.code}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  {reassignPackage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReassignPackage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih PIC Lapangan Baru:
                </label>
                <select
                  value={selectedPic}
                  onChange={(e) => setSelectedPic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {AVAILABLE_PICS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Auditor Head Baru:
                </label>
                <select
                  value={selectedAuditor}
                  onChange={(e) => setSelectedAuditor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {AVAILABLE_AUDITORS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReassignPackage(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Simpan Perubahan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
