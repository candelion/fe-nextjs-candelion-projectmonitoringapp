'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRole } from '@/contexts/RoleContext'
import CircularProgressChart from '@/components/analytics/CircularProgressChart'
import TargetVsRealisasiChart from '@/components/analytics/TargetVsRealisasiChart'
import EarlyWarningSystem from '@/components/analytics/EarlyWarningSystem'
import ZoneGridCards from '@/components/dashboard/ZoneGridCards'
import { LineChart, ShieldAlert, ClipboardList } from 'lucide-react'

export default function AnalyticsDashboardPage() {
  const { currentRole } = useRole()
  const [selectedZone, setSelectedZone] = useState('Semua Zona')

  // Guard for PIC Lapangan: analytics is for Controller & Auditor
  if (currentRole === 'pic_lapangan') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Akses Terbatas — Modul Evaluasi Strategis & Kurva S
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Modul Analitik Kurva S & Evaluasi Strategis dikhususkan untuk <strong>Project Controller</strong> dan <strong>Auditor Head</strong>. Sebagai PIC Lapangan, Anda dapat mengelola tugas operasional harian atau mendokumentasikan foto lapangan.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Buka Tugas Harian Lapangan</span>
          </Link>
        </div>
      </div>
    )
  }

  const isAuditor = currentRole === 'auditor_head'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                isAuditor ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <LineChart className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isAuditor ? 'text-teal-700' : 'text-indigo-600'
              }`}
            >
              {isAuditor ? 'Evaluasi Pengawasan & Audit Deviasi' : 'Modul Analitik & Evaluasi'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {isAuditor
              ? 'Evaluasi Kurva S, Deviasi & Kepatuhan Proyek'
              : 'Dasbor Pemantauan Progres Real-Time'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAuditor
              ? 'Analisis independen terhadap deviasi kurva S, uji sampling opname fisik PIC, dan mitigasi risiko keterlambatan konstruksi Telocor Sidoarjo.'
              : 'Integrasi kurva S, deviasi mingguan, capaian fisik, dan mitigasi risiko proyek.'}
          </p>
        </div>
      </div>

      {/* Auditor Specific Compliance Alert Strip */}
      {isAuditor && (
        <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-teal-950">
                Laporan Evaluasi Audit Mingguan (Minggu ke-8): Kepatuhan 86.40%
              </div>
              <p className="text-teal-800 text-[11px] mt-0.5">
                Deviasi rencana (-1.60%) pada Pengecoran Balok K4 Zona B disebabkan pasang air muara Kali Porong dan telah disetujui penjadwalan ulangnya oleh Auditor.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              ✓ BAP Disetujui
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-teal-100 text-teal-800 border border-teal-300">
              Zero Fraud
            </span>
          </div>
        </div>
      )}

      {/* KPI & Charts Grid: Circular Progress Chart (75% Selesai) + Bar Chart Target vs Realisasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CircularProgressChart />
        </div>
        <div className="lg:col-span-2">
          <TargetVsRealisasiChart />
        </div>
      </div>

      {/* Sistem Peringatan Dini Panel */}
      <EarlyWarningSystem />

      {/* Zone View Grid: Visual mock representation of project zones */}
      <div className="pt-2">
        <ZoneGridCards filterCategory={selectedZone} />
      </div>
    </div>
  )
}
