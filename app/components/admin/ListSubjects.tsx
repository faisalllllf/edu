'use client'

import { useAdminData } from '@/app/context/AdminContext'
import { ChevronDown, ChevronUp, RefreshCw, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ListSubjectspage() {
    const [teachers, setTeachers] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const { subjects, refreshData, loading } = useAdminData()
    const fetchTeachers = async () => {
        const res = await fetch('/api/admin/get-teacher')
        const data = await res.json()
        setTeachers(data)
    }

    useEffect(() => {
        fetchTeachers()
    }, [])


    return (
        <div className="bg-white p-3 rounded-lg shadow-md">
            {/* Accordion Header */}
            
           <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
        <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
          <Users className="w-5 h-5" /> List of Subjects
        </h2>
        <span className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
            {/* Accordion Body */}
            <div
                className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
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

                {loading &&
                    <p>Loading...</p>
                }

                          
                 {subjects.length > 0 ? (
                  <div className="overflow-x-auto max-h-100 overflow-y-auto  rounded-md">
          <ul className="space-y-2 mt-4">
            {subjects.map((subjects, index) => (
              <li
                key={index}
                className="p-3 border border-white rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{subjects.name}</p>

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
