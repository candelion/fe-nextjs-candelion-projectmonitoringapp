'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRole } from '@/contexts/RoleContext'
import { useTaskData } from '@/contexts/TaskDataContext'
import { TaskPackageItem, SubTaskItem } from '@/types'
import {
  Camera,
  ClipboardList,
  MapPin,
  CheckCircle2,
  Clock,
  HardHat,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  Building,
  Layers,
  Shield,
  Wallet,
  PenLine,
  Package,
  Send,
  Eye,
} from 'lucide-react'

export default function PicLapanganView() {
  const router = useRouter()
  const { currentUser } = useRole()
  const {
    taskPackages,
    toggleSubTask,
    setSelectedMapPointId,
    evidencePhotos,
    addEvidencePhoto,
  } = useTaskData()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'semua' | 'selesai' | 'berjalan'>('semua')
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>('pkg_kolom') // Default expanded to Kolom K4
  const [selectedSubTaskModal, setSelectedSubTaskModal] = useState<SubTaskItem | null>(null)
  const [quickModalAction, setQuickModalAction] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Quick form state for modal
  const [modalInputText, setModalInputText] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Calculate overall stats
  const allSubTasks = taskPackages.flatMap((pkg) => pkg.subTasks)
  const totalSubTasks = allSubTasks.length
  const completedSubTasks = allSubTasks.filter((st) => st.isCompleted).length
  const overallProgressPct = Math.round((completedSubTasks / totalSubTasks) * 100)

  // Redirect to site intelligence with specific point highlighted (Requirement 4)
  const handleRedirectToMapPoint = (pointId?: string) => {
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
        return { icon: Shield, bg: 'bg-emerald-600 text-white' }
      case 'wallet':
        return { icon: Wallet, bg: 'bg-teal-600 text-white' }
      default:
        return { icon: Package, bg: 'bg-purple-600 text-white' }
    }
  }

  // Filter packages
  const filteredPackages = taskPackages.filter((pkg) => {
    const matchesFilter =
      filterStatus === 'semua' ||
      (filterStatus === 'selesai' && pkg.status === 'completed') ||
      (filterStatus === 'berjalan' && pkg.status !== 'completed')

    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.subTasks.some((st) => st.title.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  // Handle action button inside subtask
  const handleSubTaskAction = (subTask: SubTaskItem) => {
    setSelectedSubTaskModal(subTask)
    setQuickModalAction(subTask.evidenceRequired)
  }

  // Submit quick evidence
  const handleSaveModalEvidence = () => {
    if (!selectedSubTaskModal) return
    toggleSubTask(selectedSubTaskModal.packageId, selectedSubTaskModal.id)
    showToast(`✓ Bukti untuk "${selectedSubTaskModal.title}" berhasil disimpan!`)
    setSelectedSubTaskModal(null)
    setQuickModalAction(null)
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Hero Banner (Inspired by IMG_4852 "Pengujian Substantif") ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 p-6 sm:p-8 text-white shadow-lg shadow-emerald-900/15">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <HardHat className="w-8 h-8 text-emerald-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                  TUGAS HARIAN PIC LAPANGAN
                </span>
                <span className="text-xs text-emerald-100 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Hari ini, 14 Nov 2026
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                Daftar Paket Pekerjaan & Sub-Tugas Lapangan 👷
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
                Pilih kategori paket pekerjaan untuk melihat rincian tahapan sub-tugas, titik koordinat peta, dan status verifikasi bukti fisik.
              </p>
            </div>
          </div>

          {/* Quick Zone Info Pill */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-xs font-semibold">
              <span>☀️ Cerah 32°C — 18 Mandor Aktif</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-950/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-400/30 text-xs font-semibold text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>Area Pengawasan: Zona B (Kolom Lt. 2)</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                Total Akumulasi Sub-Tugas: {completedSubTasks} dari {totalSubTasks} tahapan selesai
              </span>
            </span>
            <span className="text-sm font-black text-emerald-200">{overallProgressPct}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-white transition-all duration-700 ease-out"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar (Matching IMG_4852 Search Bar) ─────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Cari Kategori & Sub-Tugas Lapangan
              </h3>
              <p className="text-xs text-slate-400">
                Temukan tahapan pekerjaan, nomor titik koordinat, atau nama checklist.
              </p>
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
              placeholder="Cari nama pekerjaan atau titik..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter Status:
          </span>
          <button
            onClick={() => setFilterStatus('semua')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterStatus === 'semua'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Semua Paket ({taskPackages.length})
          </button>
          <button
            onClick={() => setFilterStatus('berjalan')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterStatus === 'berjalan'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Sedang Berjalan ({taskPackages.filter((p) => p.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilterStatus('selesai')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterStatus === 'selesai'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Selesai 100% ({taskPackages.filter((p) => p.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* ── Grid of Task Package Cards (Style directly from IMG_4852) ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Paket Pekerjaan Utama Zona B (Klik untuk Buka Sub-Tugas)
          </h2>
          <span className="text-xs text-slate-400">
            {filteredPackages.length} Paket Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredPackages.map((pkg) => {
            const { icon: Icon, bg } = getPackageIcon(pkg.iconType)
            const isCompleted = pkg.status === 'completed'
            const isExpanded = expandedPackageId === pkg.id

            return (
              <div
                key={pkg.id}
                onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                className={`group bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-lg ${
                  isExpanded
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : isCompleted
                    ? 'border-emerald-200/90 bg-emerald-50/20'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top: Icon + Status Pill */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${bg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {pkg.statusLabel}
                    </span>
                  </div>

                  {/* Title & Code */}
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {pkg.code}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug mt-0.5 truncate group-hover:text-emerald-700 transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {pkg.subtitle}
                  </p>

                  {/* Progress Bar (Exactly like IMG_4852 Kas card) */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-slate-600">Progres</span>
                      <span className="text-emerald-600 font-extrabold">{pkg.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pkg.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist preview matching screenshot: ✔ Prosedur, ✔ Dokumen */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isCompleted ? 'text-emerald-500' : 'text-emerald-500'
                        }`}
                      />
                      <span className="font-semibold text-slate-700">Prosedur Lapangan</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span
                        className={`font-semibold ${
                          isCompleted ? 'text-slate-700' : 'text-amber-700'
                        }`}
                      >
                        Bukti Foto & Geotag
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span
                        className={`font-semibold ${
                          isCompleted ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        Sign-off Otorisasi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>
                    {pkg.subTasks.filter((s) => s.isCompleted).length} dari {pkg.subTasks.length} Sub-Tugas Selesai
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl group-hover:bg-emerald-100 transition">
                    <span>{isExpanded ? 'Tutup' : 'Buka List'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── EXPANDED SUB-TASKS VIEW (Opened when card is clicked) ───────── */}
      {expandedPackageId && (() => {
        const currentPkg = taskPackages.find((p) => p.id === expandedPackageId)
        if (!currentPkg) return null

        return (
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/40 shadow-xl transition-all duration-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {currentPkg.code}
                  </span>
                  <span className="text-xs text-slate-400">Rincian Daftar Sub-Tugas</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {currentPkg.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentPkg.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {currentPkg.pointId && (
                  <button
                    onClick={() => handleRedirectToMapPoint(currentPkg.pointId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Lihat Lokasi di Peta ({currentPkg.pointId})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setExpandedPackageId(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  title="Tutup Sub-Tugas"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List of Sub-Tasks inside Expanded Package */}
            <div className="space-y-3">
              {currentPkg.subTasks.map((subTask, idx) => {
                const isDone = subTask.isCompleted

                return (
                  <div
                    key={subTask.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Checkbox + Title + Description */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox button */}
                        <button
                          onClick={() => toggleSubTask(currentPkg.id, subTask.id)}
                          className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                          title={isDone ? 'Klik untuk membatalkan' : 'Klik untuk menandai selesai'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-emerald-500" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400">
                              #{idx + 1}
                            </span>
                            <span
                              className={`text-sm font-bold leading-snug ${
                                isDone ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {subTask.title}
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                subTask.priority === 'Wajib'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : subTask.priority === 'Penting'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {subTask.priority}
                            </span>

                            {isDone && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                ✓ Selesai
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {subTask.description}
                          </p>

                          {/* Evidence Feedback if already submitted */}
                          {subTask.evidenceSubmitted && (
                            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white/80 p-2 rounded-xl border border-emerald-200 inline-flex">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{subTask.evidenceDetail || 'Bukti otentik telah terverifikasi'}</span>
                              {subTask.completedAt && (
                                <span className="text-[10px] text-slate-400 font-normal">
                                  ({subTask.completedAt})
                                </span>
                              )}
                            </div>
                          )}

                          {/* Auditor Evaluation Feedback on PIC's To-Do */}
                          {subTask.auditStatus && (
                            <div
                              className={`mt-2 flex items-start gap-2 text-xs font-semibold p-2.5 rounded-xl border ${
                                subTask.auditStatus === 'verified'
                                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                                  : subTask.auditStatus === 'flagged'
                                  ? 'bg-rose-100/70 border-rose-300 text-rose-900'
                                  : 'bg-amber-100/70 border-amber-300 text-amber-900'
                              }`}
                            >
                              {subTask.auditStatus === 'verified' ? (
                                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              ) : subTask.auditStatus === 'flagged' ? (
                                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="block font-bold">
                                  {subTask.auditStatus === 'verified'
                                    ? `✓ Disahkan oleh Auditor Head (${subTask.auditedBy || 'Budi Santoso'}):`
                                    : subTask.auditStatus === 'flagged'
                                    ? `⚠️ Catatan Temuan Auditor Head:`
                                    : '⏳ Bukti Sedang Dievaluasi Auditor Head:'}
                                </span>
                                <span className="font-normal text-[11px] block mt-0.5">
                                  {subTask.auditNotes || 'Menunggu verifikasi lapangan'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions & Requirement 4 (Lihat Titik di Peta) */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                        {/* ── REQUIREMENT 4: Redirect to Site Intelligence for tasks with coordinates ── */}
                        {subTask.hasCoordinates && subTask.pointId && (
                          <button
                            onClick={() => handleRedirectToMapPoint(subTask.pointId)}
                            title={`Buka peta dan sorot ${subTask.pointName || subTask.pointId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{subTask.pointId} • Lihat Titik di Peta ↗</span>
                          </button>
                        )}

                        {/* Evidence Action Button */}
                        {!isDone && (
                          <button
                            onClick={() => handleSubTaskAction(subTask)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            {subTask.evidenceRequired === 'foto' ? (
                              <Camera className="w-3.5 h-3.5" />
                            ) : subTask.evidenceRequired === 'ttd' ? (
                              <PenLine className="w-3.5 h-3.5" />
                            ) : (
                              <ClipboardList className="w-3.5 h-3.5" />
                            )}
                            <span>{subTask.evidenceRequired === 'foto' ? 'Ambil Foto' : 'Verifikasi Bukti'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── Bottom Summary Row: Quick Actions to Dokumentasi & Site Intelligence ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Link
          href="/dashboard/dokumentasi"
          className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                Buka Kamera Geotagging Lapangan
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Ambil foto dan tautkan langsung ke sub-tugas yang dipilih
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
        </Link>

        <Link
          href="/dashboard/site-intelligence"
          className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition">
                Buka Peta Site Intelligence
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Lihat daftar tugas per titik dan foto yang telah diunggah di tiap titik
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
        </Link>
      </div>

      {/* ── MODAL QUICK EVIDENCE VERIFICATION ─────────────────────────── */}
      {selectedSubTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Verifikasi Sub-Tugas
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                  {selectedSubTaskModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubTaskModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {selectedSubTaskModal.description}
            </p>

            {/* If task requires photo */}
            {selectedSubTaskModal.evidenceRequired === 'foto' ? (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden bg-slate-900 h-44 relative">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=600&auto=format&fit=crop&q=80"
                    alt="Preview Foto"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 px-2.5 py-1 rounded-xl text-[10px] text-emerald-300 font-mono">
                    Telocor Sidoarjo • Lat: -7.552697, Long: 112.845201
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  Foto akan disimpan dan ditautkan ke titik {selectedSubTaskModal.pointId || 'Zona B'} serta dicatat ke galeri dokumentasi.
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 block">
                  Catatan Pengawasan Lapangan
                </label>
                <textarea
                  rows={3}
                  value={modalInputText}
                  onChange={(e) => setModalInputText(e.target.value)}
                  placeholder="Tuliskan hasil pemeriksaan lapangan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedSubTaskModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveModalEvidence}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Sahkan & Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
