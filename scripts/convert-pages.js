#!/usr/bin/env node
// Script to batch-rewrite all dashboard pages from server components to client components.
// Run from: fe-nextjs-hiwaya-hymedic/

const fs = require('fs')
const path = require('path')

const pages = [
  {
    file: 'src/app/login/page.tsx',
    content: `'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/ui/LoginForm'
import { useAppContext } from '@/contexts/AppContext'

export default function LoginPage() {
  const { token, dict } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      router.replace('/dashboard')
    }
  }, [token])

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-sky-600 via-indigo-700 to-violet-800 flex-col items-center justify-center p-16">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 text-white max-w-md">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">{dict.appName}</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Sistem Rekam Medis<br />
            <span className="text-sky-300">Kelas Enterprise</span>
          </h2>
          <p className="text-white/70 leading-relaxed text-lg">
            Solusi menyeluruh untuk manajemen rumah sakit. Dari pendaftaran pasien hingga billing, didesain untuk efisiensi dan keamanan data tertinggi.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['EMR Dinamis', 'FHIR Ready', 'BPJS Integration', 'Bilingual', 'Multi-Role'].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full bg-white/15 text-sm font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-sm">
          {/* Mobile logo only */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span className="font-bold text-lg">{dict.appName}</span>
          </div>

          <LoginForm dict={dict} />

          <p className="text-center text-xs text-zinc-400 mt-8">
            &copy; {new Date().getFullYear()} Hymedic. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/page.tsx',
    content: `'use client'

import { useEffect, useState } from 'react'
import { useAppContext, getUserRole } from '@/contexts/AppContext'
import HospitalAnalyticsDashboard from './HospitalAnalyticsDashboard'
import RadiologyAnalyticsDashboard from './RadiologyAnalyticsDashboard'
import LabAnalyticsDashboard from './LabAnalyticsDashboard'
import PharmacyAnalyticsDashboard from './PharmacyAnalyticsDashboard'

export default function DashboardPage() {
  const { token, dict, locale, user, isLoading } = useAppContext()
  const [stats, setStats] = useState({
    todayPatients: 0,
    activeQueue: 0,
    inpatientCount: 0,
    pendingBilling: 0,
    recentVisits: [] as any[],
  })

  const userRole = getUserRole(user)

  useEffect(() => {
    if (!token || isLoading) return
    if (['super_admin', 'receptionist', 'doctor', 'nurse', 'cashier', 'staff'].includes(userRole)) {
      fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/stats\`, {
        headers: { Authorization: \`Bearer \${token}\` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => { if (data?.data) setStats(data.data) })
        .catch(() => {})
    }
  }, [token, userRole, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (userRole === 'radiologist') return <RadiologyAnalyticsDashboard dict={dict} token={token} />
  if (userRole === 'lab_analyst') return <LabAnalyticsDashboard dict={dict} />
  if (userRole === 'pharmacist') return <PharmacyAnalyticsDashboard dict={dict} />

  return <HospitalAnalyticsDashboard dict={dict} stats={stats} locale={locale} />
}
`,
  },
  {
    file: 'src/app/dashboard/analytics/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import ExecutiveAnalyticsBoard from './ExecutiveAnalyticsBoard'

export default function AnalyticsPage() {
  const { dict, locale, token } = useAppContext()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.nav.analytics || 'Executive Analytics'}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          High-level overview of hospital performance, revenue, and patient demographics.
        </p>
      </div>
      <ExecutiveAnalyticsBoard dict={dict} locale={locale} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/billing/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import BillingBoard from './BillingBoard'

export default function BillingPage() {
  const { dict } = useAppContext()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.billing.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage patient invoices and process payments.
        </p>
      </div>
      <BillingBoard dict={dict} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/blood-bank/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import BloodBankBoard from './BloodBankBoard'

export default function BloodBankPage() {
  const { dict, locale, token } = useAppContext()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.nav.blood_bank || 'Blood Bank'}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage blood bags, donors, and fulfill transfusion requests.
        </p>
      </div>
      <BloodBankBoard dict={dict} locale={locale} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/emr/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import EmrDashboard from './EmrDashboard'

export default function EMRPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.nav.emr}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Lanjutkan penulisan rekam medis atau lihat riwayat pasien terakhir Anda.
        </p>
      </div>
      <EmrDashboard dict={dict} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/hr/roster/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import RosterBoard from './RosterBoard'

export default function RosterPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">
            {dict.hr.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">{dict.hr.roster}</p>
        </div>
      </div>
      <RosterBoard dict={dict} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/inpatient/page.tsx',
    content: `'use client'

import { useAppContext, getUserRole } from '@/contexts/AppContext'
import InpatientBoard from '@/components/inpatient/InpatientBoard'
import Link from 'next/link'

export default function InpatientPage() {
  const { token, dict, user } = useAppContext()
  const role = getUserRole(user)

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dict.inpatient.title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage wards, bed availability, and patient admissions.
          </p>
        </div>
        {(role === 'admin' || role === 'super_admin') && (
          <Link
            href="/dashboard/inpatient/settings"
            className="inline-flex items-center justify-center px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Pengaturan Fasilitas
          </Link>
        )}
      </div>
      <InpatientBoard dict={dict} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/inpatient/settings/page.tsx',
    content: `'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext, getUserRole } from '@/contexts/AppContext'
import InpatientSettingsClient from '@/components/inpatient/InpatientSettingsClient'
import Link from 'next/link'

export default function InpatientSettingsPage() {
  const { token, dict, user, isLoading } = useAppContext()
  const router = useRouter()
  const role = getUserRole(user)

  useEffect(() => {
    if (!isLoading && role !== 'admin' && role !== 'super_admin') {
      router.replace('/dashboard/inpatient')
    }
  }, [isLoading, role])

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan Fasilitas Rawat Inap</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Kelola Bangunan, Kamar, dan Tempat Tidur pasien.
          </p>
        </div>
        <Link
          href="/dashboard/inpatient"
          className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
        >
          Kembali ke Dashboard
        </Link>
      </div>
      <InpatientSettingsClient dict={dict} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/inventory/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import InventoryBoard from './InventoryBoard'

export default function InventoryPage() {
  const { dict, locale, token } = useAppContext()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.nav.inventory || 'Inventory'}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage master stock, suppliers, and purchase orders.
        </p>
      </div>
      <InventoryBoard dict={dict} locale={locale} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/lab/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import DiagnosticsBoard from '@/components/diagnostics/DiagnosticsBoard'

export default function LaboratoryPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.diagnostics.labTitle}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage laboratory test requests and input results.
        </p>
      </div>
      <DiagnosticsBoard dict={dict} category="Laboratory" token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/patients/page.tsx',
    content: `'use client'

import Link from 'next/link'
import { useAppContext } from '@/contexts/AppContext'
import PatientList from './PatientList'

export default function PatientsPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dict.patients.title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage hospital patient records and demographics.
          </p>
        </div>

        <Link
          href="/dashboard/patients/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {dict.patients.addNew}
        </Link>
      </div>

      <PatientList token={token} dict={dict} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/patients/new/page.tsx',
    content: `'use client'

import Link from 'next/link'
import { useAppContext } from '@/contexts/AppContext'
import PatientForm from './PatientForm'

export default function NewPatientPage() {
  const { dict } = useAppContext()
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/patients"
          className="p-2 rounded-xl bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dict.patients.addNew}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Register a new patient into the master demographic database.
          </p>
        </div>
      </div>

      <div className="glass border border-white/20 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <PatientForm dict={dict} />
      </div>
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/pharmacy/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import PharmacyBoard from './PharmacyBoard'

export default function PharmacyPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.pharmacy.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage medicine prescriptions and dispensing.
        </p>
      </div>
      <PharmacyBoard dict={dict} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/queue/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import QueueBoard from './QueueBoard'

export default function QueuePage() {
  const { dict, token, user } = useAppContext()
  // QueueBoard expects the full profile response shape { data: user }
  const userPayload = user ? { data: user } : null

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.visits.queue}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Live monitoring and management of patient queues across departments.
        </p>
      </div>
      <QueueBoard dict={dict} token={token} user={userPayload} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/radiology/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import DiagnosticsBoard from '@/components/diagnostics/DiagnosticsBoard'

export default function RadiologyPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.diagnostics.radTitle}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage radiology test requests and input results.
        </p>
      </div>
      <DiagnosticsBoard dict={dict} category="Radiology" token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/registration/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import RegistrationWizard from '@/components/registration/RegistrationWizard'

export default function RegistrationPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.placeholders.registration.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {dict.placeholders.registration.subtitle}
        </p>
      </div>
      <RegistrationWizard dict={dict} token={token} />
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/reports/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'

export default function ReportsPage() {
  const { dict } = useAppContext()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.placeholders.reports.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {dict.placeholders.reports.subtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 shadow-sm flex flex-col items-center justify-center min-h-[50vh]">
        <svg className="w-16 h-16 mb-4 text-emerald-500/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{dict.placeholders.reports.dashboardTitle}</h2>
        <p className="text-sm max-w-md">{dict.placeholders.reports.dashboardDesc}</p>
      </div>
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/settings/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

export default function SettingsPage() {
  const { dict, locale } = useAppContext()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dict.placeholders.settings.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          {dict.placeholders.settings.subtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600 dark:text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{dict.placeholders.settings.generalTitle}</h2>
            <p className="text-sm text-zinc-500">{dict.placeholders.settings.generalDesc}</p>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl text-sm">
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="font-medium">{dict.placeholders.settings.languageTitle}</p>
              <p className="text-xs text-zinc-500">{dict.placeholders.settings.languageDesc}</p>
            </div>
            <div className="flex gap-2">
              <LanguageSwitcher currentLocale={locale} variant="settings" />
            </div>
          </div>

          <div className="text-center py-8 text-zinc-500 italic">
            {dict.placeholders.settings.additionalNote}
          </div>
        </div>
      </div>
    </div>
  )
}
`,
  },
  {
    file: 'src/app/dashboard/surgery/page.tsx',
    content: `'use client'

import { useAppContext } from '@/contexts/AppContext'
import SurgeryBoard from './SurgeryBoard'

export default function SurgeryPage() {
  const { dict, token } = useAppContext()
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{dict.surgery.title}</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage operating rooms and surgery schedules.
        </p>
      </div>
      <SurgeryBoard dict={dict} token={token} />
    </div>
  )
}
`,
  },
]

let successCount = 0
let errorCount = 0

for (const { file, content } of pages) {
  const fullPath = path.resolve(file)
  try {
    // Ensure directory exists
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ Written: ${file}`)
    successCount++
  } catch (err) {
    console.error(`❌ Error writing ${file}:`, err.message)
    errorCount++
  }
}

console.log(`\nDone. ${successCount} files written, ${errorCount} errors.`)
