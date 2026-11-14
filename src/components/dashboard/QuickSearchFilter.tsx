'use client'

import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface QuickSearchFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
}

export default function QuickSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: QuickSearchFilterProps) {
  const categories = ['Semua Zona', 'Zona A (Pondasi)', 'Zona B (Kolom Lt.2)', 'Zona C (MEP)', 'Zona D (Fasad)']

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left prompt matching IMG_4852 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Cari Kategori Pemantauan
            </h3>
            <p className="text-xs text-slate-400">
              Temukan zona, pos anggaran RAB, atau dokumen verifikasi dengan cepat.
            </p>
          </div>
        </div>

        {/* Right input search box matching IMG_4852 */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pekerjaan atau zona..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>
        </div>
      </div>

      {/* Quick category pills */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold shrink-0 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Filter:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}

