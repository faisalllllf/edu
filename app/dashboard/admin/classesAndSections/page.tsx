'use client'

import {
  Layers,
  PlusCircle,
  List,
  RefreshCw,
  Users,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useAdminData } from '@/app/context/AdminContext'
import { useState } from 'react'

export default function AdminClassSectionPage() {
  const { classes, claasesssections, refreshData } = useAdminData()
  const [className, setClassName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')

  const [isOpen1, setIsOpen1] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [isOpen3, setIsOpen3] = useState(false)
  const [isOpen4, setIsOpen4] = useState(false)

  const handleAddClass = async () => {
    if (!className.trim()) return
    await fetch('/api/admin/Insert-class', {
      method: 'POST',
      body: JSON.stringify({ name: className.trim() })
    })
    setClassName('')
    refreshData()
  }

  const handleAddSection = async () => {
    if (!selectedClassId || !sectionName.trim()) return
    await fetch('/api/admin/insert-section', {
      method: 'POST',
      body: JSON.stringify({ name: sectionName.trim(), classId: selectedClassId })
    })
    setSectionName('')
    setSelectedClassId('')
    refreshData()
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6 mt-4 ">
        <Layers className="w-7 h-7 text-cyan-600 " />
        <h1 className="text-xl font-bold text-cyan-700">Manage Classes & Sections</h1>
      </div>

      {/* Grid Container */}
     <div className="grid grid-cols-1 gap-6">
        {/* Add Class */}
        <div className="bg-white p-3 rounded-lg shadow-md w-full">
          <button
            onClick={() => setIsOpen1(!isOpen1)}
            className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-200 rounded-md text-cyan-700  text-sm  font-semibold transition"
          >
            <span className="flex items-center gap-2 text-sm">
              <PlusCircle className="w-5 h-5" />
              Add Class
            </span>
            {isOpen1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div className={`overflow-hidden transition-all duration-500 ${isOpen1 ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
            <div className="p-4 text-sm">
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class Name"
                className="w-full border rounded px-3 py-2 mb-4"
              />
              <button
                onClick={handleAddClass}
                className="w-full bg-cyan-700 text-sm text-white py-2 rounded hover:bg-cyan-800"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>

        {/* Add Section */}
        <div className="bg-white p-3 rounded-lg shadow-md w-full">
          <button
            onClick={() => setIsOpen2(!isOpen2)}
            className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
          >
            <span className="flex items-center gap-2 text-sm">
              <PlusCircle className="w-5 h-5" />
              Add Section
            </span>
            {isOpen2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div className={`overflow-hidden transition-all duration-500 ${isOpen2 ? 'max-h-[600px] mt-4' : 'max-h-0'}`}>
            <div className="p-3 text-sm">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4 text-gray-600"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="Section Name"
                className="w-full border rounded px-3 py-2 mb-4"
              />
              <button
                onClick={handleAddSection}
                className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-cyan-800"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* List of Classes */}
        <div className="bg-white p-3 rounded-lg shadow-md w-full">
          <button
            onClick={() => setIsOpen3(!isOpen3)}
            className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
          >
            <span className="flex items-center gap-2 text-sm">
              <List className="w-5 h-5 text-sm" />
              List of Classes
            </span>
            {isOpen3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div className={`overflow-hidden transition-all duration-500 ${isOpen3 ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
            <ul className="pl-4 list-disc max-h-40 overflow-auto text-sm text-gray-700 mt-2">
              {classes.map(c => (
                <li key={c.id} className="p-3 border border-white rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
>
   <span className="font-semibold text-gray-800">{c.name}</span>
        
  </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={refreshData} className="text-sm text-cyan-700 flex items-center gap-1">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* List of Sections */}
        <div className="bg-white p-3 rounded-lg shadow-md w-full">
          <button
            onClick={() => setIsOpen4(!isOpen4)}
            className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
          >
            <span className="flex items-center gap-2 text-sm">
              <Users className="w-5 h-5 text-sm" />
              List of Sections
            </span>
            {isOpen4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>


 

          <div className={`overflow-hidden transition-all duration-500 ${isOpen4 ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}>
            <ul className="pl-4 list-disc max-h-40 overflow-auto text-sm text-gray-700 mt-2">
              {claasesssections.map((sec, idx) => (
                <li key={idx}  className="p-3 border border-white rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
>
                  {sec.name}{' '}
                  <span className="font-semibold text-gray-800">{sec.className}-{sec.sectionName}</span>
                
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={refreshData} className="text-sm text-cyan-700 flex items-center gap-1">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
