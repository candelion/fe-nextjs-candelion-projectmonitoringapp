'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTaskData } from '@/contexts/TaskDataContext'
import { useRole } from '@/contexts/RoleContext'
import { SitePointItem, EvidencePhotoItem, SubTaskItem, PolygonZoneItem, TaskPriority, EvidenceType } from '@/types'
import { AVAILABLE_PICS, AVAILABLE_AUDITORS, PRESET_POLYGON_LOCATIONS } from '@/data/dummyData'
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
  FileCheck,
  ExternalLink,
  Check,
  Plus,
  Square,
  UserCheck,
  Send,
  Building,
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

  const { currentRole, currentUser } = useRole()
  const isAuditor = currentRole === 'auditor_head'
  const isController = currentRole === 'project_controller'

  const {
    sitePoints,
    polygonZones,
    selectedMapPointId,
    setSelectedMapPointId,
    getPhotosByPointId,
    getSubTasksByPointId,
    auditSubTask,
    auditPhoto,
    addPolygonZone,
    addSubTaskToPoint,
    assignPointPersonnel,
  } = useTaskData()

  const [activePoint, setActivePoint] = useState<SitePointItem | null>(null)
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm')
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<EvidencePhotoItem | null>(null)
  const [auditSubTaskModal, setAuditSubTaskModal] = useState<SubTaskItem | null>(null)
  const [auditDecision, setAuditDecision] = useState<'verified' | 'flagged'>('verified')
  const [auditNotesInput, setAuditNotesInput] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // ── Project Controller States: Create Polygon & Manage Location To-Do ─────────
  const [isCreatePolygonOpen, setIsCreatePolygonOpen] = useState(false)
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0)
  const [polyName, setPolyName] = useState(PRESET_POLYGON_LOCATIONS[0].name)
  const [polyCode, setPolyCode] = useState(PRESET_POLYGON_LOCATIONS[0].code)
  const [polySummary, setPolySummary] = useState(PRESET_POLYGON_LOCATIONS[0].summary)
  const [polyColor, setPolyColor] = useState(PRESET_POLYGON_LOCATIONS[0].defaultColor)
  const [polyPic, setPolyPic] = useState(AVAILABLE_PICS[0].name)
  const [polyAuditor, setPolyAuditor] = useState(AVAILABLE_AUDITORS[0].name)
  const [polyBudget, setPolyBudget] = useState(120000000)

  // Add Task to Point Modal State
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Wajib')
  const [newTaskEvidence, setNewTaskEvidence] = useState<EvidenceType>('foto')
  const [newTaskPic, setNewTaskPic] = useState(AVAILABLE_PICS[0].name)
  const [newTaskAuditor, setNewTaskAuditor] = useState(AVAILABLE_AUDITORS[0].name)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

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

  // Handler for evaluating a task directly from the map drawer (for Auditor)
  const handleOpenTaskAudit = (task: SubTaskItem) => {
    setAuditSubTaskModal(task)
    setAuditDecision(task.auditStatus === 'flagged' ? 'flagged' : 'verified')
    setAuditNotesInput(
      task.auditNotes ||
        `Pekerjaan ${task.title} di ${activePoint?.title || 'Telocor'} telah diverifikasi kesesuaian fisik dan koordinatnya.`
    )
  }

  const handleSaveTaskAudit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auditSubTaskModal) return

    auditSubTask(
      auditSubTaskModal.packageId,
      auditSubTaskModal.id,
      auditDecision,
      auditNotesInput.trim() ||
        (auditDecision === 'verified' ? 'Terverifikasi Sah secara Geospasial' : 'Perlu revisi lapangan'),
      currentUser.name
    )

    if (auditSubTaskModal.photoId) {
      auditPhoto(
        auditSubTaskModal.photoId,
        auditDecision,
        auditNotesInput.trim(),
        currentUser.name
      )
    }

    showToast(
      auditDecision === 'verified'
        ? `✓ To-Do "${auditSubTaskModal.title}" disahkan di ${activePoint?.code}!`
        : `⚠️ Catatan Temuan untuk "${auditSubTaskModal.title}" dicatat!`
    )
    setAuditSubTaskModal(null)
  }

  // Handler for quick photo audit directly from photo preview
  const handlePhotoAudit = (decision: 'verified' | 'flagged', notes: string) => {
    if (!selectedPhotoPreview) return

    auditPhoto(selectedPhotoPreview.id, decision, notes, currentUser.name)

    if (selectedPhotoPreview.subTaskId) {
      const matchedTask = activePointTasks.find((t) => t.id === selectedPhotoPreview.subTaskId)
      if (matchedTask) {
        auditSubTask(matchedTask.packageId, matchedTask.id, decision, notes, currentUser.name)
      }
    }

    showToast(
      decision === 'verified'
        ? `✓ Bukti Foto "${selectedPhotoPreview.title}" disahkan: TERVERIFIKASI SAH!`
        : `⚠️ Catatan Temuan dicatat untuk bukti foto!`
    )
    setSelectedPhotoPreview(null)
  }

  // Handler for creating a new polygon zone (Requirement 2)
  const handleCreatePolygonSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const preset = PRESET_POLYGON_LOCATIONS[selectedPresetIndex]
    const newPolygon: PolygonZoneItem = {
      id: `poly_${Date.now()}`,
      code: polyCode.toUpperCase(),
      name: polyName,
      summary: polySummary,
      color: polyColor,
      fillColor: polyColor,
      fillOpacity: 0.25,
      coordinates: preset.coordinates,
      assignedPic: polyPic,
      assignedAuditor: polyAuditor,
      progress: 0,
      targetProgress: 25,
      budget: polyBudget,
    }

    addPolygonZone(newPolygon)
    showToast(`✓ Kotak Poligon ${newPolygon.code} (${newPolygon.name}) berhasil dibuat di Telocor!`)
    setIsCreatePolygonOpen(false)
  }

  // Handler for adding a new task to point (Requirement 2)
  const handleAddTaskToPointSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePoint || !newTaskTitle.trim()) return

    addSubTaskToPoint(activePoint.id, {
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || `Tugas pelaksanaan di titik ${activePoint.code} Telocor`,
      priority: newTaskPriority,
      evidenceRequired: newTaskEvidence,
      assignedPic: newTaskPic,
      assignedAuditor: newTaskAuditor,
    })

    showToast(`✓ Tugas baru "${newTaskTitle}" berhasil ditugaskan ke ${newTaskPic} di ${activePoint.code}!`)
    setIsAddTaskModalOpen(false)
    setNewTaskTitle('')
    setNewTaskDesc('')
  }

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
              {isController && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  Admin Pusat: Full Map Control
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              {isAuditor
                ? 'Audit Geospasial Telocor'
                : 'Peta Spasial & Titik Pantau Telocor'}
            </h3>
          </div>

          {/* Controller Actions: Create Polygon & Layer Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {/* Project Controller: Button to Create Polygon Box (Requirement 2) */}
            {isController && (
              <button
                type="button"
                onClick={() => setIsCreatePolygonOpen(true)}
                className="px-3 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <Square className="w-3.5 h-3.5" />
                <span>+ Buat Kotak Poligon Baru</span>
              </button>
            )}

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
                Citra Satelit
              </button>
            </div>
          </div>
        </div>

        {/* Real Leaflet OpenStreetMap Container */}
        <div className="relative">
          <OpenStreetMapContainer
            sitePoints={sitePoints}
            polygonZones={polygonZones}
            selectedPointId={activePoint?.id || null}
            onSelectPoint={(point) => {
              setActivePoint(point)
              setSelectedMapPointId(point.id)
            }}
            mapLayer={mapLayer}
          />

          {/* OVERLAY DRAWER: Detail Titik, Tugas & Foto Terkait */}
          {activePoint && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto z-400 w-auto sm:w-96 max-h-[90%] bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90 overflow-y-auto space-y-3.5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-2 border-b pb-2.5 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-black uppercase font-mono">
                      {activePoint.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {activePoint.zoneCode}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                    {activePoint.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
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

              {/* Status & PIC (with Reassign capability for Controller) */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Status Titik:</span>
                  <span className="font-bold text-emerald-700">{activePoint.statusLabel}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">PIC Pengawas:</span>
                  {isController ? (
                    <select
                      value={activePoint.assignedPic}
                      onChange={(e) => {
                        assignPointPersonnel(activePoint.id, e.target.value)
                        showToast(`✓ PIC ${activePoint.code} diubah menjadi ${e.target.value}`)
                      }}
                      className="font-bold text-indigo-700 bg-transparent text-[10px] w-full border-none p-0 focus:ring-0 cursor-pointer"
                    >
                      {AVAILABLE_PICS.map((pic) => (
                        <option key={pic.name} value={pic.name}>
                          {pic.name.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="font-bold text-slate-800 truncate block">{activePoint.assignedPic}</span>
                  )}
                </div>
              </div>

              {/* SECTION 1: DAFTAR TO-DO PIC DI TITIK INI */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                    {isAuditor
                      ? 'To-Do PIC Perlu Diaudit'
                      : isController
                      ? 'Kelola To-Do di Titik Ini'
                      : 'Daftar Tugas di Titik Ini'}{' '}
                    ({activePointTasks.length})
                  </span>

                  {/* Controller: Quick button to add To-Do to this point */}
                  {isController && (
                    <button
                      type="button"
                      onClick={() => setIsAddTaskModalOpen(true)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Tambah To-Do
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {activePointTasks.length === 0 ? (
                    <p className="text-[11px] text-slate-400">Belum ada tugas di titik ini.</p>
                  ) : (
                    activePointTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 text-[11px] ${
                          task.isCompleted
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                task.isCompleted ? 'text-emerald-600' : 'text-slate-300'
                              }`}
                            />
                            <span
                              className={`truncate ${
                                task.isCompleted ? 'font-bold text-slate-800' : 'text-slate-600'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
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
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>PIC: {task.assignedPic?.split(',')[0] || activePoint.assignedPic.split(',')[0]}</span>
                          {isAuditor && task.isCompleted && (
                            <button
                              type="button"
                              onClick={() => handleOpenTaskAudit(task)}
                              className="px-2 py-0.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Nilai
                            </button>
                          )}
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
                    Foto Bukti PIC Terupload ({activePointPhotos.length})
                  </span>
                  <Link
                    href="/dashboard/dokumentasi"
                    className="text-[10px] font-bold text-teal-700 hover:underline flex items-center gap-0.5"
                  >
                    <span>{isAuditor ? 'Semua Bukti Foto →' : 'Buka Galeri →'}</span>
                  </Link>
                </div>

                {activePointPhotos.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center text-slate-400 text-xs">
                    <p>Belum ada foto yang diunggah di titik {activePoint.code}.</p>
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
                          <span className="text-[10px] font-bold line-clamp-1">{photo.title}</span>
                          <span className="text-[8px] text-teal-300 font-mono">PIC: Hendra W.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL BUAT KOTAK POLIGON LOKASI BARU (REQUIREMENT 2 - CONTROLLER) ── */}
      {isCreatePolygonOpen && (
        <div className="fixed inset-0 z-500 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                  Admin Pusat • Site Intelligence Telocor
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-0.5">
                  Buat Kotak Poligon Zona Baru 🗺️
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatePolygonOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePolygonSubmit} className="space-y-4 text-xs">
              {/* Preset Coordinates Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Pilih Area Poligon di Telocor Sidoarjo:
                </label>
                <div className="space-y-2">
                  {PRESET_POLYGON_LOCATIONS.map((preset, idx) => (
                    <div
                      key={preset.code}
                      onClick={() => {
                        setSelectedPresetIndex(idx)
                        setPolyName(preset.name)
                        setPolyCode(preset.code)
                        setPolySummary(preset.summary)
                        setPolyColor(preset.defaultColor)
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition ${
                        selectedPresetIndex === idx
                          ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">{preset.name}</span>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white"
                          style={{ backgroundColor: preset.defaultColor }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{preset.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Code & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Zona:</label>
                  <input
                    type="text"
                    value={polyCode}
                    onChange={(e) => setPolyCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono uppercase font-bold text-slate-900"
                    placeholder="ZONA E"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warna Poligon:</label>
                  <input
                    type="color"
                    value={polyColor}
                    onChange={(e) => setPolyColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Assign PIC & Auditor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assign PIC Lapangan:
                  </label>
                  <select
                    value={polyPic}
                    onChange={(e) => setPolyPic(e.target.value)}
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
                    value={polyAuditor}
                    onChange={(e) => setPolyAuditor(e.target.value)}
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

              {/* Target Duration */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Durasi Pelaksanaan (Hari Kerja):
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  min="1"
                  max="180"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePolygonOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Terbitkan Kotak Poligon ke Peta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL TAMBAH TO-DO DI TITIK INI (REQUIREMENT 2 - CONTROLLER) ─── */}
      {isAddTaskModalOpen && activePoint && (
        <div className="fixed inset-0 z-500 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
                  Atur To-Do Berdasarkan Lokasi • {activePoint.code}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  Tambah Tugas Baru di {activePoint.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTaskToPointSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Tugas To-Do:</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Misal: Pemasangan Balok Fender Dermaga"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Spesifikasi Teknis:</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Target toleransi deviasi fisik..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioritas:</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Penting">Penting</option>
                    <option value="Opsional">Opsional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bukti Wajib Diserahkan:</label>
                  <select
                    value={newTaskEvidence}
                    onChange={(e) => setNewTaskEvidence(e.target.value as EvidenceType)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="foto">Foto Geotagging</option>
                    <option value="form">Form Opname Fisik</option>
                    <option value="gps">Verifikasi GPS Titik</option>
                    <option value="ttd">Tanda Tangan Digital</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign ke PIC:</label>
                  <select
                    value={newTaskPic}
                    onChange={(e) => setNewTaskPic(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {AVAILABLE_PICS.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name.split(',')[0]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign ke Auditor:</label>
                  <select
                    value={newTaskAuditor}
                    onChange={(e) => setNewTaskAuditor(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {AVAILABLE_AUDITORS.map((a) => (
                      <option key={a.name} value={a.name}>
                        {a.name.split(',')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Terbitkan Tugas ke PIC</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL EVALUASI AUDITOR DARI PETA ──────────────────────────── */}
      {auditSubTaskModal && (
        <div className="fixed inset-0 z-500 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider font-mono">
                  Audit To-Do Geospasial • {activePoint?.code}
                </span>
                <h3 className="font-black text-base text-slate-900 mt-0.5">
                  Verifikasi Bukti & Koordinat Lapangan
                </h3>
                <p className="text-xs text-slate-500">{auditSubTaskModal.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setAuditSubTaskModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-500">
                <span>Pelaksana PIC:</span>
                <strong className="text-slate-800">Hendra Wijaya, S.T.</strong>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Titik Telocor:</span>
                <strong className="text-teal-700">{activePoint?.title}</strong>
              </div>
              {auditSubTaskModal.evidenceDetail && (
                <div className="pt-1.5 border-t border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Bukti Terlampir:</span>
                  <p className="font-mono text-slate-800 mt-0.5">{auditSubTaskModal.evidenceDetail}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveTaskAudit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Keputusan Evaluasi Auditor:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditDecision('verified')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      auditDecision === 'verified'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Sahkan To-Do
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditDecision('flagged')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      auditDecision === 'flagged'
                        ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Catatan Temuan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Kertas Kerja Audit:
                </label>
                <textarea
                  rows={3}
                  value={auditNotesInput}
                  onChange={(e) => setAuditNotesInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  placeholder="Tuliskan catatan verifikasi spesifikasi..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAuditSubTaskModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL PRATINJAU FOTO & AKSI AUDIT DARI PETA ───────────────── */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-500 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 text-slate-800 space-y-3.5">
            <div className="flex items-start justify-between border-b pb-2.5 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider font-mono">
                  Bukti Foto Lapangan • {selectedPhotoPreview.pointId}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
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

            <div className="rounded-2xl overflow-hidden bg-slate-950 h-56 relative border border-slate-800">
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
              <span className="text-slate-400 block text-[10px]">Terkait To-Do PIC:</span>
              <strong className="text-indigo-800 block">{selectedPhotoPreview.subTaskTitle}</strong>
              <p className="text-slate-600 mt-1">{selectedPhotoPreview.notes}</p>
              <div className="text-[10px] text-teal-700 font-bold pt-1">
                Pengunggah: {selectedPhotoPreview.picName}
              </div>
            </div>

            {/* If Auditor: Quick Action to approve or flag */}
            {isAuditor ? (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoPreview(null)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePhotoAudit('flagged', 'Perlu pemeriksaan ulang kesesuaian selimut beton di lokasi.')
                    }
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Flag Temuan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePhotoAudit('verified', 'Foto bukti valid, metadata GPS terverifikasi sesuai perimeter Telocor.')
                    }
                    className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Sahkan Bukti Foto
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoPreview(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Summary Bar — Role Adaptive */}
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
              <Square className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">
                {isController ? 'Kotak Poligon Terpetakan' : isAuditor ? 'To-Do Spasial Sah' : 'Titik Aktif Terpetakan'}
              </div>
              <div className="text-sm font-black text-slate-900">
                {polygonZones.length} Poligon Zona Telocor
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                {isController ? 'Otoritas Admin Pusat Aktif' : `${sitePoints.length} Titik Kunci Aktif`}
              </div>
            </div>
          </div>

          <div className="px-4 py-2 sm:py-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">
                {isAuditor ? 'Keabsahan Geotagging' : 'Bukti Geotagging'}
              </div>
              <div className="text-sm font-black text-slate-900">100% Perimeter Valid</div>
              <div className="text-[10px] text-emerald-600 font-medium">Sesuai Radius Telocor</div>
            </div>
          </div>

          <div className="px-4 py-2 sm:py-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">
                {isAuditor ? 'Catatan Temuan Spasial' : 'Kepatuhan Keselamatan'}
              </div>
              <div className="text-sm font-black text-amber-700">
                {isAuditor ? '1 Catatan (P-02 Tanggul)' : 'Zero Incident'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {isAuditor ? 'Overlap Geotextile 50cm' : '18 Mandor APD Standar'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
