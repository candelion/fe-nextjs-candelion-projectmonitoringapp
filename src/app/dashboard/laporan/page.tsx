'use client'

import React from 'react'
import Link from 'next/link'
import { useRole } from '@/contexts/RoleContext'
import ReportActionPanel from '@/components/reporting/ReportActionPanel'
import { FileSpreadsheet, ShieldAlert, ArrowLeft, ClipboardList } from 'lucide-react'

export default function ReportingDashboardPage() {
  const { currentRole } = useRole()

  // Guard for PIC Lapangan: they should not see or extract executive RAB reports
  if (currentRole === 'pic_lapangan') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Akses Terbatas — Modul Khusus Eksekutif & Auditor
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Modul Otomasi Pembuatan Laporan & Ekstraksi RAB hanya dapat diakses oleh <strong>Project Controller</strong> dan <strong>Auditor Head</strong>. Sebagai PIC Lapangan, fokus Anda adalah penyelesaian checklist fisik di lapangan.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Kembali ke Tugas Harian Lapangan</span>
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
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              {isAuditor ? 'Kertas Kerja & Audit Reporting' : 'Modul Pelaporan Terpadu'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {isAuditor
              ? 'Kertas Kerja Audit, Berita Acara (BAP) & LHE'
              : 'Otomasi Pembuatan Laporan & Integrasi RAB'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAuditor
              ? 'Ekstraksi komprehensif audit trail to-do PIC, pengesahan opname fisik, dan Laporan Hasil Evaluasi (LHE) kepatuhan Proyek Telocor Sidoarjo.'
              : 'Ekstraksi komprehensif data anggaran, penerbitan BAP fisik, dan laporan audit mingguan berstandar enterprise.'}
          </p>
        </div>
      </div>

      {/* Main Reporting & Action Panel */}
      <ReportActionPanel />
    </div>
  )
}
