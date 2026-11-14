'use client'

import React, { useState } from 'react'
import { DASHBOARD_SUMMARY } from '@/data/dummyData'
import {
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  ArrowUpRight,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

interface SummaryCardDetail {
  title: string
  metric: string
  details: string[]
  linkTo?: string
  linkLabel?: string
}

export default function SummaryCards() {
  const [selectedCardDetail, setSelectedCardDetail] = useState<SummaryCardDetail | null>(null)

  const cards = [
    {
      title: 'Paket Tugas & Pengawasan',
      value: '4 Paket / 14 Sub-Tugas',
      subtitle: '10 Selesai • 4 Dalam Progres',
      badge: 'Kendali Aktif',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      icon: ClipboardList,
      iconColor: 'bg-indigo-50 text-indigo-600',
      progress: 71.4,
      progressLabel: 'Tingkat Penyelesaian: 71.4%',
      footerText: 'Disupervisi 3 PIC & 1 Auditor',
      detailInfo: {
        title: 'Distribusi Penugasan & Supervisi Lapangan',
        metric: '14 Sub-Tugas (3 Zona Telocor)',
        details: [
          'Zona A (Dermaga): 4 Sub-tugas (100% Selesai)',
          'Zona B (Jetty K4): 5 Sub-tugas (3 Selesai, 2 Progres)',
          'Zona C (Breakwater): 3 Sub-tugas (1 Menunggu Audit, 2 Selesai)',
          'Zona D (Workshop): 2 Sub-tugas (100% Selesai)',
        ],
        linkTo: '/dashboard',
        linkLabel: 'Kelola Penugasan PIC & Auditor',
      },
    },
    {
      title: 'Kemajuan Fisik',
      value: DASHBOARD_SUMMARY.kemajuanFisik,
      subtitle: DASHBOARD_SUMMARY.kemajuanFisikBadge,
      badge: 'On Track',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: TrendingUp,
      iconColor: 'bg-emerald-50 text-emerald-600',
      progress: 86.4,
      progressLabel: 'Target Kurva S: 84.00%',
      footerText: 'Deviasi Positif +2.40%',
      detailInfo: {
        title: 'Evaluasi Progres Fisik vs Kurva S',
        metric: '86.40% Realisasi (Target 84.00%)',
        details: [
          'Minggu ke-8 menunjukkan deviasi positif +2.40%',
          'Pengecoran pondasi & bore pile 100% selesai',
          'Pekerjaan kolom K4 zona timur perlu percepatan',
          'Estimasi selesai tepat waktu: Desember 2026',
        ],
        linkTo: '/dashboard/analytics',
        linkLabel: 'Lihat Analitik Kurva S',
      },
    },
    {
      title: 'Akuntabilitas PIC',
      value: DASHBOARD_SUMMARY.akuntabilitasPic,
      subtitle: DASHBOARD_SUMMARY.akuntabilitasPicBadge,
      badge: 'Terverifikasi',
      badgeStyle: 'bg-teal-50 text-teal-700 border-teal-200/80',
      icon: ShieldCheck,
      iconColor: 'bg-teal-50 text-teal-600',
      progress: 100,
      progressLabel: '4 dari 4 Zona Tersertifikasi',
      footerText: 'Semua PIC Siaga Lapangan',
      detailInfo: {
        title: 'Daftar PIC Penanggung Jawab Zona',
        metric: '4 Zona Aktif — 100% Sign-off Valid',
        details: [
          'Zona A: Ir. Ahmad Zulkarnain (Bore Pile)',
          'Zona B: Hendra Wijaya, S.T. (Struktur Kolom)',
          'Zona C: Dian Nugraha, S.T. (MEP)',
          'Zona D: Rudi Hermawan (Fasad)',
        ],
        linkTo: '/dashboard/dokumentasi',
        linkLabel: 'Periksa Dokumentasi PIC',
      },
    },
    {
      title: 'Ref Dokumen Kontrak',
      value: DASHBOARD_SUMMARY.refDokumenKontrak,
      subtitle: DASHBOARD_SUMMARY.refDokumenKontrakBadge,
      badge: 'Audit Compliant',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200/80',
      icon: FileCheck2,
      iconColor: 'bg-blue-50 text-blue-600',
      progress: 100,
      progressLabel: 'Addendum 02 Disahkan',
      footerText: 'Masa Kontrak s/d Des 2026',
      detailInfo: {
        title: 'Legalitas & Ref Kontrak Proyek',
        metric: 'KTR-2026/CND/089 (Status Aktif)',
        details: [
          'Kategori: Kontrak Gabungan Lumsum dan Harga Satuan',
          'Addendum 02 disahkan oleh Auditor Head & Direksi',
          'Standar Kepatuhan: SNI 8460:2017 & ISO 9001:2015',
          'Jaminan Pelaksanaan & Pemeliharaan Terpenuhi',
        ],
        linkTo: '/dashboard/laporan',
        linkLabel: 'Buka Dokumen Kontrak & BAP',
      },
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              onClick={() => setSelectedCardDetail(card.detailInfo)}
              className="group bg-white rounded-3xl p-5 border border-slate-200/70 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-0.5"
            >
              <div>
                {/* Top Header: Icon + Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${card.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.badgeStyle}`}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Title & Big Metric */}
                <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
                  <span>{card.title}</span>
                  <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Detail ↗
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{card.subtitle}</span>
                </div>
              </div>

              {/* Progress Bar & Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                  <span>{card.progressLabel}</span>
                  <span>{card.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-medium">
                  {card.footerText}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Card Detail Modal */}
      {selectedCardDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Detail Indikator Kinerja
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {selectedCardDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCardDetail(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-xs font-semibold text-slate-500">Nilai Saat Ini:</span>
              <div className="text-lg font-black text-indigo-900 mt-0.5">
                {selectedCardDetail.metric}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700">Rincian Pos & Parameter:</span>
              {selectedCardDetail.details.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {selectedCardDetail.linkTo && (
                <Link
                  href={selectedCardDetail.linkTo}
                  onClick={() => setSelectedCardDetail(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition"
                >
                  {selectedCardDetail.linkLabel || 'Buka Modul'}
                </Link>
              )}
              <button
                onClick={() => setSelectedCardDetail(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
