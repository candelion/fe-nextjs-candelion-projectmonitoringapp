'use client'

import React, { useState } from 'react'
import { FIELD_CAMERA_METADATA } from '@/data/dummyData'
import { useTaskData } from '@/contexts/TaskDataContext'
import {
  Camera,
  MapPin,
  Clock,
  Crosshair,
  Zap,
  CheckCircle2,
  ShieldCheck,
  X,
  FileText,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react'

interface CameraViewfinderProps {
  onPhotoSaved?: (photoTitle: string) => void
}

export default function CameraViewfinder({ onPhotoSaved }: CameraViewfinderProps) {
  const { getAllSubTasks, sitePoints, addEvidencePhoto } = useTaskData()
  const allSubTasks = getAllSubTasks()

  const [flashActive, setFlashActive] = useState(false)
  const [gridVisible, setGridVisible] = useState(true)
  const [isCapturingModalOpen, setIsCapturingModalOpen] = useState(false)

  // Form inputs for linking photo to subtask
  const [selectedSubTaskId, setSelectedSubTaskId] = useState<string>(
    allSubTasks[0]?.id || 'sub_k4_3'
  )
  const [photoTitle, setPhotoTitle] = useState('Foto D: Laporan Hasil Pengecoran Kolom')
  const [reportCode, setReportCode] = useState('LAP-K4/2026/W46-02')
  const [photoNotes, setPhotoNotes] = useState(
    'Pengecoran kolom K4 telah memenuhi elevasi rencana dan selimut beton 30mm.'
  )
  const [selectedPointId, setSelectedPointId] = useState('P-01')

  // Handle Shutter click
  const handleShutter = () => {
    // If selected subtask has point, preselect it
    const matchedSubTask = allSubTasks.find((st) => st.id === selectedSubTaskId)
    if (matchedSubTask?.pointId) {
      setSelectedPointId(matchedSubTask.pointId)
    }
    setIsCapturingModalOpen(true)
  }

  // Handle save and link to subtask
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault()

    const matchedSubTask = allSubTasks.find((st) => st.id === selectedSubTaskId)
    const matchedPoint = sitePoints.find((p) => p.id === selectedPointId)

    addEvidencePhoto({
      title: photoTitle,
      reportCode: reportCode,
      subTaskId: selectedSubTaskId,
      subTaskTitle: matchedSubTask?.title || 'Dokumentasi Lapangan Terpadu',
      pointId: selectedPointId,
      pointName: matchedPoint?.title || `Titik ${selectedPointId}`,
      imageUrl: FIELD_CAMERA_METADATA.afterImage,
      coordinates: {
        lat: parseFloat(FIELD_CAMERA_METADATA.latitude),
        lng: parseFloat(FIELD_CAMERA_METADATA.longitude),
      },
      picName: FIELD_CAMERA_METADATA.pic,
      notes: photoNotes,
    })

    setIsCapturingModalOpen(false)
    if (onPhotoSaved) {
      onPhotoSaved(photoTitle)
    }
  }

  // When subtask dropdown changes, update default point
  const handleSubTaskChange = (subTaskId: string) => {
    setSelectedSubTaskId(subTaskId)
    const matched = allSubTasks.find((st) => st.id === subTaskId)
    if (matched?.pointId) {
      setSelectedPointId(matched.pointId)
      setPhotoTitle(`Foto: ${matched.title}`)
    }
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
      {/* Viewfinder Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Field Camera Geotagging UI
            </span>
            <span className="text-[10px] text-slate-400">
              Sensor: LiDAR & Leica RTK GNSS (Auto Watermark)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlashActive(!flashActive)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              flashActive
                ? 'bg-amber-400 text-slate-900'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
            title="Flash"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              gridVisible ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            Grid 3x3
          </button>
        </div>
      </div>

      {/* Main Viewport Screen */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
        {/* Mock Live Camera Stream Image */}
        <img
          src={FIELD_CAMERA_METADATA.afterImage}
          alt="Live Camera Feed"
          className="w-full h-full object-cover brightness-95 contrast-105"
        />

        {/* Rule of Thirds Gridlines */}
        {gridVisible && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div />
          </div>
        )}

        {/* Center Autofocus Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-2xl border-2 border-emerald-400/80 flex items-center justify-center animate-pulse">
            <Crosshair className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Mock GPS & Timestamp Overlay Data */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-start justify-between gap-2 pointer-events-none">
          <div className="bg-black/75 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 text-[11px] font-mono text-emerald-300 shadow-lg space-y-1 max-w-sm">
            <div className="flex items-center gap-2 text-white font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{FIELD_CAMERA_METADATA.timestamp}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>
                Lat: {FIELD_CAMERA_METADATA.latitude}, Long: {FIELD_CAMERA_METADATA.longitude}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5 border-t border-white/10">
              <span>Elevasi: {FIELD_CAMERA_METADATA.elevation}</span>
              <span>Akurasi: {FIELD_CAMERA_METADATA.accuracy}</span>
            </div>
          </div>

          <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-[11px] text-white shadow-lg flex items-center gap-2 self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold">{FIELD_CAMERA_METADATA.pic}</div>
              <div className="text-[10px] text-slate-300">{FIELD_CAMERA_METADATA.zone}</div>
            </div>
          </div>
        </div>

        {/* Bottom Shutter & Controls */}
        <div className="absolute bottom-4 left-0 right-0 px-6 flex items-center justify-between z-20">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-slate-300">
            {FIELD_CAMERA_METADATA.weather}
          </div>

          {/* Shutter Button */}
          <button
            type="button"
            onClick={handleShutter}
            className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Ambil Foto & Buka Form Pengaitan Sub-Tugas"
          >
            <div className="w-full h-full rounded-full border-4 border-slate-900 bg-white flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            </div>
          </button>

          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-slate-300">
            KTR-2026/CND/089
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span>Tekan tombol shutter untuk mengambil foto & menautkannya ke sub-tugas To-Do</span>
        <span className="text-emerald-400 font-semibold shrink-0">Status Sensor: GPS RTK Aktif</span>
      </div>

      {/* ── MODAL: INPUT PENGAITAN SUB-TUGAS & LAPORAN (REQUIREMENT 2) ── */}
      {isCapturingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Kaitkan Foto dengan Sub-Tugas To-Do
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Foto akan otomatis mengesahkan sub-tugas terkait di To-Do & peta
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCapturingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-40 border border-slate-800 shadow-inner">
              <img
                src={FIELD_CAMERA_METADATA.afterImage}
                alt="Captured Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/75 px-2.5 py-1 rounded-xl text-[10px] text-emerald-300 font-mono">
                Telocor Sidoarjo (GPS: -7.552697, 112.845201) • {FIELD_CAMERA_METADATA.timestamp}
              </div>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3 text-xs">
              {/* Field 1: Sub-Task Selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Pilih Sub-Tugas Terkait (To-Do List)
                </label>
                <select
                  value={selectedSubTaskId}
                  onChange={(e) => handleSubTaskChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-800"
                >
                  {allSubTasks.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.pointId || 'Zona B'}] {st.packageTitle} — {st.title} {st.isCompleted ? '(Sudah Selesai)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2 & 3: Judul Gambar & Kode Laporan (misal Gambar A laporan XXX) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Judul / Label Foto (misal: Foto A)
                  </label>
                  <input
                    type="text"
                    required
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="misal: Foto A: Pembesian Kolom"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Laporan (misal: Laporan XXX)
                  </label>
                  <input
                    type="text"
                    required
                    value={reportCode}
                    onChange={(e) => setReportCode(e.target.value)}
                    placeholder="misal: LAP-K4/2026/11-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                  />
                </div>
              </div>

              {/* Field 4: Titik Lokasi Peta */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Titik Lokasi Peta (Site Intelligence)
                </label>
                <select
                  value={selectedPointId}
                  onChange={(e) => setSelectedPointId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                >
                  {sitePoints.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.code}: {pt.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 5: Catatan Laporan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Pemeriksaan Lapangan
                </label>
                <textarea
                  rows={2}
                  value={photoNotes}
                  onChange={(e) => setPhotoNotes(e.target.value)}
                  placeholder="Catatan kondisi fisik di lapangan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCapturingModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Tautkan ke Sub-Tugas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
