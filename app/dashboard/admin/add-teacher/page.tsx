'use client'
import { useState, useEffect } from 'react'

export default function AddTeacherPage() {
  const [teacherName, setTeacherName] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [teacherPassword, setTeacherPassword] = useState('')
  const [teachers, setTeachers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/get-teacher').then(res => res.json()).then(setTeachers)
  }, [])

  const createTeacher = async () => {
    await fetch('/api/admin/create-teacher', {
      method: 'POST',
      body: JSON.stringify({ name: teacherName, email: teacherEmail, password: teacherPassword })
    })
    setTeacherName('')
    setTeacherEmail('')
    setTeacherPassword('')
    fetch('/api/admin/get-teacher').then(res => res.json()).then(setTeachers)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Add Teacher</h2>
      <input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Name" className="border p-2 mr-2" />
      <input value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} placeholder="Email" className="border p-2 mr-2" />
      <input type="password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} placeholder="Password" className="border p-2 mr-2" />
      <button onClick={createTeacher} className="px-4 py-2 bg-yellow-600 text-white rounded">Add Teacher</button>
    </div>
  )
}
