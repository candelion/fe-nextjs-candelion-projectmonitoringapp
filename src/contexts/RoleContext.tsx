'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserRole, UserProfile } from '@/types'
import { USER_PROFILES } from '@/data/dummyData'

interface RoleContextType {
  currentRole: UserRole
  currentUser: UserProfile
  switchRole: (role: UserRole) => void
  rabSyncStatus: 'synced' | 'syncing'
  triggerRabSync: () => void
  lastSyncTime: string
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('project_controller')
  const [rabSyncStatus, setRabSyncStatus] = useState<'synced' | 'syncing'>('synced')
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja (Real-time)')

  useEffect(() => {
    // Check localStorage if available
    try {
      const savedRole = localStorage.getItem('candelion_selected_role') as UserRole
      if (savedRole && USER_PROFILES[savedRole]) {
        setCurrentRole(savedRole)
      }
    } catch {
      // ignore
    }
  }, [])

  const switchRole = (role: UserRole) => {
    setCurrentRole(role)
    try {
      localStorage.setItem('candelion_selected_role', role)
    } catch {
      // ignore
    }
  }

  const triggerRabSync = () => {
    setRabSyncStatus('syncing')
    setTimeout(() => {
      setRabSyncStatus('synced')
      const now = new Date()
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`)
    }, 1200)
  }

  const currentUser = USER_PROFILES[currentRole] || USER_PROFILES.project_controller

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        rabSyncStatus,
        triggerRabSync,
        lastSyncTime,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}

