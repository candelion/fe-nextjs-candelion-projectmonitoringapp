'use client'

import React from 'react'
import { useRole } from '@/contexts/RoleContext'
import { FileText, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'

export default function HeroBanner() {
  const { currentRole, currentUser, lastSyncTime } = useRole()
  const isAuditor = currentRole === 'auditor_head'

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 p-5 sm:p-7 text-white shadow-lg shadow-indigo-900/15 mb-6">
      {/* Decorative background shapes */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute right-20 top-0 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        {/* Left Side: Icon + Titles */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">
                {isAuditor ? 'AUDIT KEPATUHAN & PENGAWASAN' : 'PROYEK AKTIF 2026'}
              </span>
              <span className="text-xs text-indigo-200 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {lastSyncTime}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isAuditor
                ? 'Audit Kepatuhan & Pengawasan Proyek'
                : 'Pusat Kendali Proyek'}
            </h1>
          </div>
        </div>

        {/* Right Side: Active Role Badge */}
        <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 sm:py-3 rounded-2xl border border-white/15 w-full sm:w-auto">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-left">
            <div className="text-[11px] text-indigo-200 font-medium">Sesi Login:</div>
            <div className="text-xs font-bold text-white">{currentUser.name}</div>
            <div className="text-[10px] text-emerald-300 font-semibold">{currentUser.roleTitle}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
