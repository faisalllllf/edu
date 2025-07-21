"use client"

import { ChevronDown, ChevronUp, Users } from "lucide-react"
import { useState } from "react"



export default function MarkAttendanceCard() {
  const [date, setDate] = useState("")
  const [teachers, setTeachers] = useState<any[]>([])
  const [statusMap, setStatusMap] = useState<{ [id: string]: string }>({})
  const [remarksMap, setRemarksMap] = useState<{ [id: string]: string }>({})
  const [responseMsg, setResponseMsg] = useState("")
  const [errorSave, setErrorSave] = useState("")
 const [isOpen, setIsOpen] = useState(false)
  const fetchTeachers = async () => {
    setErrorSave("")
    if (!date) return
    const res = await fetch("/api/admin/teachers-with-attendance", {
      method: "POST",
      body: JSON.stringify({ date })
    })

    if (!res.ok) {
      const errorData = await res.json()
      setErrorSave(errorData.error || "Something went wrong")
      return
    }

    const data = await res.json()
    setTeachers(data.teachers || [])
    const statusObj: any = {}
    const remarksObj: any = {}
    for (const t of data.teachers || []) {
      statusObj[t.teacher_id] = t.status || "FULL_DAY"
      remarksObj[t.teacher_id] = t.remarks || ""
    }
    setStatusMap(statusObj)
    setRemarksMap(remarksObj)
  }

  const handleSubmit = async () => {
    setErrorSave("")
    const attendanceList = teachers.map(t => ({
      teacherId: t.teacher_id,
      status: statusMap[t.teacher_id],
      remarks: remarksMap[t.teacher_id]
    }))

    const res = await fetch("/api/admin/mark-teacher-attendance", {
      method: "POST",
      body: JSON.stringify({ date, attendanceList })
    })

    if (!res.ok) {
      const errorData = await res.json()
      setErrorSave(errorData.error || "Something went wrong")
      return
    }

    const data = await res.json()
    setResponseMsg(data.message || "Saved")
    const updatedTeachers = teachers.map(t => ({
    ...t,
    status: statusMap[t.teacher_id]  // You can assign any non-null to mark it
  }))
  setTeachers(updatedTeachers)
  }

  return (
    <div className="bg-white p-3  rounded-lg shadow-md">
        {/* Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
        >
          <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
            <Users className="w-5 h-5" /> Mark Attendance for Your Teachers and Staffs
   
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
      
      
      <p className="text-gray-600 mb-4">Select a date to mark attendance for your teachers and staff.</p>
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={date}
          onChange={e =>{ 
            setTeachers([])
            setErrorSave('')
            setResponseMsg('')
            setDate(e.target.value)}}
          className="border p-2 rounded w-full"
        />
        </div>


        <div className="flex justify-center mb-4">
        <button
          onClick={fetchTeachers}
          className="bg-cyan-700 text-white text-center justify px-4 py-2 rounded w-half"
        >
          Load Teachers
        </button>
      </div>

      {teachers.length > 0 && (
        <div className="overflow-auto max-h-80 mb-4 border border-white">
          <table className="w-full border border-white table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-cyan-700">Name</th>
                <th className="border p-2 text-cyan-700">Status</th>
                <th className="border p-2 text-cyan-700">Marked</th>
                <th className="border p-2 text-cyan-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.teacher_id}>
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">
                    <select
                      value={statusMap[t.teacher_id]}
                      onChange={e => setStatusMap({ ...statusMap, [t.teacher_id]: e.target.value })}
                      className="border rounded p-1"
                    >
                      <option value="FULL_DAY">Full Day</option>
                      <option value="HALF_DAY">Half Day</option>
                      <option value="ABSENT">Absent</option>
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    {t.status ? (
                      <span className="text-green-600 font-semibold">✅</span>
                    ) : (
                      <span className="text-red-500 font-semibold">❌</span>
                    )}
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={remarksMap[t.teacher_id]}
                      onChange={e => setRemarksMap({ ...remarksMap, [t.teacher_id]: e.target.value })}
                      className="border rounded p-1 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

<div className="flex justify-center mb-4">
      {teachers.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-cyan-700 text-white px-6 py-2 rounded flex flex-justify-center"
        >
          Submit Attendance
        </button>
      )}
      </div>

      {errorSave && <p className="text-red-600 mt-2">{errorSave}</p>}
      {responseMsg && <p className="text-green-600 mt-2">{responseMsg}</p>}
    </div>
    </div>
  )
}
