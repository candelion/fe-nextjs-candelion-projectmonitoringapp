import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { RoleProvider } from '@/contexts/RoleContext'
import { TaskDataProvider } from '@/contexts/TaskDataContext'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sistem Pemantauan Terpadu — Candelion Digital',
    template: '%s | Candelion Digital',
  },
  description:
    'Sistem Pemantauan Terpadu Progres Fisik, Akuntabilitas PIC, dan Pengawasan Audit Proyek Real-Time PT Candelion Digital.',
  keywords: ['project monitoring', 'pemantauan proyek', 'Candelion Digital', 'konstruksi', 'auditor', 'Telocor Sidoarjo'],
  icons: {
    icon: [
      { url: '/logo/logo_candelion_white.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/logo/logo_candelion_white.png',
    apple: '/logo/logo_candelion_white.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4338CA',
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f4f6f8] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
        <RoleProvider>
          <TaskDataProvider>
            {children}
          </TaskDataProvider>
        </RoleProvider>
      </body>
    </html>
  )
}
