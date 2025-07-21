'use client'
import { useAdminData } from '@/app/context/AdminContext';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const [teacherAssignments, setTeacherAssignments] = useState<any[]>([])
const [loading, setLoading] = useState(false);
  const { refreshData } = useAdminData()
 const [isOpen, setIsOpen] = useState(false);

 
  useEffect(() => {
    fetch('/api/admin/Teacher-with-assignedClasessSections')
      .then(res => res.json())
      .then(data => {
        setTeacherAssignments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false)) // handle error
      setLoading(true);
  }, [])

  return (
   
     <div className="bg-white p-3 rounded-lg shadow-md">
      


 {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3  hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
       <h2 className="text-sm font-semibold text-cyan-700">Teachers & Assigned Sections</h2>
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
       {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
      <div className="overflow-x-auto">
  <table className="w-full table-auto  mt-2">
    <thead>
      <tr className="bg-gray-200">
        <th className=" px-4 py-2">Teacher</th>
        <th className=" px-4 py-2">Class</th>
        <th className=" px-4 py-2">Section</th>
      </tr>
    </thead>
    <tbody>
      {teacherAssignments.map((row, idx) => (
        <tr key={idx}  className="text-center bg-gray-50 hover:bg-cyan-100 transition-colors">
                   <td className=" px-4 py-2">{row.teacher_name}</td>
          <td className=" px-4 py-2">{row.class_name}</td>
          <td className=" px-4 py-2">{row.section_name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

       )}
    </div>
     </div>
  )
}
