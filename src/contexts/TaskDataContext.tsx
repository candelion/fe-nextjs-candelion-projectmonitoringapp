'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  TaskPackageItem,
  SubTaskItem,
  SitePointItem,
  EvidencePhotoItem,
} from '@/types'
import {
  INITIAL_TASK_PACKAGES,
  INITIAL_SITE_POINTS,
  INITIAL_EVIDENCE_PHOTOS,
} from '@/data/dummyData'

interface TaskDataContextType {
  taskPackages: TaskPackageItem[]
  sitePoints: SitePointItem[]
  evidencePhotos: EvidencePhotoItem[]
  selectedMapPointId: string | null
  setSelectedMapPointId: (id: string | null) => void
  toggleSubTask: (packageId: string, subTaskId: string) => void
  auditSubTask: (
    packageId: string,
    subTaskId: string,
    status: 'verified' | 'flagged',
    notes: string,
    auditorName?: string
  ) => void
  auditPhoto: (
    photoId: string,
    status: 'verified' | 'flagged',
    notes: string,
    auditorName?: string
  ) => void
  addEvidencePhoto: (
    photo: Omit<EvidencePhotoItem, 'id' | 'timestamp'>
  ) => EvidencePhotoItem
  getPhotosByPointId: (pointId: string) => EvidencePhotoItem[]
  getSubTasksByPointId: (pointId: string) => SubTaskItem[]
  getAllSubTasks: () => SubTaskItem[]
  getAuditStats: () => {
    totalSubTasks: number
    completedByPic: number
    verifiedCount: number
    pendingAuditCount: number
    flaggedCount: number
    compliancePct: number
  }
}

const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined)

