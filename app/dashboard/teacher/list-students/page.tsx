'use client'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ListStudents() {
  const [students, setStudents] = useState([])
const [isOpen, setIsOpen] = useState(false)


  useEffect(() => {
    fetch('/api/teacher/get-Students')
      .then(res => res.json())
      .then(setStudents)
  }, [])

  return (
     <div className="bg-white p-3 rounded-lg shadow-md">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
        <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
          <Users className="w-5 h-5" /> List of Students 
        </h2>
        <span className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>



     
<div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
        }`}
      >
 <h1 className="text-sm font-bold text-cyan-700 mb-4">List of Students for my  Assigned class </h1>

          
      

      {students.length > 0 ? (

       


<div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className=" px-4 py-2">Name</th>
                <th className=" px-4 py-2">Roll No</th>
                <th className=" px-4 py-2">DOB</th>
                <th className=" px-4 py-2">Aadhars</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr key={s.id} className="text-center bg-gray-50 hover:bg-cyan-100 transition-colors">
                  <td className=" px-4 py-2">{s.name}</td>
                  <td className=" px-4 py-2">{s.dob}</td>
                  <td className=" px-4 py-2">{s.section_name}</td>
                  <td className=" px-4 py-2">{s.aadhar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

         ) : (
          <p className="text-gray-500 mt-4">No students found for your Assigned class.</p>
        )}
    </div>
    </div>
  )
}
