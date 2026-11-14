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

        {/* Full-width main — no max-w constraint forcing narrow/mobile look */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <footer className="py-4 px-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
          Sistem Pemantauan Terpadu © 2026 PT Candelion Digital. Hak Cipta Dilindungi Undang-Undang.
        </footer>
      </div>
    </div>
  )
}
