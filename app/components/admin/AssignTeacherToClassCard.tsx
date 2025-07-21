'use client'
import { useAdminData } from '@/app/context/AdminContext'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AssignTeacherToCLassCard() {
  const { teachers, classes, subjects, loading,refreshData } = useAdminData()
  const [assignClassId, setAssignClassId] = useState('')
 // const [classes, setClasses] = useState<any[]>([])              // ✅ add classes state
  const [assignSections, setAssignSections] = useState<any[]>([])
//  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [assignedCompleted, setAssignedCompleted] = useState(false);

const [isOpen, setIsOpen] = useState(false);

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
   
     <div className="bg-white p-3 rounded-lg shadow-md">

{/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3  hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
         <h2 className="text-sm font-bold text-cyan-700 mb-2">Assign Class to Teacher</h2>
        <span className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

 {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
        }`}
      >


      <div className='flex justify-end items-center m-2'>
  <button
            onClick={refreshData}
            className="flex items-center space-x-1 text-cyan-700 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span> {/* optional label */}
          </button>
          </div>
      {/* ✅ Use classes state here */}
      <select value={assignClassId} onChange={e => setAssignClassId(e.target.value)} className="w-full border p-2 mb-2 rounded">
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>

      <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} className="w-full border p-2 mb-2 rounded">
        <option value="">Select Section</option>
        {assignSections.map(sec => (
          <option key={sec.id} value={sec.id}>{sec.name}</option>
        ))}
      </select>

      <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)}className="w-full border p-2 mb-2 rounded">
        <option value="">Select Teacher</option>
        {teachers.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

<div className='flex justify-center items-center'>
      <button onClick={assignTeacher} className="ml-2 px-4 py-2 bg-cyan-700 text-white rounded">
        Assign
      </button>
      </div>
    </div>
    </div>
  )
}
