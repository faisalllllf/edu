"use client"

import { ChevronDown, ChevronUp, Users } from "lucide-react"
import { useState } from "react"

export default function ViewAttendanceCard() {
  const [viewDate, setViewDate] = useState("")
  const [viewList, setViewList] = useState<any[]>([])
  const [errorView, setErrorView] = useState("")
 const [isOpen, setIsOpen] = useState(false)
  const fetchViewAttendance = async () => {
    setErrorView("")
    if (!viewDate) return
    const res = await fetch("/api/admin/teachers-with-attendance", {
      method: "POST",
      body: JSON.stringify({ date: viewDate })
    })

    if (!res.ok) {
      const errorData = await res.json()
      setErrorView(errorData.error || "Something went wrong")
      return
    }

    const data = await res.json()
    setViewList(data.teachers || [])
  }

  return (
   <div className="bg-white p-3  rounded-lg shadow-md">
        {/* Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
        >
          <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
            <Users className="w-5 h-5" /> 📖 View Attendance
   
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
      
      
<p className="text-gray-600 mb-4">Select a date to view attendance of your teachers and staff Date wise.</p>
   
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={viewDate}
          onChange={e =>
            {setViewDate(e.target.value)

            setViewList([]) // Clear previous results
            }}
          className="border p-2 rounded w-full"
        />

        </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={fetchViewAttendance}
          className="bg-cyan-700 text-white px-4 py-2 rounded"
        >
          View
        </button>
      </div>

      {viewList.length > 0 && (
        <div className="overflow-auto max-h-80">
          <table className="w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Teacher</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {viewList.map((t: any) => (
                <tr key={t.teacher_id}>
                  <td className="border px-4 py-2">{t.name}</td>
                  <td className="border px-4 py-2">
                    {({
                      FULL_DAY: "✅ Full Day",
                      HALF_DAY: "🕓 Half Day",
                      ABSENT: "❌ Absent"
                    } as Record<'FULL_DAY' | 'HALF_DAY' | 'ABSENT', string>)[t.status as 'FULL_DAY' | 'HALF_DAY' | 'ABSENT'] || "Not Marked"}
                  </td>
                  <td className="border px-4 py-2">{t.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {errorView && <p className="text-red-600 mt-2">{errorView}</p>}
    </div>
    </div>
  )
}
