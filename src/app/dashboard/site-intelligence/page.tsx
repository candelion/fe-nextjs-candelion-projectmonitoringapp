'use client'

import React, { Suspense } from 'react'
import GeospatialMapMock from '@/components/site-intelligence/GeospatialMapMock'
import { Globe, ShieldCheck } from 'lucide-react'
import { useRole } from '@/contexts/RoleContext'

export default function SiteIntelligencePage() {
  const { currentRole } = useRole()
  const isAuditor = currentRole === 'auditor_head'

  return (
    <div className="space-y-6">
      {/* Page Header — Role-Aware */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                isAuditor ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {isAuditor ? <ShieldCheck className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isAuditor ? 'text-teal-700' : 'text-emerald-600'
              }`}
            >
              {isAuditor
                ? 'Auditor Head • Verifikasi Spasial & Geotagging'
                : 'Site Intelligence & Geospasial'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {isAuditor
              ? 'Audit Geospasial: Verifikasi To-Do PIC per Titik Telocor'
              : 'Site Intelligence: Pemetaan Tugas & Bukti per Titik'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAuditor
              ? 'Pemeriksaan keabsahan koordinat GPS, verifikasi foto bukti lapangan, dan evaluasi kepatuhan To-Do yang dikerjakan oleh PIC (Hendra Wijaya, S.T.) di Telocor Sidoarjo.'
              : 'Integrasi spasial real-time, monitoring status pekerjaan per titik koordinat, dan arsip foto bukti yang diunggah di setiap lokasi.'}
          </p>
        </div>
      </div>

      {/* Geospatial Map Mock Component wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs">
            Memuat peta spasial & titik tugas Telocor...
          </div>
        }
      >
        <GeospatialMapMock />
      </Suspense>
    </div>
  )
}
