'use client'

import { ChevronDown, ChevronUp, RefreshCw, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ListTeachersCard() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/get-teacher')
      const data = await res.json()
      setTeachers(data)
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  return (
    <div className="bg-white p-3 mr-3 rounded-lg shadow-md">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
        <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
          <Users className="w-5 h-5" /> List of Teachers
        </h2>
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
            onClick={fetchTeachers}
            className="flex items-center space-x-1 text-cyan-700 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span> {/* optional label */}
          </button>

          </div>      
           {loading &&
                    <p>Loading...</p>
                }

        {teachers.length > 0 ? (
         <div className="overflow-x-auto max-h-100 overflow-y-auto  rounded-md">
          <ul className="space-y-2 mt-4">

            {teachers.map((teacher, index) => (
              <li
                key={index}
                className="p-3 border border-white rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{teacher.name}</p>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                </div>
              </li>
            ))}
          </ul>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No teachers found.</p>
        )}
      </div>
    </div>
  )
}
