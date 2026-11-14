'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTaskData } from '@/contexts/TaskDataContext'
import { useRole } from '@/contexts/RoleContext'
import { SitePointItem, EvidencePhotoItem } from '@/types'
import {
  MapPin,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  X,
  Camera,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react'

// Dynamic import for Leaflet / OpenStreetMap container (SSR disabled)
const OpenStreetMapContainer = dynamic(
  () => import('@/components/site-intelligence/OpenStreetMapContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] sm:h-[600px] bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Memuat Peta Telocor Sidoarjo (OSM)...</span>
        </div>
      </div>
    ),
  }
)

export default function GeospatialMapMock() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlPointParam = searchParams.get('point')

  const { currentRole } = useRole()
  const isAuditor = currentRole === 'auditor_head'

  const {
    sitePoints,
    selectedMapPointId,
    setSelectedMapPointId,
    getPhotosByPointId,
    getSubTasksByPointId,
  } = useTaskData()

  const [activePoint, setActivePoint] = useState<SitePointItem | null>(null)
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm')
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<EvidencePhotoItem | null>(null)

  // Sync with URL query parameter or context selected point
  useEffect(() => {
    const targetPointId = urlPointParam || selectedMapPointId
    if (targetPointId) {
      const matched = sitePoints.find((p) => p.id === targetPointId)
      if (matched) {
        setActivePoint(matched)
        setSelectedMapPointId(targetPointId)
      }
    } else if (!activePoint && sitePoints.length > 0) {
      setActivePoint(sitePoints[0]) // Default to P-01
    }
  }, [urlPointParam, selectedMapPointId, sitePoints])

  // Get active point tasks & photos
  const activePointTasks = activePoint ? getSubTasksByPointId(activePoint.id) : []
  const activePointPhotos = activePoint ? getPhotosByPointId(activePoint.id) : []

  return (
    <div className="space-y-4">
      {/* Map Container Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                Telocor Sidoarjo — OpenStreetMap + Poligon
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Lat: -7.552697, Long: 112.845201
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              Site Intelligence: Pemetaan Tugas & Foto Lapangan per Titik Poligon
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik titik koordinat atau poligon zona pada peta Telocor untuk melihat rincian sub-tugas dan foto bukti yang telah diunggah.
            </p>
          </div>

          {/* Layer Selector & Status Pins Legend */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {/* Map Layer Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setMapLayer('osm')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mapLayer === 'osm'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Peta OSM
              </button>
              <button
                type="button"
                onClick={() => setMapLayer('satellite')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  mapLayer === 'satellite'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satelit Esri
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 text-[11px]">Selesai</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-600 text-[11px]">Sedang Berjalan</span>
            </div>
          </div>
        </div>

        {/* Map Viewport Area (Real OpenStreetMap + Polygons) */}
        <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <OpenStreetMapContainer
            sitePoints={sitePoints}
            selectedPointId={activePoint?.id || null}
            onSelectPoint={(point) => {
              setActivePoint(point)
              setSelectedMapPointId(point.id)
            }}
            mapLayer={mapLayer}
          />

          {/* ── DETAIL DRAWER: TUGAS & FOTO DI TITIK INI ──────────────── */}
          {activePoint && (
            <div className="absolute bottom-4 right-4 z-[1000] w-84 sm:w-96 max-h-[85%] overflow-y-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 text-slate-800 shadow-2xl border border-slate-200 text-xs space-y-3.5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activePoint.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Lat: {activePoint.coordinates.lat}, Long: {activePoint.coordinates.lng}
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 mt-1">
                    {activePoint.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {activePoint.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePoint(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & PIC */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Status Titik:</span>
                  <span className="font-bold text-emerald-700">{activePoint.statusLabel}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">PIC Pengawas:</span>
                  <span className="font-bold text-slate-800 truncate block">{activePoint.assignedPic}</span>
                </div>
              </div>

              {/* SECTION 1: DAFTAR TUGAS DI TITIK INI */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                    Daftar Tugas di Titik Ini ({activePointTasks.length})
                  </span>
                  <span className="text-[10px] font-bold text-teal-700">
                    {isAuditor
                      ? `${activePointTasks.filter((t) => t.auditStatus === 'verified').length} / ${activePointTasks.length} Sah`
                      : `${activePointTasks.filter((t) => t.isCompleted).length} Selesai`}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activePointTasks.length === 0 ? (
                    <p className="text-[11px] text-slate-400">Tidak ada tugas spesifik di titik ini.</p>
                  ) : (
                    activePointTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] ${
                          task.isCompleted
                            ? 'bg-emerald-50/80 border-emerald-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              task.isCompleted ? 'text-emerald-600' : 'text-slate-300'
                            }`}
                          />
                          <span
                            className={`truncate ${
                              task.isCompleted ? 'font-medium text-slate-800' : 'text-slate-400'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {isAuditor && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                                task.auditStatus === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : task.auditStatus === 'flagged'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {task.auditStatus === 'verified'
                                ? '✓ Sah'
                                : task.auditStatus === 'flagged'
                                ? '⚠️ Temuan'
                                : '⏳ Review'}
                            </span>
                          )}
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-white/80 border border-slate-200 text-slate-600">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 2: GAMBAR / FOTO YANG DIUPLOAD DI TITIK INI */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    Foto Bukti Terupload di Titik Ini ({activePointPhotos.length})
                  </span>
                  <Link
                    href="/dashboard/dokumentasi"
                    className="text-[10px] font-bold text-teal-700 hover:underline flex items-center gap-0.5"
                  >
                    <span>{isAuditor ? 'Audit Bukti Foto →' : '+ Ambil Foto'}</span>
                  </Link>
                </div>

                {activePointPhotos.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center text-slate-400 text-xs">
                    <p>Belum ada foto yang diunggah di titik {activePoint.code}.</p>
                    <Link
                      href="/dashboard/dokumentasi"
                      className="inline-flex items-center gap-1 mt-1.5 text-emerald-600 font-bold text-[11px]"
                    >
                      <Camera className="w-3 h-3" /> {isAuditor ? 'Lihat Galeri Foto' : 'Buka Kamera Lapangan'}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {activePointPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhotoPreview(photo)}
                        className="group rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer relative"
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-20 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                          <span className="text-[10px] font-bold truncate leading-tight">
                            {photo.title}
                          </span>
                          <span className="text-[9px] text-emerald-300 font-mono">
                            {photo.reportCode}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAuditor ? 'Evaluasi Audit To-Do PIC' : 'Lihat To-Do Lapangan'}</span>
                </Link>
                <Link
                  href="/dashboard/dokumentasi"
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Dokumentasi
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── PHOTO FULL PREVIEW MODAL ─────────────────────────────────── */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                  {selectedPhotoPreview.reportCode} • {selectedPhotoPreview.pointName}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  {selectedPhotoPreview.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhotoPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 h-64 relative border border-slate-800">
              <img
                src={selectedPhotoPreview.imageUrl}
                alt={selectedPhotoPreview.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded-xl text-xs text-emerald-300 font-mono">
                Lat: {selectedPhotoPreview.coordinates.lat}, Long: {selectedPhotoPreview.coordinates.lng} • {selectedPhotoPreview.timestamp}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px]">Terkait Sub-Tugas:</span>
              <strong className="text-indigo-800 block">{selectedPhotoPreview.subTaskTitle}</strong>
              <p className="text-slate-600 mt-1">{selectedPhotoPreview.notes}</p>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPhotoPreview(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="px-4 py-2 sm:py-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Lokasi Proyek</div>
              <div className="text-sm font-black text-slate-900">Telocor Sidoarjo</div>
              <div className="text-[10px] text-indigo-600 font-medium">Kec. Jabon, Kab. Sidoarjo</div>
            </div>
          </div>

          <div className="px-4 py-2 sm:py-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Titik Aktif Terpetakan</div>
              <div className="text-sm font-black text-slate-900">{sitePoints.length} Titik Kunci (P-01 s/d P-04)</div>
              <div className="text-[10px] text-emerald-600 font-medium">4 Poligon Zona Aktif</div>
            </div>
          </div>

          <div className="px-4 py-2 sm:py-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Bukti Geotagging</div>
              <div className="text-sm font-black text-slate-900">100% Terverifikasi</div>
              <div className="text-[10px] text-emerald-600 font-medium">Foto GPS Tersinkron</div>
            </div>
          </div>

          <div className="px-4 py-2 sm:py-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Kepatuhan Keselamatan</div>
              <div className="text-sm font-black text-emerald-600">Zero Incident</div>
              <div className="text-[10px] text-slate-400 font-medium">18 Mandor APD Standar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
