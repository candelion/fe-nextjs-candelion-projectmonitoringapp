'use client'

import React from 'react'
import { CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'

export default function CircularProgressChart() {
  const percentage = 75
  const circumference = 2 * Math.PI * 46
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Capaian Progres Kumulatif
            </h3>
            <p className="text-xs text-slate-400">
              Konsolidasi seluruh bobot pekerjaan zona
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            On Schedule
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center my-6">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 110 110">
            {/* Background Circle */}
            <circle
              cx="55"
              cy="55"
              r="46"
              stroke="currentColor"
              strokeWidth="9"
              className="text-slate-100"
              fill="transparent"
            />
            {/* Target Ring subtle */}
            <circle
              cx="55"
              cy="55"
              r="46"
              stroke="currentColor"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (80 / 100) * circumference}
              className="text-indigo-200/50"
              fill="transparent"
              strokeLinecap="round"
            />
            {/* Actual Progress Ring */}
            <circle
              cx="55"
              cy="55"
              r="46"
              stroke="currentColor"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-emerald-500 transition-all duration-1000 ease-out"
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              75%
            </span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
              Selesai
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Target: 80% (Dev -5%)
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-400">Pekerjaan Selesai</div>
          <div className="font-bold text-slate-800 text-sm mt-0.5">Zona A (100%)</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Valid Penuh
          </div>
        </div>
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-400">Pekerjaan Berjalan</div>
          <div className="font-bold text-slate-800 text-sm mt-0.5">Zona B, C, D</div>
          <div className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" /> 1 Perlu Atensi
          </div>
        </div>
      </div>
    </div>
  )
}

