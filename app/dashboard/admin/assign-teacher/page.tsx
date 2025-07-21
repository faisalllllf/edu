'use client'
import { useAdminData } from '@/app/context/AdminContext'
import { useState, useEffect } from 'react'

export default function AssignTeacherPage() {
  const { teachers, classes, subjects, loading } = useAdminData()
  const [assignClassId, setAssignClassId] = useState('')
 // const [classes, setClasses] = useState<any[]>([])              // ✅ add classes state
  const [assignSections, setAssignSections] = useState<any[]>([])
//  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [assignedCompleted, setAssignedCompleted] = useState(false);


  useEffect(() => {
    if (assignClassId) {
      fetch(`/api/admin/get-sections?classId=${assignClassId}`)
        .then(res => res.json())
        .then(setAssignSections)
    }
  }, [assignClassId])

  const assignTeacher = async () => {
    const res = await fetch('/api/admin/assign-teacher', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: selectedTeacherId,
        sectionId: selectedSectionId,
        classId: assignClassId
      })
    })

    const data = await res.json()
    alert(data.message || 'Assignment status unknown.')
    setSelectedTeacherId('')
    setSelectedSectionId('')
    setAssignedCompleted(true)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Assign Teacher to Section</h2>

      {/* ✅ Use classes state here */}
      <select value={assignClassId} onChange={e => setAssignClassId(e.target.value)} className="border p-2 mr-2">
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>

      <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} className="border p-2 mr-2">
        <option value="">Select Section</option>
        {assignSections.map(sec => (
          <option key={sec.id} value={sec.id}>{sec.name}</option>
        ))}
      </select>

      <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="border p-2">
        <option value="">Select Teacher</option>
        {teachers.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <button onClick={assignTeacher} className="ml-2 px-4 py-2 bg-purple-600 text-white rounded">
        Assign
      </button>
    </div>
  )
}
