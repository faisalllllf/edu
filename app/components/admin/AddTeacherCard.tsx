'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AddTeacherCard({ onSuccess }: { onSuccess?: () => void }) {
  const [teacherName, setTeacherName] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [teacherPassword, setTeacherPassword] = useState('')
  const [teachers, setTeachers] = useState<any[]>([])

const [isOpen, setIsOpen] = useState(false);
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
    if (onSuccess) onSuccess();
  }

  return (
     <div className="bg-white p-3 mr-3 rounded-lg shadow-md">
     

{/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2  hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
         <h2 className="text-sm font-bold text-cyan-700 mb-2">Add New Teacher</h2>
        <span className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
     
     
 {/* Accordion Body */}
      <div
        className={`overflow-hidden tranāsition-all duration-500 ${
          isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
        }`}
      >
      <input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Enter Teacher Name" className="w-full border rounded p-2 mr-2  mb-2" />
      <input value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} placeholder="Email" className="w-full  border p-2 mr-2  mb-2" />
      <input type="password" value={teacherPassword} onChange={e => setTeacherPassword(e.target.value)} placeholder="Password" className="w-full border  p-2 mr-2  mb-2" />

      <div className='flex justify-center items-center m-2'>
        <button
          onClick={createTeacher}
          className="bg-cyan-700 text-white px-4 py-2 rounded"
        >
          Add Teacher
        </button>
        </div>
         </div>
    </div>
  )
}
