'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'
import { UserRole } from '@/types'
import { USER_PROFILES } from '@/data/dummyData'
import { ShieldCheck, UserCheck, HardHat, ArrowRight, Lock, Mail, Building2, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { currentRole, switchRole } = useRole()
  const [email, setEmail] = useState('diana.putri@candelion.id')
  const [password, setPassword] = useState('••••••••••••')
  const [isLoading, setIsLoading] = useState(false)

  const rolesList: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      role: 'project_controller',
      title: 'Project Controller',
      subtitle: 'Diana Putri, S.T., M.M.',
      icon: UserCheck,
      color: 'border-indigo-500 bg-indigo-50/60 text-indigo-700',
    },
    {
      role: 'auditor_head',
      title: 'Auditor Head',
      subtitle: 'Budi Santoso, S.E., Ak.',
      icon: ShieldCheck,
      color: 'border-teal-500 bg-teal-50/60 text-teal-700',
    },
    {
      role: 'pic_lapangan',
      title: 'PIC Lapangan',
      subtitle: 'Hendra Wijaya, S.T.',
      icon: HardHat,
      color: 'border-emerald-500 bg-emerald-50/60 text-emerald-700',
    },
  ]

  const handleRoleChange = (role: UserRole) => {
    switchRole(role)
    const profile = USER_PROFILES[role]
    if (profile) {
      setEmail(profile.email)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 600)
  }

  const activeProfile = USER_PROFILES[currentRole]

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f0f4f8] overflow-hidden">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-indigo-300/30 to-purple-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-emerald-300/30 to-teal-300/20 blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[300px] h-[300px] rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-xl">
        {/* Top Brand Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md mb-3 text-xs font-semibold text-slate-700 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Candelion Digital Enterprise
          </div>
          <Image src="/logo/logo_candelion.png" alt="Candelion" width={52} height={52} className="mx-auto rounded-2xl mb-3 object-contain" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sistem Pemantauan Terpadu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitoring Progres Fisik, Akuntabilitas PIC, & Pengawasan Audit Proyek
          </p>
        </div>

        {/* Main Login Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Segmented Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  Pilih Role Akses
                </label>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Simulasi Mode
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {rolesList.map((item) => {
                  const Icon = item.icon
                  const isSelected = currentRole === item.role
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleChange(item.role)}
                      className={`relative flex flex-col items-start text-left p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${item.color} shadow-sm ring-2 ring-indigo-500/20 font-semibold`
                          : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-white shadow-xs' : 'bg-slate-200/70 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <span className="text-xs font-bold leading-tight">{item.title}</span>
                      <span className="text-[11px] opacity-75 mt-0.5 truncate w-full">
                        {item.subtitle.split(',')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Active Role Info Pill */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Akses Terpilih: <strong>{activeProfile?.roleTitle}</strong> ({activeProfile?.name})</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  {activeProfile?.permissions[0]}
                </span>
              </div>
            </div>

            {/* Email & Password Input */}
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Email Institusi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    placeholder="nama@candelion.id"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi Keamanan
                  </label>
                  <span className="text-[11px] text-slate-400 cursor-not-allowed">
                    Enkripsi TLS 1.3
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition duration-150 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400 flex items-center justify-center gap-4">
          <span>Ref Kontrak: KTR-2026/CND/089</span>
          <span>•</span>
          <span>Versi Sistem 2.4.0 (Enterprise)</span>
        </div>
      </div>
    </div>
  )
}
