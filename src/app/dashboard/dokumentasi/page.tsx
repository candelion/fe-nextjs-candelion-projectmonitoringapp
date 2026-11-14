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
} from 'lucide-react'

export default function FieldDocumentationPage() {
  const router = useRouter()
  const { currentRole, currentUser } = useRole()
  const { evidencePhotos, setSelectedMapPointId, auditPhoto } = useTaskData()
  const isAuditor = currentRole === 'auditor_head'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPointFilter, setSelectedPointFilter] = useState('ALL')
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

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reportCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subTaskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesPoint && matchesSearch
  })

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
                isAuditor ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Camera className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isAuditor ? 'text-teal-700' : 'text-emerald-600'
              }`}
            >
              {isAuditor ? 'Pengawasan & Forensik Bukti Foto' : 'Modul Dokumentasi Lapangan'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {isAuditor
              ? 'Audit Keabsahan & Forensik Bukti Foto Lapangan'
              : 'Kamera Geotagging & Log Gambar Laporan'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAuditor
              ? 'Pemeriksaan integritas metadata GPS RTK, perimeter Telocor Sidoarjo, dan verifikasi visual kesesuaian fisik terhadap to-do PIC.'
              : 'Ambil bukti foto terverifikasi GPS, tautkan ke sub-tugas To-Do, dan arsipkan ke log gambar laporan proyek.'}
          </p>
        </div>
      </div>

      {/* Grid: Camera Viewfinder & Interactive Before/After Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CameraViewfinder onPhotoSaved={handlePhotoSaved} />
        </div>

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
              Log Gambar Dokumentasi & Laporan (Foto A, B, C...)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar seluruh foto bukti lapangan yang terhubung ke sub-tugas To-Do dan titik koordinat peta.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {filteredPhotos.length} Foto Terarsip
            </span>
          </div>
        </div>

        {/* Search & Filter Bar for Photos */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-1 border-t border-slate-100">
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

          {/* Point Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-semibold shrink-0">
              Filter Titik:
            </span>
            {['ALL', 'P-01', 'P-02', 'P-03', 'P-04'].map((pt) => (
              <button
                key={pt}
                onClick={() => setSelectedPointFilter(pt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedPointFilter === pt
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {pt === 'ALL' ? 'Semua' : pt}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group rounded-3xl overflow-hidden border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
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
                  <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {photo.title}
                  </h4>

                  {/* Linked Sub-Task */}
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold block text-[10px]">
                      Terkait Sub-Tugas To-Do:
                    </span>
                    <span className="font-bold text-indigo-700 line-clamp-1 mt-0.5">
                      {photo.subTaskTitle}
                    </span>
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
                  <span className="font-semibold text-slate-700">{photo.picName}</span>
                </div>

                {/* Button to view this specific point on map (Requirement 3 & 4) */}
                <button
                  type="button"
                  onClick={() => handleViewPointOnMap(photo.pointId)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lihat Foto di Peta {photo.pointId} ↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHOTO FULL PREVIEW MODAL ─────────────────────────────────── */}
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
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
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
                <span className="text-slate-400 block text-[11px]">Terkait Sub-Tugas To-Do:</span>
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
                        'Foto geotagging terverifikasi sah dan sesuai BAP opname Telocor.',
                        currentUser.name
                      )
                      setPreviewPhoto({
                        ...previewPhoto,
                        auditStatus: 'verified',
                        auditNotes: 'Foto geotagging terverifikasi sah dan sesuai BAP opname Telocor.',
                      })
                      setToastMessage(`✓ Foto "${previewPhoto.title}" berhasil disahkan oleh Auditor!`)
                      setTimeout(() => setToastMessage(null), 3500)
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sahkan Bukti Foto Ini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      auditPhoto(
                        previewPhoto.id,
                        'flagged',
                        'Foto perlu sudut pandang lebih jelas untuk memperlihatkan kerapatan sengkang.',
                        currentUser.name
                      )
                      setPreviewPhoto({
                        ...previewPhoto,
                        auditStatus: 'flagged',
                        auditNotes:
                          'Foto perlu sudut pandang lebih jelas untuk memperlihatkan kerapatan sengkang.',
                      })
                      setToastMessage(`⚠️ Catatan temuan audit untuk "${previewPhoto.title}" dicatat!`)
                      setTimeout(() => setToastMessage(null), 3500)
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Beri Catatan Temuan</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setPreviewPhoto(null)
                  handleViewPointOnMap(previewPhoto.pointId)
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Buka Posisi di Peta Geospasial</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
