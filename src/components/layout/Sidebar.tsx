'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'
import {
  LayoutDashboard,
  LineChart,
  Camera,
  MapPin,
  FileSpreadsheet,
  ClipboardList,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const { currentRole } = useRole()

  // ─── Role-based navigation ─────────────────────────────────────────────────
  const getNavItems = () => {
    if (currentRole === 'pic_lapangan') {
      return [
        {
          name: 'Tugas Harian',
          href: '/dashboard',
          icon: ClipboardList,
          badge: 'To-Do',
        },
        {
          name: 'Dokumentasi Lapangan',
          href: '/dashboard/dokumentasi',
          icon: Camera,
          badge: 'Foto',
        },
        {
          name: 'Site Intelligence',
          href: '/dashboard/site-intelligence',
          icon: MapPin,
          badge: 'Peta',
        },
      ]
    }

    if (currentRole === 'auditor_head') {
      return [
        {
          name: 'Audit & Kepatuhan To-Do',
          href: '/dashboard',
          icon: ClipboardList,
          badge: 'Audit',
        },
        {
          name: 'Evaluasi Deviasi & Kurva S',
          href: '/dashboard/analytics',
          icon: LineChart,
          badge: 'Deviasi',
        },
        {
          name: 'Audit Bukti Lapangan',
          href: '/dashboard/dokumentasi',
          icon: Camera,
          badge: 'Forensik',
        },
        {
          name: 'Audit Geospasial Telocor',
          href: '/dashboard/site-intelligence',
          icon: MapPin,
          badge: 'Poligon',
        },
        {
          name: 'Kertas Kerja & LHE',
          href: '/dashboard/laporan',
          icon: FileSpreadsheet,
          badge: 'LHE',
        },
      ]
    }

    // Default: project_controller
    return [
      {
        name: 'Pusat Kendali Proyek',
        href: '/dashboard',
        icon: LayoutDashboard,
        badge: 'Utama',
      },
      {
        name: 'Pemantauan Real-Time',
        href: '/dashboard/analytics',
        icon: LineChart,
        badge: 'Live',
      },
      {
        name: 'Dokumentasi Lapangan',
        href: '/dashboard/dokumentasi',
        icon: Camera,
        badge: 'Pantau',
      },
      {
        name: 'Site Intelligence',
        href: '/dashboard/site-intelligence',
        icon: MapPin,
        badge: 'Peta',
      },
      {
        name: 'Otomasi Laporan Proyek',
        href: '/dashboard/laporan',
        icon: FileSpreadsheet,
        badge: 'Laporan',
      },
    ]
  }

  const mainNavigation = getNavItems()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/'
    }
    return pathname.startsWith(path)
  }


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar — single panel, no duplicated zona strip */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/80 flex flex-col shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <Image
            src="/logo/logo_candelion.png"
            alt="Candelion"
            width={36}
            height={36}
            className="rounded-xl object-contain shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
              Candelion
            </span>
            <span className="text-[10px] font-medium text-slate-500 mt-1 leading-none truncate">
              Sistem Pemantauan Terpadu
            </span>
          </div>
        </div>

        {/* Navigation Section — role-filtered */}
        <div className="px-3.5 py-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">
            Modul Pemantauan
          </div>
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                        active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {active ? (
                    <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Role-specific bottom status card */}
        {currentRole === 'project_controller' && (
          <div className="p-3 m-3 mt-0 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs shrink-0">
            <div className="flex items-center justify-between text-indigo-900 text-[11px] mb-1 font-bold">
              <span>Admin Pusat HQ</span>
              <span className="text-indigo-600 font-extrabold">Full Control</span>
            </div>
            <div className="font-black text-indigo-950 truncate text-[11px]">
              KTR-2026/CND/089
            </div>
            <div className="text-[10px] text-indigo-700 mt-1">
              Kendali PIC, Auditor & Poligon
            </div>
          </div>
        )}

        {currentRole === 'auditor_head' && (
          <div className="p-3 m-3 mt-0 rounded-2xl bg-teal-50/80 border border-teal-100 text-xs shrink-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-teal-800 font-bold">Mandat Audit</span>
              <span className="text-emerald-700 font-semibold">Aktif</span>
            </div>
            <div className="font-bold text-teal-950 truncate text-[11px]">
              KTR-2026/CND/089
            </div>
            <div className="text-[10px] text-teal-700 mt-1">
              Pengawasan Telocor Sidoarjo
            </div>
          </div>
        )}

        {currentRole === 'pic_lapangan' && (
          <div className="p-3 m-3 mt-0 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs shrink-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-emerald-700 font-bold">Zona Aktif Anda</span>
              <span className="text-emerald-600 font-semibold">On Site</span>
            </div>
            <div className="font-bold text-emerald-900">Zona B — Kolom Lt. 2</div>
            <div className="text-[10px] text-emerald-600 mt-1">
              PIC: Hendra Wijaya, S.T.
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
