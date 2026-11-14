'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'
import { useTaskData } from '@/contexts/TaskDataContext'
import { SubTaskItem, TaskPackageItem, EvidencePhotoItem } from '@/types'
import { ZONES_DATA } from '@/data/dummyData'
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  MapPin,
  ClipboardList,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  FileText,
  FileCheck,
  Building,
  Layers,
  Wallet,
  Package,
  Award,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react'

export default function AuditorDashboardView() {
  const router = useRouter()
  const { currentUser } = useRole()
  const {
    taskPackages,
    evidencePhotos,
    auditSubTask,
    auditPhoto,
    setSelectedMapPointId,
    getAuditStats,
  } = useTaskData()

  const [searchQuery, setSearchQuery] = useState('')
  const [auditFilter, setAuditFilter] = useState<'all' | 'pending' | 'verified' | 'flagged'>('all')
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>('pkg_kolom') // Default expanded to Kolom K4
  const [selectedAuditTask, setSelectedAuditTask] = useState<SubTaskItem | null>(null)
  const [auditDecision, setAuditDecision] = useState<'verified' | 'flagged'>('verified')
  const [auditNoteInput, setAuditNoteInput] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<EvidencePhotoItem | null>(null)

  const stats = getAuditStats()

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Open audit modal for a sub-task
  const handleOpenAuditModal = (subTask: SubTaskItem) => {
    setSelectedAuditTask(subTask)
    setAuditDecision(subTask.auditStatus === 'flagged' ? 'flagged' : 'verified')
    setAuditNoteInput(
      subTask.auditNotes ||
        `Pekerjaan ${subTask.title} telah diperiksa dan diverifikasi kesesuaiannya dengan spesifikasi teknis Proyek Telocor Sidoarjo.`
    )
  }

  // Save audit evaluation
  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAuditTask) return

    auditSubTask(
      selectedAuditTask.packageId,
      selectedAuditTask.id,
      auditDecision,
      auditNoteInput.trim() ||
        (auditDecision === 'verified'
          ? 'Terverifikasi memenuhi syarat spesifikasi SNI'
          : 'Perlu revisi opname fisik'),
      currentUser.name
    )

    // Also update photo audit if task has a photoId
    if (selectedAuditTask.photoId) {
      auditPhoto(
        selectedAuditTask.photoId,
        auditDecision,
        auditNoteInput.trim(),
        currentUser.name
      )
    }

    showToast(
      auditDecision === 'verified'
        ? `✓ Sub-Tugas "${selectedAuditTask.title}" disahkan: TERVERIFIKASI SAH!`
        : `⚠️ Catatan Temuan untuk "${selectedAuditTask.title}" berhasil dicatat!`
    )

    setSelectedAuditTask(null)
  }

  const handleRedirectToMap = (pointId?: string) => {
    if (!pointId) return
    setSelectedMapPointId(pointId)
    router.push(`/dashboard/site-intelligence?point=${pointId}`)
  }

  const getPackageIcon = (iconType: string) => {
    switch (iconType) {
      case 'building':
        return { icon: Building, bg: 'bg-indigo-600 text-white' }
      case 'layers':
        return { icon: Layers, bg: 'bg-blue-600 text-white' }
      case 'shield':
        return { icon: ShieldCheck, bg: 'bg-emerald-600 text-white' }
      case 'wallet':
        return { icon: Wallet, bg: 'bg-teal-600 text-white' }
      default:
        return { icon: Package, bg: 'bg-purple-600 text-white' }
    }
  }

  // Filter packages & sub-tasks based on search and audit status filter
  const filteredPackages = taskPackages
    .map((pkg) => {
      const filteredSubTasks = pkg.subTasks.filter((st) => {
        const matchesFilter =
          auditFilter === 'all' ||
          (auditFilter === 'pending' && st.isCompleted && (!st.auditStatus || st.auditStatus === 'pending')) ||
          (auditFilter === 'verified' && st.auditStatus === 'verified') ||
          (auditFilter === 'flagged' && st.auditStatus === 'flagged')

        const matchesSearch =
          st.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (st.pointId && st.pointId.toLowerCase().includes(searchQuery.toLowerCase())) ||
          pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.code.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesFilter && matchesSearch
      })

      return {
        ...pkg,
        subTasks: filteredSubTasks,
      }
    })
    .filter((pkg) => pkg.subTasks.length > 0)

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Auditor Hero Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-900 p-6 sm:p-8 text-white shadow-lg shadow-teal-950/20">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-teal-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  KERTAS KERJA AUDIT & EVALUASI BUKTI LAPANGAN
                </span>
                <span className="text-xs text-teal-100 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Sesi Audit: 14 Nov 2026
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Audit & Evaluasi To-Do PIC
              </h1>
            </div>
          </div>

          {/* Auditor Profile Pill */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-xs font-semibold">
              <Award className="w-4 h-4 text-teal-300" />
              <span>Auditor Head: {currentUser.name}</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-950/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-teal-400/30 text-xs font-semibold text-teal-200">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              <span>Telocor Sidoarjo — Kontrak KTR-2026/CND/089</span>
            </div>
          </div>
        </div>

        {/* Global Audit Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>
                Status Kepatuhan: {stats.verifiedCount} dari {stats.completedByPic} sub-tugas PIC terverifikasi sah ({stats.pendingAuditCount} menunggu review, {stats.flaggedCount} catatan temuan)
              </span>
            </span>
            <span className="text-sm font-black text-teal-200">{stats.compliancePct}% Lolos Audit</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-300 via-emerald-300 to-white transition-all duration-700 ease-out"
              style={{ width: `${stats.compliancePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Auditor Summary Cards (4-Grid) ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pagu RAB Diaudit */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                Pos Pagu RAB
              </span>
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rp 450.000.000
            </div>
            <p className="text-xs text-slate-500 mt-1">42 Pos Anggaran Telocor Diaudit</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold">100% Sesuai Spesifikasi</span>
            <span className="text-slate-400">Zero Mark-up</span>
          </div>
        </div>

        {/* Card 2: Kepatuhan Bukti PIC */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Kepatuhan Bukti PIC
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.compliancePct}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Standar Teknis Maritim SNI</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold">{stats.verifiedCount} Sub-Tugas Sah</span>
            <span className="text-slate-400">PIC: Hendra W.</span>
          </div>
        </div>

        {/* Card 3: Status Evaluasi To-Do */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                Menunggu Review
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
              {stats.pendingAuditCount} Sub-Tugas
            </div>
            <p className="text-xs text-slate-500 mt-1">Perlu Tanda Tangan Auditor</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-bold">Siap Diverifikasi</span>
            <span className="text-slate-400">Perlu Action</span>
          </div>
        </div>

        {/* Card 4: Catatan Temuan Audit */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                Temuan Audit
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.flaggedCount} Catatan
            </div>
            <p className="text-xs text-slate-500 mt-1">Overlap Geotextile Tanggul</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-600 font-bold">Temuan Minor (Non-Kritis)</span>
            <span className="text-slate-400">0 Fraud</span>
          </div>
        </div>
      </div>

      {/* ── MATRIKS RELEVANSI: TO-DO PIC VS OBJEK AUDIT ─────────────────── */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-teal-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-md border border-teal-500/30">
                  Korelatif & Terintegrasi
                </span>
                <span className="text-xs text-slate-300">PIC: Hendra Wijaya, S.T. ⇄ Auditor Head</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                Matriks Relevansi To-Do PIC & Objek Audit
              </h3>
            </div>
          </div>
          <span className="text-[11px] text-teal-200/80 bg-white/5 px-3 py-1 rounded-xl border border-white/10 self-start sm:self-auto">
            4 Paket Pekerjaan Telocor Terpantau
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Paket 1: Kolom K4 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                TLC-K4 (P-01)
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">2 Sah • 1 Review</span>
            </div>
            <h4 className="font-bold text-white text-xs">Struktur Dermaga Utama</h4>
            <div className="space-y-1.5 text-[11px] pt-1 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[10px]">Dikerjakan PIC Hendra:</span>
                <span className="text-slate-200 font-medium">Uji lot bekisting, pasang decking 40mm, foto pembesian LAP-01.</span>
              </div>
              <div>
                <span className="text-teal-300 block text-[10px] font-bold">Yang Diaudit Auditor:</span>
                <span className="text-teal-100 font-medium">Toleransi deviasi vertikal lot maks 3mm (SNI), selimut beton tahan sulfat.</span>
              </div>
            </div>
          </div>

          {/* Paket 2: Tanggul Muara Kali Porong */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-md">
                TLC-B2 (P-02)
              </span>
              <span className="text-[10px] text-amber-300 font-bold">1 Catatan Temuan</span>
            </div>
            <h4 className="font-bold text-white text-xs">Breakwater & Tanggul Muara</h4>
            <div className="space-y-1.5 text-[11px] pt-1 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[10px]">Dikerjakan PIC Hendra:</span>
                <span className="text-slate-200 font-medium">Pasang geotextile 250gsm, foto tetrapod, hitung opname kubikasi.</span>
              </div>
              <div>
                <span className="text-amber-300 block text-[10px] font-bold">Yang Diaudit Auditor:</span>
                <span className="text-amber-100 font-medium">Batas overlap lembaran geotextile min 50cm (Catatan Temuan Aktif).</span>
              </div>
            </div>
          </div>

          {/* Paket 3: K3 Pesisir */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                K3-TLC (P-04)
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">✓ 100% Sah</span>
            </div>
            <h4 className="font-bold text-white text-xs">Inspeksi K3 & Keselamatan</h4>
            <div className="space-y-1.5 text-[11px] pt-1 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[10px]">Dikerjakan PIC Hendra:</span>
                <span className="text-slate-200 font-medium">Periksa 18 APD & life vest, pasang rambu elevasi pasang surut air.</span>
              </div>
              <div>
                <span className="text-emerald-300 block text-[10px] font-bold">Yang Diaudit Auditor:</span>
                <span className="text-emerald-100 font-medium">Kepatuhan zero-accident pesisir, SOP pelampung darurat dermaga apung.</span>
              </div>
            </div>
          </div>

          {/* Paket 4: Logistik */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400/50 transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-md">
                LOG-TLC (P-03)
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">✓ 100% Sah</span>
            </div>
            <h4 className="font-bold text-white text-xs">Logistik & Material Pesisir</h4>
            <div className="space-y-1.5 text-[11px] pt-1 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[10px]">Dikerjakan PIC Hendra:</span>
                <span className="text-slate-200 font-medium">Verifikasi semen tahan asin, foto terpal pelindung besi, cek surat jalan.</span>
              </div>
              <div>
                <span className="text-teal-300 block text-[10px] font-bold">Yang Diaudit Auditor:</span>
                <span className="text-teal-100 font-medium">Standar penyimpanan bebas uap garam (palet 20cm), rekonsiliasi DO vs fisik.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Audit Filter Controls ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Pencarian Bukti To-Do PIC
              </h3>
            </div>
          </div>

          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tugas, titik, atau kode bukti..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
            />
          </div>
        </div>

        {/* Audit Filter Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Status Evaluasi:
          </span>
          <button
            onClick={() => setAuditFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              auditFilter === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Semua To-Do ({stats.totalSubTasks})
          </button>
          <button
            onClick={() => setAuditFilter('pending')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              auditFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Menunggu Evaluasi ({stats.pendingAuditCount})</span>
          </button>
          <button
            onClick={() => setAuditFilter('verified')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              auditFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Terverifikasi Sah ({stats.verifiedCount})</span>
          </button>
          <button
            onClick={() => setAuditFilter('flagged')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              auditFilter === 'flagged'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Catatan Temuan ({stats.flaggedCount})</span>
          </button>
        </div>
      </div>

      {/* ── Main List: Audit Review per Paket & Sub-Tugas PIC ───────────── */}
      <div className="space-y-4">
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="font-bold text-sm text-slate-700">Tidak ada sub-tugas yang sesuai filter</h4>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau status filter evaluasi audit.</p>
          </div>
        ) : (
          filteredPackages.map((pkg) => {
            const isExpanded = expandedPackageId === pkg.id
            const pkgIcon = getPackageIcon(pkg.iconType)
            const PkgIconComp = pkgIcon.icon
            const pkgVerified = pkg.subTasks.filter((t) => t.auditStatus === 'verified').length
            const pkgPending = pkg.subTasks.filter(
              (t) => t.isCompleted && (!t.auditStatus || t.auditStatus === 'pending')
            ).length
            const pkgFlagged = pkg.subTasks.filter((t) => t.auditStatus === 'flagged').length

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* Package Header Card */}
                <div
                  onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition select-none"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${pkgIcon.bg}`}
                    >
                      <PkgIconComp className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                          {pkg.code}
                        </span>
                        {pkg.pointId && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pkg.pointId}
                          </span>
                        )}
                        {pkg.status === 'completed' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ✓ Fisik 100% Selesai
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Fisik {pkg.progress}%
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{pkg.subtitle}</p>
                    </div>
                  </div>

                  {/* Right: Audit Summary Badges & Toggle */}
                  <div className="flex items-center gap-3 shrink-0 sm:self-center">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {pkgVerified > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {pkgVerified} Sah
                        </span>
                      )}
                      {pkgPending > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {pkgPending} Review
                        </span>
                      )}
                      {pkgFlagged > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {pkgFlagged} Temuan
                        </span>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Sub-Tasks List (Expanded View) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/50">
                    {pkg.subTasks.map((subTask, idx) => {
                      const isVerified = subTask.auditStatus === 'verified'
                      const isFlagged = subTask.auditStatus === 'flagged'
                      const isPending =
                        subTask.isCompleted && (!subTask.auditStatus || subTask.auditStatus === 'pending')

                      return (
                        <div
                          key={subTask.id}
                          className="p-5 sm:p-6 hover:bg-white transition duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          {/* Sub-Task Info */}
                          <div className="flex items-start gap-3.5 min-w-0">
                            {/* Number pill */}
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-900">
                                  {subTask.title}
                                </span>

                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                    subTask.priority === 'Wajib'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {subTask.priority}
                                </span>

                                {/* PIC completion status */}
                                {subTask.isCompleted ? (
                                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600" /> Selesai oleh PIC Hendra ({subTask.completedAt})
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                    Belum Disubmit PIC
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                                {subTask.description}
                              </p>

                              {/* Evidence Submitted by PIC */}
                              {subTask.evidenceSubmitted && (
                                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                                  <span className="text-[11px] font-bold text-slate-500">Bukti Fisik PIC:</span>
                                  {subTask.evidenceDetail && (
                                    <span className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs font-mono">
                                      📄 {subTask.evidenceDetail}
                                    </span>
                                  )}

                                  {subTask.hasCoordinates && subTask.pointId && (
                                    <button
                                      type="button"
                                      onClick={() => handleRedirectToMap(subTask.pointId)}
                                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 cursor-pointer"
                                    >
                                      <MapPin className="w-3 h-3 text-teal-600" />
                                      <span>{subTask.pointId} Telocor</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Auditor Evaluation Note (if already audited) */}
                              {subTask.auditNotes && (
                                <div
                                  className={`mt-2.5 p-2.5 rounded-2xl text-xs border ${
                                    isVerified
                                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                      : isFlagged
                                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      Catatan Evaluasi Auditor ({subTask.auditedBy || 'Budi Santoso'}):
                                    </span>
                                    {subTask.auditedAt && (
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {subTask.auditedAt}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] font-medium leading-snug">{subTask.auditNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Audit Status Badge & Audit Action Button */}
                          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                            {/* Current Status Badge */}
                            {isVerified && (
                              <span className="px-3 py-1.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Terverifikasi Sah</span>
                              </span>
                            )}

                            {isFlagged && (
                              <span className="px-3 py-1.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <AlertTriangle className="w-4 h-4 text-rose-600" />
                                <span>Catatan Temuan</span>
                              </span>
                            )}

                            {isPending && (
                              <span className="px-3 py-1.5 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs animate-pulse">
                                <Clock className="w-4 h-4 text-amber-700" />
                                <span>Perlu Evaluasi</span>
                              </span>
                            )}

                            {!subTask.isCompleted && (
                              <span className="px-3 py-1.5 rounded-2xl bg-slate-100 text-slate-400 text-xs font-semibold">
                                Menunggu PIC
                              </span>
                            )}

                            {/* Action Button: Opens Audit Evaluation Modal */}
                            {subTask.isCompleted && (
                              <button
                                type="button"
                                onClick={() => handleOpenAuditModal(subTask)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                                  isPending
                                    ? 'bg-teal-700 hover:bg-teal-800 text-white ring-2 ring-teal-500/30'
                                    : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>{isPending ? 'Nilai / Verifikasi Bukti' : 'Ubah Penilaian'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* ── INTERACTIVE AUDIT EVALUATION MODAL ─────────────────────────── */}
      {selectedAuditTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider font-mono">
                  Kertas Kerja Audit To-Do • {selectedAuditTask.packageTitle}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-0.5">
                  Evaluasi & Pengesahan Bukti Fisik
                </h3>
                <p className="text-xs text-slate-500">{selectedAuditTask.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAuditTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Details from PIC */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span>Pelaksana Lapangan:</span>
                <strong className="text-slate-800">Hendra Wijaya, S.T. (PIC Lapangan)</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Waktu Penyelesaian:</span>
                <strong className="text-slate-800">{selectedAuditTask.completedAt || '14 Nov 2026'}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Lokasi Titik Geotagging:</span>
                <strong className="text-teal-700">{selectedAuditTask.pointName || 'Telocor Sidoarjo'}</strong>
              </div>

              {selectedAuditTask.evidenceDetail && (
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bukti Terlampir PIC:</span>
                  <span className="text-slate-800 font-mono font-semibold block mt-0.5">
                    {selectedAuditTask.evidenceDetail}
                  </span>
                </div>
              )}
            </div>

            {/* If task has photo, show preview */}
            {selectedAuditTask.photoId && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 relative h-36 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=800&auto=format&fit=crop&q=80"
                  alt="Bukti Foto PIC"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/75 px-2.5 py-1 rounded-xl text-white text-[10px] font-mono">
                  📍 Telocor Sidoarjo (Lat: -7.552697, Long: 112.845201)
                </div>
              </div>
            )}

            {/* Audit Decision Form */}
            <form onSubmit={handleSaveAudit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Keputusan Kepatuhan Auditor Head:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAuditDecision('verified')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      auditDecision === 'verified'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs">✓ Sah (Verified)</span>
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          auditDecision === 'verified' ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Memenuhi spesifikasi teknis SNI & BAP valid.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuditDecision('flagged')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                      auditDecision === 'flagged'
                        ? 'border-rose-500 bg-rose-50/80 text-rose-900 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs">⚠️ Catatan Temuan</span>
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          auditDecision === 'flagged' ? 'text-rose-600' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Terdapat deviasi, perlu revisi atau klarifikasi PIC.
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Catatan Evaluasi & Rekomendasi Auditor:
                </label>
                <textarea
                  rows={3}
                  value={auditNoteInput}
                  onChange={(e) => setAuditNoteInput(e.target.value)}
                  placeholder="Tuliskan catatan teknis hasil pemeriksaan opname fisik dan bukti foto..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAuditTask(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-700/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simpan & Bubuhkan Tanda Tangan Digital</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bottom Section: Kepatuhan Poligon Zona Telocor Sidoarjo ─────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              Kepatuhan Audit Zona & Titik Geospasial Telocor Sidoarjo
            </h3>
            <p className="text-xs text-slate-500">
              Verifikasi keabsahan perimeter poligon dermaga dan akuntabilitas pelaksana per zona kerja.
            </p>
          </div>
          <Link
            href="/dashboard/site-intelligence"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition"
          >
            <span>Buka Peta Geospasial</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ZONES_DATA.map((zone) => (
            <div
              key={zone.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xs transition duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-[10px] uppercase text-teal-800 font-mono">
                    {zone.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    BAP Sah
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">
                  {zone.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{zone.subtitle}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">PIC: <strong>{zone.pic.split(',')[0]}</strong></span>
                <span className="text-teal-700 font-bold">Fisik {zone.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

