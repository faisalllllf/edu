'use client'

import { useAdminData } from '@/app/context/AdminContext'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function AddSubjectPage({ onSuccess }: { onSuccess?: () => void }) {
  const [subjectName, setSubjectName] = useState('')
  const { subjects, refreshData ,loading} = useAdminData()
  const [status, setStatus] = useState('')
  const [subjectloading, setSubjectLoading] = useState(false)
const [isOpen, setIsOpen] = useState(false);
  const handleSubmit = async () => {
    if (!subjectName.trim()) {
      setStatus('❌ Subject name cannot be empty.')
      return
    }

    setSubjectLoading(true)
    const res = await fetch('/api/admin/add-subject', {
      method: 'POST',
      body: JSON.stringify({ name: subjectName })
    })

    const data = await res.json()

    if (data.success) {
      setStatus('✅ Subject added successfully')
      setSubjectName('')
      refreshData()
      if (onSuccess) onSuccess();
    } else {
      setStatus(`❌ ${data.message || 'Error adding subject'}`)
    }

    setSubjectLoading(false)
  }

  const refreshDataa =()=>
  {
    setStatus('')
   refreshData();

  }
  return (
    <div className="bg-white rounded-2xl shadow-md p-3 w-full  border border-gray-200">

      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3  hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
         <h2 className="text-sm font-bold text-cyan-700 mb-2">📘 Add New Subject</h2>
          
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

     
        <input
          type="text"
          value={subjectName}
          onChange={e => {
            setSubjectName(e.target.value)
            setStatus('')
          }}
          placeholder="Enter subject name"
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

<div className='flex justify-center items-center m-2'>
        <button
          onClick={handleSubmit}
          className="bg-cyan-700 text-white px-4 py-2 rounded"
        >
          {subjectloading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Add Subject'
          )}
        </button>
        </div>
    

      {status && (
        <p
          className={`mb-4 text-sm ${
            status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status}
        </p>
      )}

    
    </div>
    </div>
  )
}
