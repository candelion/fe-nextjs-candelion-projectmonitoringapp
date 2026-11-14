'use client'

import React, { useState } from 'react'
import { WARNING_NOTIFICATIONS } from '@/data/dummyData'
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react'

export default function EarlyWarningSystem() {
  const [warnings, setWarnings] = useState(WARNING_NOTIFICATIONS)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')

  const toggleStatus = (id: string) => {
    setWarnings((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status:
                w.status === 'Aktif'
                  ? 'Ditindaklanjuti'
                  : w.status === 'Ditindaklanjuti'
                  ? 'Selesai'
                  : 'Aktif',
            }
          : w
      )
    )
  }

  const filtered = warnings.filter((w) => {
    if (filterSeverity === 'all') return true
    return w.severity === filterSeverity
  })

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return {
          icon: AlertOctagon,
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          cardBorder: 'border-l-4 border-l-rose-500',
          label: 'Kritis',
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          cardBorder: 'border-l-4 border-l-amber-500',
          label: 'Peringatan',
        }
      default:
        return {
          icon: Info,
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          cardBorder: 'border-l-4 border-l-blue-500',
          label: 'Informasi',
        }
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Sistem Peringatan Dini Proyek
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deteksi otomatis anomali jadwal, pasokan logistik, dan deviasi mutu lapangan
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 text-xs">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'critical', label: 'Kritis' },
            { id: 'warning', label: 'Perhatian' },
            { id: 'info', label: 'Info' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                filterSeverity === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Warnings List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const config = getSeverityBadge(item.severity)
          const Icon = config.icon
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 transition hover:bg-slate-100/70 ${config.cardBorder}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border shrink-0 mt-0.5 ${config.badge}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200/80 text-slate-700">
                        {item.zoneCode}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${config.badge}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Action */}
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`self-start sm:self-center shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    item.status === 'Selesai'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.status === 'Ditindaklanjuti'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Status: <strong>{item.status}</strong> (Ubah)
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

