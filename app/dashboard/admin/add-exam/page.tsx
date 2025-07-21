'use client'

import { ChevronDown, ChevronUp, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AddExamPage() {
  const [examName, setExamName] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [exams, setExams] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const fetchExams = async () => {
    const res = await fetch('/api/admin/get-exams')
    const data = await res.json()
    setExams(data.exams || [])
  }

  useEffect(() => {
    fetchExams()
  }, [])

  const handleAdd = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/add-exam', {
      method: 'POST',
      body: JSON.stringify({ name: examName })
    })
    const data = await res.json()
    setStatus(data.message)
    setExamName('')
    fetchExams()
    setLoading(false)
  }

  return (



  <div className="grid grid-cols-1 m-3 md:grid-cols-1 gap-6">

   
      <div className="bg-white p-2  rounded-lg shadow-md">
        {/* Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
        >
          <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
            <Users className="w-5 h-5" /> Add New Exam
          </h2>
          <span className="transition-transform duration-300">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </button>
        {/* First row: 3 horizontal cards */}



       

          {/* Accordion Body */}
          <div
            className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
              }`}
          >
            <div className="flex gap-2 items-center mb-4">
              <input
                type="text"
                className="border p-2"
                placeholder="Exam name (e.g., Midterm)"
                value={examName}
                onChange={e => {
                  setStatus('')
                  setExamName(e.target.value)
                }}
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-cyan-700 text-white rounded"
              >
                Add
              </button>
            </div>
         

          {loading && <p>Adding exam...</p>}
          {status && <p className="text-cyan-600 text-sm">{status}</p>}
        </div>
      </div>


      <div className="bg-white p-2  rounded-lg shadow-md">


  <button
          onClick={() => setIsOpen2(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
        >
          <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
            <Users className="w-5 h-5" /> Existing Exams
          </h2>
          <span className="transition-transform duration-300">
            {isOpen2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </button>
        {/* First row: 3 horizontal cards */}

        <div
            className={`overflow-hidden transition-all duration-500 ${isOpen2 ? 'max-h-[1000px] mt-4' : 'max-h-0'
              }`}
          >
        <ul className="list-disc ml-6 mt-2 text-cyan-600">
          {exams.map((e: any) => <li key={e.id}>{e.name}</li>)}
        </ul>
      </div>
      </div>
    </div>

  )
}
