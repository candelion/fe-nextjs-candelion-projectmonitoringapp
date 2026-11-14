export type UserRole = 'project_controller' | 'auditor_head' | 'pic_lapangan'

export interface UserProfile {
  id: string
  name: string
  role: UserRole
  roleTitle: string
  email: string
  avatar: string
  badgeColor: string
  permissions: string[]
}

export interface ZoneItem {
  id: string
  code: string
  name: string
  subtitle: string
  progress: number
  targetProgress: number
  status: 'completed' | 'in_progress' | 'delayed'
  statusLabel: string
  pic: string
  budget: number
  spent: number
  prosedurValid: boolean
  dokumenValid: boolean
  signOffValid: boolean
  iconType: 'wallet' | 'bank' | 'building' | 'layers'
  coordinates: { x: number; y: number; lat: number; lng: number }
  lastUpdated: string
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi'
  summary: string
  imageUrl?: string
}

// ─── PIC Lapangan Workflow Types ─────────────────────────────────────────────

export type TaskPriority = 'Wajib' | 'Penting' | 'Opsional'
export type EvidenceType = 'foto' | 'form' | 'gps' | 'stok' | 'ttd'
export type AuditStatus = 'verified' | 'pending' | 'flagged'

export interface SubTaskItem {
  id: string
  packageId: string
  packageTitle: string
  title: string
  description: string
  priority: TaskPriority
  isCompleted: boolean
  hasCoordinates: boolean
  pointId?: string // e.g. 'P-01'
  pointName?: string // e.g. 'Titik P-01: Kolom K4 Lt. 2'
  coordinates?: { lat: number; lng: number; x: number; y: number }
  evidenceRequired: EvidenceType
  evidenceSubmitted: boolean
  evidenceDetail?: string
  photoId?: string
  completedAt?: string

  // Auditor evaluation & review fields (Relevance to PIC To-Do)
  auditStatus?: AuditStatus // 'verified' (Sah) | 'pending' (Menunggu Review) | 'flagged' (Catatan Temuan)
  auditNotes?: string
  auditedBy?: string
  auditedAt?: string
}

export interface TaskPackageItem {
  id: string
  code: string // e.g. 'STR-K4'
  title: string // e.g. 'Struktur Kolom K4 Lt. 2'
  subtitle: string // e.g. 'Pengecekan bekisting, pembesian & cor'
  progress: number // 0 - 100%
  status: 'completed' | 'in_progress' | 'delayed'
  statusLabel: 'Selesai' | 'Sedang Berjalan' | 'Tertunda'
  iconType: 'wallet' | 'bank' | 'building' | 'layers' | 'shield'
  color: string
  pointId?: string
  pointName?: string
  subTasks: SubTaskItem[]
}

export interface EvidencePhotoItem {
  id: string
  title: string // e.g. 'Foto A: Pembesian Kolom K4'
  reportCode: string // e.g. 'LAP-K4/2026/11-01'
  subTaskId: string
  subTaskTitle: string
  pointId: string
  pointName: string
  imageUrl: string
  timestamp: string
  coordinates: { lat: number; lng: number }
  picName: string
  notes: string

  // Auditor Photo Verification
  auditStatus?: AuditStatus
  auditNotes?: string
  auditedBy?: string
  auditedAt?: string
}

export interface SitePointItem {
  id: string
  code: string // 'P-01'
  title: string // 'Titik P-01: Kolom K4 Lantai 2'
  subtitle: string
  zoneCode: string // 'ZONA B'
  status: 'completed' | 'in_progress' | 'delayed'
  statusLabel: string
  coordinates: { x: number; y: number; lat: number; lng: number }
  assignedPic: string
  targetDesc: string
  subTaskIds: string[]
}

export interface WarningNotification {
  id: string
  title: string
  description: string
  zoneCode: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
  status: 'Aktif' | 'Ditindaklanjuti' | 'Selesai'
}

export interface InspectionDocument {
  id: string
  code: string
  title: string
  zone: string
  category: 'RAB' | 'Audit' | 'Opname Fisik' | 'Laporan Mingguan'
  dateIssued: string
  author: string
  fileSize: string
  status: 'Terverifikasi' | 'Menunggu Review' | 'Draft'
  signOffStatus: boolean
}

export interface GeoIntelligenceSummary {
  overallProgress: number
  budgetUtilization: number
  safetyIncidents: number
  activeWorkers: number
  weatherCondition: string
  temperature: string
}
