'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function AssignSubjectToClassSection() {
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
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
    const res = await fetch('/api/admin/subject-to-class', {
      method: 'POST',
      body: JSON.stringify({
        subjectId: selectedSubjectId,
        classId: selectedClassId,
        sectionId: selectedSectionId
      })
    })

    const data = await res.json()
    alert(data.message)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
        <h2 className="text-sm font-bold text-cyan-700">Assign Subject to Class & Section</h2>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Class</option>
          {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
        </select>

        <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Section</option>
          {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
        </select>

        <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Subject</option>
          {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
        </select>

        <div className="flex justify-center mt-4">
          <button onClick={assignSubject} className="bg-cyan-700 text-white px-4 py-2 rounded">Assign</button>
        </div>
      </div>
    </div>
  )
}
