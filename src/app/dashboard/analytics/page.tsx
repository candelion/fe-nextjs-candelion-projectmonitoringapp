'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRole } from '@/contexts/RoleContext'
import { useTaskData } from '@/contexts/TaskDataContext'
import CircularProgressChart from '@/components/analytics/CircularProgressChart'
import TargetVsRealisasiChart from '@/components/analytics/TargetVsRealisasiChart'
import EarlyWarningSystem from '@/components/analytics/EarlyWarningSystem'
import ZoneGridCards from '@/components/dashboard/ZoneGridCards'
import {
  LineChart,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  HardHat,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

export default function AnalyticsDashboardPage() {
  const { currentRole } = useRole()
  const { taskPackages, evidencePhotos } = useTaskData()
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

  // Dynamic calculations from PIC tasks and Auditor verification
  const allSubTasks = taskPackages.flatMap((p) => p.subTasks)
  const totalSubTasksCount = allSubTasks.length
  const completedByPicCount = allSubTasks.filter((st) => st.isCompleted).length
  const picExecutionRate = totalSubTasksCount > 0 ? ((completedByPicCount / totalSubTasksCount) * 100).toFixed(1) : '0'

  const verifiedAuditorCount = allSubTasks.filter((st) => st.auditStatus === 'verified').length
  const pendingAuditCount = allSubTasks.filter((st) => !st.auditStatus || st.auditStatus === 'pending').length
  const flaggedAuditCount = allSubTasks.filter((st) => st.auditStatus === 'flagged').length

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
              {isAuditor ? 'Evaluasi Pengawasan & Audit Deviasi' : 'Modul Analitik & Evaluasi Real-Time'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {isAuditor
              ? 'Evaluasi Kurva S, Deviasi & Kepatuhan Proyek'
              : 'Dasbor Pemantauan Progres Real-Time (PIC & Audit)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAuditor
              ? 'Analisis independen terhadap deviasi kurva S, uji sampling opname fisik PIC, dan evaluasi hasil checklist To-Do di lapangan.'
              : 'Pemantauan real-time integrasi antara kecepatan eksekusi sub-tugas PIC Lapangan dan validasi kepatuhan oleh Auditor Head.'}
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

      {/* ── LIVE SYNC KPI STRIP: PIC EXECUTION VS AUDITOR VERIFICATION ────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Sinkronisasi Pemantauan Real-Time: Peran PIC vs Auditor
              </h3>
              <p className="text-xs text-slate-500">
                Progres fisik aktual dihitung dari penyelesaian tugas PIC dan validasi berita acara oleh Auditor
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
            ● Live Data Sinkron
          </span>
        </div>

        {/* 4 Comparative Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Card 1: Pelaksanaan PIC */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-800 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <HardHat className="w-4 h-4 text-emerald-600" />
                  Eksekusi PIC Lapangan
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {picExecutionRate}% Selesai
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-950 mt-1">
                {completedByPicCount}{' '}
                <span className="text-xs font-normal text-emerald-700">/ {totalSubTasksCount} Sub-Tugas</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-700 mt-3 pt-2 border-t border-emerald-200/60">
              Dikerjakan langsung oleh PIC (Hendra Wijaya & tim)
            </p>
          </div>

          {/* Card 2: Verifikasi Auditor Valid */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-teal-800 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Verifikasi Auditor (BAP)
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                  Sah
                </span>
              </div>
              <div className="text-2xl font-black text-teal-950 mt-1">
                {verifiedAuditorCount}{' '}
                <span className="text-xs font-normal text-teal-700">Sub-Tugas Sah</span>
              </div>
            </div>
            <p className="text-[11px] text-teal-700 mt-3 pt-2 border-t border-teal-200/60">
              Disetujui Auditor Head (Budi Santoso) dengan dokumen BAP
            </p>
          </div>

          {/* Card 3: Menunggu Audit */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-amber-800 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Dalam Evaluasi Audit
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Antrean
                </span>
              </div>
              <div className="text-2xl font-black text-amber-950 mt-1">
                {pendingAuditCount}{' '}
                <span className="text-xs font-normal text-amber-700">Menunggu Review</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-700 mt-3 pt-2 border-t border-amber-200/60">
              PIC telah submit bukti foto, menunggu opname Auditor
            </p>
          </div>

          {/* Card 4: Temuan / Revisi */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-rose-800 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Catatan Toleransi Mutu
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  Atensi
                </span>
              </div>
              <div className="text-2xl font-black text-rose-950 mt-1">
                {flaggedAuditCount}{' '}
                <span className="text-xs font-normal text-rose-700">Perlu Penyesuaian</span>
              </div>
            </div>
            <p className="text-[11px] text-rose-700 mt-3 pt-2 border-t border-rose-200/60">
              Overlap Geotextile & deviasi tiang pancang (dalam toleransi)
            </p>
          </div>
        </div>

        {/* Real-Time Table: Matrix of Task Packages with PIC & Auditor */}
        <div className="mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Paket Pekerjaan</th>
                <th className="py-2.5 px-3">PIC Pelaksana</th>
                <th className="py-2.5 px-3">Auditor Penilai</th>
                <th className="py-2.5 px-3">Eksekusi PIC (To-Do)</th>
                <th className="py-2.5 px-3">Status Verifikasi Audit</th>
                <th className="py-2.5 px-3 text-right">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {taskPackages.map((pkg) => {
                const pkgDone = pkg.subTasks.filter((st) => st.isCompleted).length
                const pkgTotal = pkg.subTasks.length
                const pkgPercent = pkgTotal > 0 ? Math.round((pkgDone / pkgTotal) * 100) : 0
                const allVerified = pkg.subTasks.every((st) => st.auditStatus === 'verified')
                const hasPending = pkg.subTasks.some((st) => !st.auditStatus || st.auditStatus === 'pending')

                return (
                  <tr key={pkg.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{pkg.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{pkg.code} • {pkg.zoneCode}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <HardHat className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pkg.assignedPic || 'Hendra Wijaya, S.T.'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{pkg.assignedAuditor || 'Budi Santoso, S.E.'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${pkgPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">
                          {pkgDone}/{pkgTotal} ({pkgPercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {allVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          100% Sah BAP
                        </span>
                      ) : hasPending ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Sebagian Menunggu Audit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                          Sedang Berjalan
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/dashboard/site-intelligence?point=${pkg.pointId || 'P-01'}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition"
                      >
                        <span>{pkg.pointId || 'P-01'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

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
