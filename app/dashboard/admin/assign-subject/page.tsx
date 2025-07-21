'use client'
import { useEffect, useState } from 'react'

export default function AssignSubjectPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')

  useEffect(() => {
    fetch('/api/admin/get-teacher').then(res => res.json()).then(setTeachers)
    fetch('/api/admin/get-classes').then(res => res.json()).then(setClasses)
    fetch('/api/admin/get-subjects').then(res => res.json()).then(setSubjects)
  }, [])

  useEffect(() => {
    if (selectedClassId) {
      fetch(`/api/admin/get-sections?classId=${selectedClassId}`)
        .then(res => res.json())
        .then(setSections)
    }
  }, [selectedClassId])

  const assignSubject = async () => {
    const res = await fetch('/api/admin/assign-subject', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: selectedTeacherId,
        subjectId: selectedSubjectId,
        classId: selectedClassId,
        sectionId: selectedSectionId
      })
    })
    const data = await res.json()
    alert(data.message)
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Assign Subject to Teacher</h2>

      <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="border p-2 mr-2">
        <option value="">Select Teacher</option>
        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="border p-2 mr-2">
        <option value="">Select Class</option>
        {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
      </select>

      <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} className="border p-2 mr-2">
        <option value="">Select Section</option>
        {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
      </select>

      <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="border p-2 mr-2">
        <option value="">Select Subject</option>
        {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
      </select>

      <button onClick={assignSubject} className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
    </div>
  )
}
