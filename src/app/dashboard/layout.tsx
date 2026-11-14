'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      {/* Sidebar — single 256px panel, zona strip removed */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main area offset: 256px sidebar only on lg+ */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Header onMenuToggle={() => setSidebarOpen(true)} />

        {/* Full-width main — adaptive responsive spacing for mobile, tablet & desktop */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-8">
          {children}
        </main>

        <footer className="py-3 px-4 sm:px-6 border-t border-slate-200/60 text-center text-[11px] sm:text-xs text-slate-400">
          Sistem Pemantauan Terpadu © 2026 PT Candelion Digital. Hak Cipta Dilindungi Undang-Undang.
        </footer>
      </div>
    </div>
  )
}
