'use client'

import React, { useState } from 'react'
import { REPORTING_METRICS, RECENT_DOCUMENTS } from '@/data/dummyData'
import { useRole } from '@/contexts/RoleContext'
import {
  FileSpreadsheet,
  FileText,
  Download,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Search,
  ExternalLink,
  Printer,
  Share2,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react'

export default function ReportActionPanel() {
  const { currentRole } = useRole()
  const isAuditor = currentRole === 'auditor_head'

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isExtractingRab, setIsExtractingRab] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [searchDoc, setSearchDoc] = useState('')

  const handleGeneratePdf = () => {
    setIsGeneratingPdf(true)
    setTimeout(() => {
      setIsGeneratingPdf(false)
      setSuccessToast(
        isAuditor
          ? 'Laporan Hasil Evaluasi (LHE) Audit & Kepatuhan Berhasil Diterbitkan (PDF)!'
          : 'Dokumen Laporan Terpadu (Rekapitulasi PIC & Verifikasi Auditor) Berhasil Diterbitkan (PDF)!'
      )
      setTimeout(() => setSuccessToast(null), 4000)
    }, 1500)
  }

  const handleExtractRab = () => {
    setIsExtractingRab(true)
    setTimeout(() => {
      setIsExtractingRab(false)
      setSuccessToast(
        isAuditor
          ? 'Ekstraksi Kertas Kerja Audit (KKA) & Rekap To-Do PIC (.xlsx) Berhasil!'
          : 'Ekstraksi Rekapitulasi Progres & Checklist Fisik (.xlsx) Berhasil!'
      )
      setTimeout(() => setSuccessToast(null), 4000)
    }, 1200)
  }

  const filteredDocs = RECENT_DOCUMENTS.filter(
    (d) =>
      d.title.toLowerCase().includes(searchDoc.toLowerCase()) ||
      d.code.toLowerCase().includes(searchDoc.toLowerCase()) ||
      d.author.toLowerCase().includes(searchDoc.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Main Reporting & Metrics Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                isAuditor ? 'bg-teal-50 text-teal-800' : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              {isAuditor ? <ShieldCheck className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isAuditor ? 'Kertas Kerja & Audit Engine' : 'Mesin Kompilasi Dokumen Otomatis'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAuditor
                ? 'Penerbitan LHE Audit & Kertas Kerja Akuntabilitas'
                : 'Otomasi Rekapitulasi Laporan PIC & Verifikasi Auditor'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {isAuditor
                ? 'Ekstraksi komprehensif seluruh evaluasi To-Do PIC, pengesahan opname fisik, dan rekapitulasi kepatuhan spesifikasi teknis Proyek Telocor Sidoarjo.'
                : 'Kompilasi otomatis rekaman pekerjaan To-Do PIC lapangan, log foto geotagging bukti fisik, dan catatan verifikasi auditor ke dalam laporan terpadu siap cetak.'}
            </p>
          </div>

          {/* Action Buttons: "Generate PDF" & "Ekstrak Rekap XLSX" */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl active:scale-[0.98] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-75 ${
                isAuditor
                  ? 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isAuditor ? 'Mengompilasi LHE...' : 'Mengompilasi PDF...'}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>{isAuditor ? 'Generate LHE Audit (PDF)' : 'Generate PDF Laporan Terpadu'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleExtractRab}
              disabled={isExtractingRab}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-75"
            >
              {isExtractingRab ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isAuditor ? 'Mengekstrak KKA...' : 'Mengekstrak Excel...'}</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isAuditor ? 'Ekstrak KKA To-Do (.xlsx)' : 'Ekstrak Rekap Progres (.xlsx)'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">
                Total Checklist To-Do PIC
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                14 Sub-Tugas
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                10 Selesai • 4 Dalam Progres
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">
                Status Verifikasi Auditor
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                100% BAP Disahkan
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                9 Valid SNI • 1 Catatan Toleransi
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">
                Efisiensi Waktu Rekapitulasi
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {REPORTING_METRICS.waktuRekapDihemat}
              </div>
              <div className="text-[11px] text-teal-600 font-semibold mt-0.5">
                {REPORTING_METRICS.efisiensiPersen} Lebih Cepat dari Manual
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Published Documents Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Dokumen Laporan & Ekstraksi Terbit
            </h3>
            <p className="text-xs text-slate-400">
              Riwayat dokumen yang dapat diunduh dan diaudit
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              placeholder="Cari nomor dokumen..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">No. Dokumen</th>
                <th className="py-3 px-4">Judul Laporan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Tanggal Terbit</th>
                <th className="py-3 px-4">Otorisasi & PIC</th>
                <th className="py-3 px-4">Status Audit</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {doc.code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{doc.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{doc.zone} • {doc.fileSize}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {doc.dateIssued}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {doc.author}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        doc.status === 'Terverifikasi'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSuccessToast(`Mengunduh berkas ${doc.code}...`)
                        setTimeout(() => setSuccessToast(null), 3000)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

