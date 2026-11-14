'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CameraViewfinder from '@/components/field-camera/CameraViewfinder'
import BeforeAfterSlider from '@/components/field-camera/BeforeAfterSlider'
import { FIELD_CAMERA_METADATA } from '@/data/dummyData'
import { useTaskData } from '@/contexts/TaskDataContext'
import { useRole } from '@/contexts/RoleContext'
import { EvidencePhotoItem } from '@/types'
import {
  Camera,
  CheckCircle2,
  MapPin,
  Search,
  SlidersHorizontal,
  ExternalLink,
  X,
  Clock,
  User,
  FileText,
  Eye,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Check,
  Sparkles,
} from 'lucide-react'

export default function FieldDocumentationPage() {
  const router = useRouter()
  const { currentRole, currentUser } = useRole()
  const { evidencePhotos, setSelectedMapPointId, auditPhoto, auditSubTask, taskPackages } = useTaskData()
  const isAuditor = currentRole === 'auditor_head'
  const isController = currentRole === 'project_controller'
  const isPic = currentRole === 'pic_lapangan'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPointFilter, setSelectedPointFilter] = useState('ALL')
  const [auditStatusFilter, setAuditStatusFilter] = useState<'ALL' | 'pending' | 'verified' | 'flagged'>('ALL')
  const [previewPhoto, setPreviewPhoto] = useState<EvidencePhotoItem | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handlePhotoSaved = (title: string) => {
    setToastMessage(`✓ Foto "${title}" berhasil direkam & ditautkan ke To-Do & Peta!`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleViewPointOnMap = (pointId: string) => {
    setSelectedMapPointId(pointId)
    router.push(`/dashboard/site-intelligence?point=${pointId}`)
  }

  // Filter evidence photos
  const filteredPhotos = evidencePhotos.filter((p) => {
    const matchesPoint =
      selectedPointFilter === 'ALL' || p.pointId === selectedPointFilter

    const matchesAuditStatus =
      auditStatusFilter === 'ALL' ||
      (auditStatusFilter === 'pending' && (!p.auditStatus || p.auditStatus === 'pending')) ||
      (auditStatusFilter === 'verified' && p.auditStatus === 'verified') ||
      (auditStatusFilter === 'flagged' && p.auditStatus === 'flagged')

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reportCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subTaskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesPoint && matchesAuditStatus && matchesSearch
  })

  // Quick stats
  const totalPhotos = evidencePhotos.length
  const verifiedPhotos = evidencePhotos.filter((p) => p.auditStatus === 'verified').length
  const pendingPhotos = evidencePhotos.filter((p) => !p.auditStatus || p.auditStatus === 'pending').length
  const flaggedPhotos = evidencePhotos.filter((p) => p.auditStatus === 'flagged').length

  const getHeaderBadge = () => {
    if (isAuditor) return 'Auditor Head • Forensik & Verifikasi Bukti Foto PIC'
    if (isController) return 'Project Controller • Pemantauan & Komparasi Visual Proyek'
    return 'PIC Lapangan • Pengambilan Foto Geotagging & Bukti Fisik'
  }

  const getHeaderTitle = () => {
    if (isAuditor) return 'Audit Keabsahan & Forensik Bukti Foto To-Do PIC'
    if (isController) return 'Pemantauan Visual & Komparasi Dokumentasi Lapangan'
    return 'Kamera Geotagging & Log Gambar Laporan'
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                isAuditor
                  ? 'bg-teal-50 text-teal-700'
                  : isController
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {isAuditor ? (
                <ShieldCheck className="w-4 h-4" />
              ) : isController ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isAuditor
                  ? 'text-teal-700'
                  : isController
                  ? 'text-indigo-700'
                  : 'text-emerald-600'
              }`}
            >
              {getHeaderBadge()}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {getHeaderTitle()}
          </h1>
        </div>
      </div>

      {/* Top Section: Role-Aware Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isAuditor ? (
          // ── AUDITOR FORENSIC REVIEW PANEL ─────────────────────────────────
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Panel Evaluasi Forensik Bukti PIC
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Sesi: 14 Nov 2026
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                Rekapitulasi Bukti Foto To-Do PIC
              </h3>
            </div>

            {/* 4 Stat Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Foto</span>
                <span className="text-lg font-black text-slate-900">{totalPhotos}</span>
                <span className="text-[9px] text-slate-500 block">Dari PIC</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-700 block font-semibold">Terverifikasi</span>
                <span className="text-lg font-black text-emerald-800">{verifiedPhotos}</span>
                <span className="text-[9px] text-emerald-600 block">Sah BAP</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <span className="text-[10px] text-amber-700 block font-semibold">Menunggu</span>
                <span className="text-lg font-black text-amber-800">{pendingPhotos}</span>
                <span className="text-[9px] text-amber-600 block">Perlu Action</span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                <span className="text-[10px] text-rose-700 block font-semibold">Temuan</span>
                <span className="text-lg font-black text-rose-800">{flaggedPhotos}</span>
                <span className="text-[9px] text-rose-600 block">Perlu Revisi</span>
              </div>
            </div>

            {/* Quick Action Hint */}
            <div className="p-3 rounded-2xl bg-teal-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
                <span className="text-[11px] text-teal-100 font-medium">
                  {pendingPhotos > 0
                    ? `Ada ${pendingPhotos} bukti foto yang menunggu evaluasi Anda di bawah!`
                    : 'Seluruh foto bukti PIC telah dievaluasi dengan lengkap.'}
                </span>
              </div>
              {pendingPhotos > 0 && (
                <button
                  type="button"
                  onClick={() => setAuditStatusFilter('pending')}
                  className="px-2.5 py-1 rounded-xl bg-white text-teal-900 text-[10px] font-bold hover:bg-teal-50 transition cursor-pointer"
                >
                  Review Sekarang
                </button>
              )}
            </div>
          </div>
        ) : isController ? (
          // ── PROJECT CONTROLLER EXECUTIVE MONITORING PANEL (READ ONLY, NO CAMERA) ──
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Panel Pemantauan Eksekutif • Read-Only
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Sesi: 14 Nov 2026
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-2 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                Pengawasan Visual Dokumentasi Pelaksanaan PIC
              </h3>
            </div>

            {/* 4 Stat Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Foto</span>
                <span className="text-lg font-black text-slate-900">{totalPhotos}</span>
                <span className="text-[9px] text-slate-500 block">Unggahan PIC</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-700 block font-semibold">Valid Auditor</span>
                <span className="text-lg font-black text-emerald-800">{verifiedPhotos}</span>
                <span className="text-[9px] text-emerald-600 block">Lolos BAP</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                <span className="text-[10px] text-amber-700 block font-semibold">Menunggu Audit</span>
                <span className="text-lg font-black text-amber-800">{pendingPhotos}</span>
                <span className="text-[9px] text-amber-600 block">Antrean Audit</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                <span className="text-[10px] text-indigo-700 block font-semibold">Titik Pantau</span>
                <span className="text-lg font-black text-indigo-800">4 Titik</span>
                <span className="text-[9px] text-indigo-600 block">Telocor</span>
              </div>
            </div>

            {/* Executive Badge Notification */}
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] text-slate-200 font-medium">
                  Gunakan slider di sebelah kanan untuk membandingkan tapak awal vs progres terkini.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPointFilter('ALL')}
                className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold transition cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>
        ) : (
          // ── PIC LAPANGAN ACTIVE CAMERA VIEWFINDER ──────────────────────────
          <div>
            <CameraViewfinder onPhotoSaved={handlePhotoSaved} />
          </div>
        )}

        {/* Before/After Slider: Useful for both Controller & Auditor */}
        <div>
          <BeforeAfterSlider
            beforeImage={FIELD_CAMERA_METADATA.beforeImage}
            afterImage={FIELD_CAMERA_METADATA.afterImage}
            beforeLabel="Sebelum (Tapak Awal)"
            afterLabel="Sesudah (Progres Fisik)"
          />
        </div>
      </div>

      {/* ── LOG GAMBAR DOKUMENTASI LAPANGAN (REQUIREMENT 2) ─────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              {isAuditor
                ? 'Arsip Bukti Foto PIC'
                : 'Log Gambar Dokumentasi & Laporan'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {filteredPhotos.length} Foto Terarsip
            </span>
          </div>
        </div>

        {/* Search & Filter Bar for Photos */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 pb-1 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari foto, no. laporan (misal: Laporan XXX)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Audit Status Filter & Point Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Audit Status Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAuditStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  auditStatusFilter === 'ALL'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setAuditStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  auditStatusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Review ({pendingPhotos})
              </button>
              <button
                type="button"
                onClick={() => setAuditStatusFilter('verified')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  auditStatusFilter === 'verified'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sah ({verifiedPhotos})
              </button>
            </div>

            {/* Point Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {['ALL', 'P-01', 'P-02', 'P-03', 'P-04'].map((pt) => (
                <button
                  key={pt}
                  onClick={() => setSelectedPointFilter(pt)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedPointFilter === pt
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {pt === 'ALL' ? 'Semua Titik' : pt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group rounded-3xl overflow-hidden border border-slate-200/90 bg-white hover:border-teal-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Image Viewport */}
                <div
                  onClick={() => setPreviewPhoto(photo)}
                  className="relative h-48 overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {/* Point Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" /> {photo.pointId}
                  </span>

                  {/* Report Code Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-indigo-600 text-white shadow-xs font-mono">
                    {photo.reportCode}
                  </span>

                  {/* Verified Tag / Auditor Tag */}
                  {photo.auditStatus === 'verified' ? (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" /> Lolos Audit BAP
                    </span>
                  ) : photo.auditStatus === 'flagged' ? (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                      <AlertTriangle className="w-3 h-3" /> Ada Temuan
                    </span>
                  ) : (
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-600 text-white flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3" /> Review Auditor
                    </span>
                  )}

                  {/* Hover Overlay Zoom */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                    {photo.title}
                  </h4>

                  {/* Linked Sub-Task from PIC */}
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold block text-[10px]">
                      Terkait To-Do PIC:
                    </span>
                    <span className="font-bold text-indigo-700 line-clamp-1">
                      {photo.subTaskTitle}
                    </span>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>Pengunggah:</span>
                      <strong className="text-slate-700">{photo.picName}</strong>
                    </div>
                  </div>

                  {/* Notes */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {photo.notes}
                  </p>
                </div>
              </div>

              {/* Card Footer: Timestamp, PIC & Button to Map Point */}
              <div className="p-4 pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {photo.timestamp}
                  </span>
                  <span className="font-semibold text-slate-700">{photo.pointName?.split(':')[0] || photo.pointId}</span>
                </div>

                {/* Action button: If Auditor, open review modal */}
                {isAuditor ? (
                  <button
                    type="button"
                    onClick={() => setPreviewPhoto(photo)}
                    className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>{photo.auditStatus === 'verified' ? 'Lihat Detail Audit' : 'Evaluasi Keabsahan Foto'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleViewPointOnMap(photo.pointId)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lihat Foto di Peta {photo.pointId} ↗</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHOTO FULL PREVIEW & AUDITOR ACTION MODAL ─────────────────── */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                  {previewPhoto.reportCode} • {previewPhoto.pointName}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  {previewPhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 h-72 relative border border-slate-800">
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-mono">
                Lat: {previewPhoto.coordinates.lat}, Long: {previewPhoto.coordinates.lng} • {previewPhoto.timestamp}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Terkait To-Do PIC:</span>
                <strong className="text-indigo-800 block mt-0.5">{previewPhoto.subTaskTitle}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">PIC Penanggung Jawab:</span>
                <strong className="text-slate-800 block mt-0.5">{previewPhoto.picName}</strong>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-1">Catatan Laporan Lapangan:</span>
              <p>{previewPhoto.notes}</p>
            </div>

            {/* Auditor Evaluation Section */}
            {isAuditor && (
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    Evaluasi Forensik Keabsahan Foto (Auditor Head)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-teal-800 border border-teal-200 font-bold">
                    {previewPhoto.auditStatus === 'verified'
                      ? '✓ Disahkan'
                      : previewPhoto.auditStatus === 'flagged'
                      ? '⚠️ Ada Temuan'
                      : 'Menunggu Review'}
                  </span>
                </div>
                {previewPhoto.auditNotes && (
                  <p className="text-[11px] text-teal-800 bg-white/70 p-2 rounded-xl border border-teal-100">
                    {previewPhoto.auditNotes}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      auditPhoto(
                        previewPhoto.id,
                        'verified',
                        'Foto bukti dan metadata GPS terverifikasi sah sesuai spesifikasi Proyek Telocor.',
                        currentUser.name
                      )
                      if (previewPhoto.subTaskId) {
                        for (const pkg of taskPackages) {
                          const matched = pkg.subTasks.find((st) => st.id === previewPhoto.subTaskId)
                          if (matched) {
                            auditSubTask(pkg.id, matched.id, 'verified', 'Foto bukti terverifikasi sah.', currentUser.name)
                            break
                          }
                        }
                      }
                      setToastMessage(`✓ Foto ${previewPhoto.reportCode} disahkan: Terverifikasi Sah!`)
                      setPreviewPhoto(null)
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    ✓ Sahkan Bukti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      auditPhoto(
                        previewPhoto.id,
                        'flagged',
                        'Perlu pengecekan ulang fisik di lapangan terkait kesesuaian spesifikasi.',
                        currentUser.name
                      )
                      if (previewPhoto.subTaskId) {
                        for (const pkg of taskPackages) {
                          const matched = pkg.subTasks.find((st) => st.id === previewPhoto.subTaskId)
                          if (matched) {
                            auditSubTask(pkg.id, matched.id, 'flagged', 'Catatan temuan pada foto bukti.', currentUser.name)
                            break
                          }
                        }
                      }
                      setToastMessage(`⚠️ Catatan temuan berhasil disimpan untuk ${previewPhoto.reportCode}`)
                      setPreviewPhoto(null)
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    ⚠️ Beri Catatan Temuan
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleViewPointOnMap(previewPhoto.pointId)}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" /> Lihat di Peta ({previewPhoto.pointId})
              </button>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
