'use client'

import React, { Suspense } from 'react'
import GeospatialMapMock from '@/components/site-intelligence/GeospatialMapMock'
import { Globe } from 'lucide-react'

export default function SiteIntelligencePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Globe className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Site Intelligence & Geospasial
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Site Intelligence: Pemetaan Tugas & Bukti per Titik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrasi spasial real-time, monitoring status pekerjaan per titik koordinat, dan arsip foto bukti yang diunggah di setiap lokasi.
          </p>
        </div>
      </div>

      {/* Geospatial Map Mock Component wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs">
            Memuat peta spasial & titik tugas...
          </div>
        }
      >
        <GeospatialMapMock />
      </Suspense>
    </div>
  )
}
