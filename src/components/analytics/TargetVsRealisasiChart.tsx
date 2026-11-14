'use client'

import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { TARGET_REALISASI_CHART_DATA } from '@/data/dummyData'
import { BarChart3 } from 'lucide-react'

export default function TargetVsRealisasiChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs h-[380px] flex items-center justify-center">
        <div className="text-slate-400 text-xs flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Memuat Grafik Analitik...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Perbandingan Target Rencana vs Realisasi Fisik
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-indigo-200 inline-block" />
            <span className="text-slate-500">Target Rencana (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
            <span className="text-slate-700">Realisasi Aktual (%)</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={TARGET_REALISASI_CHART_DATA}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="minggu"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200/80 text-xs">
                      <p className="font-bold text-slate-900 mb-1.5">{label}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4 text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-300" /> Target:
                          </span>
                          <span className="font-bold text-slate-800">{payload[0].value}%</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-emerald-600 font-bold">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Realisasi:
                          </span>
                          <span>{payload[1]?.value}%</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="target"
              name="Target"
              fill="#c7d2fe"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="realisasi"
              name="Realisasi"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span>Sumber: Buku Ukur Lapangan & Kurva S Addendum 02</span>
        <span className="font-semibold text-emerald-600">Deviasi Minggu 8: +2.40%</span>
      </div>
    </div>
  )
}

