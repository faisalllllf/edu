// /app/dashboard/teacher/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
/*
export default function TeacherHome() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/teacher/list-students')
  }, [router])

  return null
}
*/
export default function TeacherDashboard() {
  return <h2 className="text-xl">Welcome to the Teacher Dashboard</h2>
}
