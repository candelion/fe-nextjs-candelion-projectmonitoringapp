'use client'

import React, { useState } from 'react'
import { useRole } from '@/contexts/RoleContext'
import HeroBanner from '@/components/dashboard/HeroBanner'
import SummaryCards from '@/components/dashboard/SummaryCards'
import QuickSearchFilter from '@/components/dashboard/QuickSearchFilter'
import ZoneGridCards from '@/components/dashboard/ZoneGridCards'
import PicLapanganView from '@/components/dashboard/PicLapanganView'
import AuditorDashboardView from '@/components/dashboard/AuditorDashboardView'
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  MapPin,
  FileCheck,
} from 'lucide-react'
import Link from 'next/link'
import { WARNING_NOTIFICATIONS } from '@/data/dummyData'

export default function DashboardMainPage() {
  const { currentRole } = useRole()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua Zona')

  // ── PIC Lapangan: simple todo checklist view, no RAB ──────────────────────
  if (currentRole === 'pic_lapangan') {
    return <PicLapanganView />
  }

  // ── Auditor Head: Dedicated evaluation view for PIC To-Do & compliance ───
  if (currentRole === 'auditor_head') {
    return <AuditorDashboardView />
  }

  // ── Project Controller: full executive dashboard & RAB integration ────────
  const topAlert = WARNING_NOTIFICATIONS[0]

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Early Warning Banner */}
      {topAlert && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900 mr-2">Peringatan Dini Sistem:</span>
              <span className="text-amber-800">
                {topAlert.title} — {topAlert.description}
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/analytics"
            className="self-end sm:self-center font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 shrink-0 bg-white/70 px-3 py-1.5 rounded-xl border border-amber-200 transition"
          >
            <span>Tindak Lanjuti</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Summary Cards for Project Controller */}
      <SummaryCards />

      {/* Search & Filter */}
      <QuickSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Zone Grid Cards */}
      <ZoneGridCards searchQuery={searchQuery} filterCategory={selectedCategory} />

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/dashboard/dokumentasi"
          className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
              Dokumentasi Lapangan
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Verifikasi foto geotagging & slider before-after
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/dashboard/site-intelligence"
          className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition">
              Site Intelligence & Peta
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Visual peta interaktif & pin status zona
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/dashboard/laporan"
          className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition">
              Otomasi Pembuatan Laporan
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ekstrak RAB & terbitkan PDF laporan audit
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  )
}
