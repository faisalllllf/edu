'use client'
import { useState, useEffect } from 'react'

export default function TeacherAssignmentsPage() {
  const [teacherAssignments, setTeacherAssignments] = useState<any[]>([])
const [loading, setLoading] = useState(false);

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
    <div className="p-4">
      <h2 className="text-xl font-semibold">Teachers & Assigned Sections</h2>
       {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
      <table className="w-full table-auto border mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Teacher</th>
            <th className="border px-4 py-2">Class</th>
            <th className="border px-4 py-2">Section</th>
          </tr>
        </thead>
       
        <tbody>
          {teacherAssignments.map((row, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{row.teacher_name}</td>
              <td className="border px-4 py-2">{row.class_name}</td>
              <td className="border px-4 py-2">{row.section_name}</td>
            </tr>
          ))}
        </tbody>
       
      </table>
       )}
    </div>
  )
}
