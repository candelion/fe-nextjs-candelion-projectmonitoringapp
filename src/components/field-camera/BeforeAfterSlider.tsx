'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Sliders, Eye, Sparkles } from 'lucide-react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Kondisi Awal (Sebelum)',
  afterLabel = 'Progres Terkini (Sesudah)',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(position)
  }, [])

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Komparasi Interaktif Before / After Proyek
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> Posisi: {Math.round(sliderPosition)}%
        </span>
      </div>

      {/* Slider Viewport */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[280px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-200/80 bg-slate-900 shadow-inner"
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* After Label Tag */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          {afterLabel}
        </div>

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
          {/* Before Label Tag */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold shadow-md backdrop-blur-xs">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Divider Bar & Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-2xl flex items-center justify-center cursor-ew-resize"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-indigo-700 shadow-xl border-2 border-indigo-600 flex items-center justify-center transition-transform hover:scale-110">
            <Sliders className="w-3.5 h-3.5 rotate-90" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
        <span>Zona B: Kolom K4 & Balok B2 Lt. 2</span>
        <span className="font-semibold text-emerald-600">Verifikasi Visual: 100% Cocok dengan As-Built Drawing</span>
      </div>
    </div>
  )
}

