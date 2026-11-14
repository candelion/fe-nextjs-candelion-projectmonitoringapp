'use client'

import React, { useState } from 'react'
import { ZONES_DATA } from '@/data/dummyData'
import { ZoneItem } from '@/types'
import {
  Wallet,
  Building,
  Landmark,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  User,
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  FileText,
} from 'lucide-react'
import Link from 'next/link'

interface ZoneGridCardsProps {
  filterCategory?: string
  searchQuery?: string
}

export default function ZoneGridCards({
  filterCategory = 'Semua Zona',
  searchQuery = '',
}: ZoneGridCardsProps) {
  const [selectedZoneModal, setSelectedZoneModal] = useState<ZoneItem | null>(null)

  const filteredZones = ZONES_DATA.filter((zone) => {
    const matchesCategory =
      filterCategory === 'Semua Zona' ||
      zone.code.toLowerCase().includes(filterCategory.toLowerCase().slice(0, 6))
    const matchesSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.pic.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'wallet':
        return { icon: Wallet, bg: 'bg-emerald-500 text-white' }
      case 'bank':
        return { icon: Building, bg: 'bg-indigo-600 text-white' }
      case 'building':
        return { icon: Landmark, bg: 'bg-blue-600 text-white' }
      default:
        return { icon: Layers, bg: 'bg-purple-600 text-white' }
    }
  }

  const getStatusBadge = (status: string, label: string) => {
    if (status === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {label}
        </span>
      )
    }
    if (status === 'delayed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {label}
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        {label}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Pemantauan Progres per Pos & Zona
          </h2>
          <p className="text-xs text-slate-500">
            Klik kartu zona untuk melihat rincian BAP opname, pengawasan fisik, dan audit trail.
          </p>
        </div>
        <Link
          href="/dashboard/site-intelligence"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
        >
          <span>Buka Peta Zona</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredZones.map((zone) => {
          const { icon: Icon, bg } = getIcon(zone.iconType)
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZoneModal(zone)}
              className="group bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-0.5"
            >
              <div>
                {/* Image Banner if available */}
                {zone.imageUrl && (
                  <div className="mb-3.5 -mx-6 -mt-6 h-28 overflow-hidden rounded-t-3xl relative">
                    <img
                      src={zone.imageUrl}
                      alt={zone.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {zone.code} • Telocor Sidoarjo
                      </span>
                    </div>
                  </div>
                )}

                {/* Header: Icon box + Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${bg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {getStatusBadge(zone.status, zone.statusLabel)}
                </div>

                {/* Zone Code & Title */}
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center justify-between">
                  <span>{zone.code}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-500">Klik Detail →</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5 truncate group-hover:text-indigo-600 transition-colors">
                  {zone.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {zone.subtitle}
                </p>

                {/* Progress bar section */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Progres Fisik</span>
                    <span className="text-emerald-600">{zone.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        zone.status === 'delayed' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${zone.progress}%` }}
                    />
                  </div>
                </div>

                {/* Checkbox items */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {zone.prosedurValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        zone.prosedurValid ? 'text-slate-700' : 'text-rose-600'
                      }`}
                    >
                      Prosedur Teknis SNI
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {zone.dokumenValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        zone.dokumenValid ? 'text-slate-700' : 'text-amber-600'
                      }`}
                    >
                      Dokumen Checklist & BAP
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {zone.signOffValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`font-semibold ${
                        zone.signOffValid ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      Sign-off Valid PIC
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: PIC Name */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-700 font-semibold">{zone.pic}</strong>
                </span>
                <span className="font-semibold text-indigo-600 shrink-0">
                  {zone.status === 'completed' ? '100% Selesai' : 'Aktif Pengerjaan'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Interactive Zone Detail Modal (Opens when ANY zone card is clicked!) ── */}
      {selectedZoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {selectedZoneModal.code} • Sektor Pelaksanaan & Pengawasan
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedZoneModal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedZoneModal.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedZoneModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Zone Photo Preview if available */}
            {selectedZoneModal.imageUrl && (
              <div className="h-44 rounded-2xl overflow-hidden relative border border-slate-200">
                <img
                  src={selectedZoneModal.imageUrl}
                  alt={selectedZoneModal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-xl text-white text-[10px] font-mono">
                  📍 {selectedZoneModal.code}: Telocor Sidoarjo (Lat: {selectedZoneModal.coordinates.lat}, Long: {selectedZoneModal.coordinates.lng})
                </div>
              </div>
            )}

            {/* Status & Progress Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[11px] block">Status Pengerjaan</span>
                <div className="mt-1">
                  {getStatusBadge(selectedZoneModal.status, selectedZoneModal.statusLabel)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[11px] block">Realisasi Fisik</span>
                <span className="text-lg font-black text-emerald-600 mt-0.5 block">
                  {selectedZoneModal.progress}%{' '}
                  <span className="text-[11px] font-normal text-slate-400">
                    (Target: {selectedZoneModal.targetProgress}%)
                  </span>
                </span>
              </div>
            </div>

            {/* Checklist Validasi */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <h4 className="font-bold text-slate-800 mb-2">Checklist & Kepatuhan SNI</h4>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-700">Prosedur Pengujian Teknis Lapangan (Valid)</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedZoneModal.dokumenValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-slate-700">Dokumen BAP Fisik & Checklist SNI</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedZoneModal.signOffValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-slate-700">Sign-off Otorisasi Pengawas Lapangan</span>
              </div>
            </div>

            {/* Summary & Coordinates */}
            <div className="text-xs text-slate-600 leading-relaxed bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100">
              <p className="font-semibold text-slate-800 mb-1">Catatan Evaluasi Mutu:</p>
              <p>{selectedZoneModal.summary}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>PIC: <strong>{selectedZoneModal.pic}</strong></span>
              <span>Diperbarui: <strong>{selectedZoneModal.lastUpdated}</strong></span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard/site-intelligence"
                onClick={() => setSelectedZoneModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition"
              >
                Buka Posisi di Peta
              </Link>
              <button
                onClick={() => setSelectedZoneModal(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