export function TaskDataProvider({ children }: { children: React.ReactNode }) {
  const [taskPackages, setTaskPackages] = useState<TaskPackageItem[]>(INITIAL_TASK_PACKAGES)
  const [sitePoints, setSitePoints] = useState<SitePointItem[]>(INITIAL_SITE_POINTS)
  const [evidencePhotos, setEvidencePhotos] = useState<EvidencePhotoItem[]>(INITIAL_EVIDENCE_PHOTOS)
  const [selectedMapPointId, setSelectedMapPointId] = useState<string | null>(null)

  // Toggle subtask completion
  const toggleSubTask = (packageId: string, subTaskId: string) => {
    setTaskPackages((prevPackages) =>
      prevPackages.map((pkg) => {
        if (pkg.id !== packageId) return pkg

        const updatedSubTasks = pkg.subTasks.map((st) => {
          if (st.id !== subTaskId) return st
          const newCompleted = !st.isCompleted
          const now = new Date()
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
            .getMinutes()
            .toString()
            .padStart(2, '0')} WIB`

          return {
            ...st,
            isCompleted: newCompleted,
            evidenceSubmitted: newCompleted ? true : st.evidenceSubmitted,
            completedAt: newCompleted ? timeStr : undefined,
          }
        })

        const completedCount = updatedSubTasks.filter((st) => st.isCompleted).length
        const newProgress = Math.round((completedCount / updatedSubTasks.length) * 100)
        const newStatus =
          newProgress === 100
            ? 'completed'
            : newProgress === 0
            ? 'delayed'
            : 'in_progress'
        const newStatusLabel =
          newProgress === 100
            ? 'Selesai'
            : newProgress === 0
            ? 'Tertunda'
            : 'Sedang Berjalan'

        return {
          ...pkg,
          subTasks: updatedSubTasks,
          progress: newProgress,
          status: newStatus as any,
          statusLabel: newStatusLabel as any,
        }
      })
    )
  }

  // Add evidence photo from camera & link it to subtask and map point
  const addEvidencePhoto = (
    newPhotoData: Omit<EvidencePhotoItem, 'id' | 'timestamp'>
  ): EvidencePhotoItem => {
    const now = new Date()
    const timeStr = `${now.getDate()} Nov 2026, ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`

    const newPhoto: EvidencePhotoItem = {
      ...newPhotoData,
      id: `photo_${Date.now()}`,
      timestamp: timeStr,
    }

    // 1. Add to evidence photos list
    setEvidencePhotos((prev) => [newPhoto, ...prev])

    // 2. Mark corresponding subtask as completed with evidence
    if (newPhoto.subTaskId) {
      setTaskPackages((prevPackages) =>
        prevPackages.map((pkg) => {
          const hasSubTask = pkg.subTasks.some((st) => st.id === newPhoto.subTaskId)
          if (!hasSubTask) return pkg

          const updatedSubTasks = pkg.subTasks.map((st) => {
            if (st.id !== newPhoto.subTaskId) return st
            return {
              ...st,
              isCompleted: true,
              evidenceSubmitted: true,
              photoId: newPhoto.id,
              evidenceDetail: `${newPhoto.title} (${newPhoto.reportCode})`,
              completedAt: timeStr,
            }
          })

          const completedCount = updatedSubTasks.filter((st) => st.isCompleted).length
          const newProgress = Math.round((completedCount / updatedSubTasks.length) * 100)

          return {
            ...pkg,
            subTasks: updatedSubTasks,
            progress: newProgress,
            status: (newProgress === 100 ? 'completed' : 'in_progress') as any,
            statusLabel: (newProgress === 100 ? 'Selesai' : 'Sedang Berjalan') as any,
          }
        })
      )
    }

    return newPhoto
  }

  // Get photos for a specific point
  const getPhotosByPointId = (pointId: string) => {
    return evidencePhotos.filter((p) => p.pointId === pointId)
  }

  // Get subtasks for a specific point
  const getSubTasksByPointId = (pointId: string) => {
    const tasks: SubTaskItem[] = []
    taskPackages.forEach((pkg) => {
      pkg.subTasks.forEach((st) => {
        if (st.pointId === pointId) {
          tasks.push(st)
        }
      })
    })
    return tasks
  }

  // Auditor evaluation for a subtask
  const auditSubTask = (
    packageId: string,
    subTaskId: string,
    status: 'verified' | 'flagged',
    notes: string,
    auditorName = 'Budi Santoso, S.E., Ak., CA'
  ) => {
    const now = new Date()
    const timeStr = `${now.getDate()} Nov 2026, ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`

    setTaskPackages((prevPackages) =>
      prevPackages.map((pkg) => {
        if (pkg.id !== packageId) return pkg

        const updatedSubTasks = pkg.subTasks.map((st) => {
          if (st.id !== subTaskId) return st
          return {
            ...st,
            auditStatus: status,
            auditNotes: notes,
            auditedBy: auditorName,
            auditedAt: timeStr,
          }
        })

        return {
          ...pkg,
          subTasks: updatedSubTasks,
        }
      })
    )
  }

  // Auditor evaluation for a photo
  const auditPhoto = (
    photoId: string,
    status: 'verified' | 'flagged',
    notes: string,
    auditorName = 'Budi Santoso, S.E., Ak., CA'
  ) => {
    const now = new Date()
    const timeStr = `${now.getDate()} Nov 2026, ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`

    setEvidencePhotos((prev) =>
      prev.map((p) => {
        if (p.id !== photoId) return p
        return {
          ...p,
          auditStatus: status,
          auditNotes: notes,
          auditedBy: auditorName,
          auditedAt: timeStr,
        }
      })
    )
  }

  // Calculate audit statistics
  const getAuditStats = () => {
    const all = getAllSubTasks()
    const total = all.length
    const completedByPic = all.filter((t) => t.isCompleted).length
    const verifiedCount = all.filter((t) => t.auditStatus === 'verified').length
    const flaggedCount = all.filter((t) => t.auditStatus === 'flagged').length
    const pendingAuditCount = all.filter(
      (t) => t.isCompleted && (!t.auditStatus || t.auditStatus === 'pending')
    ).length
    const compliancePct = completedByPic > 0 ? Math.round((verifiedCount / completedByPic) * 100) : 100

    return {
      totalSubTasks: total,
      completedByPic,
      verifiedCount,
      pendingAuditCount,
      flaggedCount,
      compliancePct,
    }
  }

  // Get flat list of all subtasks
  const getAllSubTasks = () => {
    const tasks: SubTaskItem[] = []
    taskPackages.forEach((pkg) => {
      pkg.subTasks.forEach((st) => {
        tasks.push(st)
      })
    })
    return tasks
  }

  return (
    <TaskDataContext.Provider
      value={{
        taskPackages,
        sitePoints,
        evidencePhotos,
        selectedMapPointId,
        setSelectedMapPointId,
        toggleSubTask,
        auditSubTask,
        auditPhoto,
        addEvidencePhoto,
        getPhotosByPointId,
        getSubTasksByPointId,
        getAllSubTasks,
        getAuditStats,
      }}
    >
      {children}
    </TaskDataContext.Provider>
  )
}

export function useTaskData() {
  const context = useContext(TaskDataContext)
  if (!context) {
    throw new Error('useTaskData must be used within a TaskDataProvider')
  }
  return context
}

