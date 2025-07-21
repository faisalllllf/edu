// context/AdminContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AdminDataContextType {
  classes: any[]
  teachers: any[]
  subjects: any[]
  claasesssections:any[]
  loading: boolean
  refreshData: () => void
}

const AdminContext = createContext<AdminDataContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
 const [claasesssections, setClassesSections] = useState([])
  
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cls, tch, sub,classub] = await Promise.all([
        fetch('/api/admin/get-classes').then(res => res.json()),
        fetch('/api/admin/get-teacher').then(res => res.json()),
        fetch('/api/admin/get-subjects').then(res => res.json()),
        fetch('/api/admin/getAllsectionWithCLasses').then(res=>res.json()),
      ])
      setClasses(cls)
      setTeachers(tch)
      setSubjects(sub)
      setClassesSections(classub)
    } catch (e) {
      console.error('Failed to fetch admin data', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <AdminContext.Provider value={{ classes, teachers, subjects,claasesssections, loading, refreshData: fetchData }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdminData = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdminData must be used inside AdminProvider')
  return ctx
}
