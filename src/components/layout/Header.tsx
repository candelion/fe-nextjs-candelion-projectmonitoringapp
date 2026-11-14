'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'
import { UserRole } from '@/types'
import { USER_PROFILES, WARNING_NOTIFICATIONS } from '@/data/dummyData'
import {
  Menu,
  Home,
  ChevronRight,
  RefreshCw,
  Bell,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  HardHat,
  LogOut,
  AlertTriangle,
  Hammer,
} from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname()
  const { currentRole, currentUser, switchRole, rabSyncStatus, triggerRabSync } = useRole()
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  // Role-aware page title
  const getPageTitle = () => {
    if (pathname.includes('/analytics')) {
      return currentRole === 'auditor_head'
        ? 'Evaluasi Kurva S & Deviasi Lapangan'
        : 'Pemantauan Progres Real-Time'
    }
    if (pathname.includes('/dokumentasi')) {
      return currentRole === 'auditor_head'
        ? 'Audit Keabsahan & Forensik Bukti Foto'
        : 'Dokumentasi Lapangan'
    }
    if (pathname.includes('/site-intelligence')) {
      return currentRole === 'auditor_head'
        ? 'Audit Geospasial & Perimeter Telocor'
        : 'Site Intelligence: Pemetaan & Kotak Poligon'
    }
    if (pathname.includes('/laporan')) {
      return currentRole === 'auditor_head'
        ? 'Kertas Kerja Audit & Penerbitan LHE'
        : 'Otomasi Pembuatan Laporan & RAB'
    }
    // Main dashboard view
    if (currentRole === 'pic_lapangan') return 'Tugas Harian Lapangan'
    if (currentRole === 'auditor_head') return 'Audit Kepatuhan & Evaluasi To-Do PIC'
    return 'Pusat Kendali Proyek & Integrasi RAB (Admin Pusat)'
  }

  // Filter notifications by role — PIC only sees site-level alerts
  const relevantNotifs = WARNING_NOTIFICATIONS.filter((n) => {
    if (currentRole === 'pic_lapangan') {
      return n.zoneCode === 'ZONA B' || n.zoneCode === 'SITE SAFETY'
    }
    return true // project_controller and auditor_head see all
  })

  const roleOptions: { role: UserRole; name: string; title: string; icon: any }[] = [
    { role: 'project_controller', name: 'Diana Putri', title: 'Project Controller', icon: UserCheck },
    { role: 'auditor_head', name: 'Budi Santoso', title: 'Auditor Head', icon: ShieldCheck },
    { role: 'pic_lapangan', name: 'Hendra Wijaya', title: 'PIC Lapangan', icon: HardHat },
  ]

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium min-w-0">
          <Link
            href="/dashboard"
            className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 flex items-center justify-center transition shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="hidden sm:block font-semibold text-slate-500 shrink-0">
            Candelion
          </span>
          <ChevronRight className="hidden sm:block w-3 h-3 text-slate-300 shrink-0" />
          <span className="font-bold text-slate-900 truncate">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right: role-aware actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Project Controller: RAB Live Sync Badge */}
        {currentRole === 'project_controller' && (
          <button
            onClick={triggerRabSync}
            title="Klik untuk menyinkronkan data RAB terbaru"
            className="group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold transition cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${
                  rabSyncStatus === 'syncing' ? 'duration-200' : ''
                }`}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>RAB Live Sync</span>
            <RefreshCw
              className={`w-3.5 h-3.5 text-emerald-600 group-hover:rotate-180 transition-transform duration-500 ${
                rabSyncStatus === 'syncing' ? 'animate-spin' : ''
              }`}
            />
          </button>
        )}

        {/* Auditor Head: Audit Trail Aktif Badge */}
        {currentRole === 'auditor_head' && (
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Audit Trail Aktif</span>
          </span>
        )}

        {/* PIC: simple "On Site" status badge */}
        {currentRole === 'pic_lapangan' && (
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <Hammer className="w-3.5 h-3.5 text-emerald-600" />
            <span>On Site — Telocor Sidoarjo</span>
          </span>
        )}

        {/* Notifications Bell — filtered per role */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {relevantNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs text-slate-800">
                    {currentRole === 'pic_lapangan' ? 'Peringatan Zona Anda' : 'Peringatan Proyek & Log'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                  {relevantNotifs.length} Aktif
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {relevantNotifs.map((n) => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-800 leading-tight">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.zoneCode}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {n.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {n.timestamp}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="w-full mt-2 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}
        </div>

        {/* Profile + Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name.split(',')[0]}
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold">
                {currentUser.roleTitle}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ganti Role Simulasi
              </div>
              <div className="space-y-1">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon
                  const isCurrent = currentRole === opt.role
                  return (
                    <button
                      key={opt.role}
                      onClick={() => {
                        switchRole(opt.role)
                        setIsRoleDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold">{opt.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {opt.title}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setIsRoleDropdownOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar ke Halaman Login</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
