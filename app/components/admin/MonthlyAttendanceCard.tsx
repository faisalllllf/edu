"use client"

import { useState } from "react"
import { saveAs } from "file-saver"
import { ChevronDown, ChevronUp, Users } from "lucide-react"

export default function MonthlyAttendanceCard() {
  const [month, setMonth] = useState("")
  const [records, setRecords] = useState<any[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [error, setError] = useState("")
const [isOpen, setIsOpen] = useState(false)
  // Convert `YYYY-MM` to first and last date of the month
  function getMonthDateRange(month: string): [string, string] {
    const [year, mon] = month.split("-").map(Number)
    const startDate = new Date(year, mon - 1, 1)
    const endDate = new Date(year, mon, 0)
    const toDateString = (d: Date) => d.toISOString().split("T")[0]
    return [toDateString(startDate), toDateString(endDate)]
  }

  const fetchAttendance = async () => {
    setError("")
    setRecords([])
    setDates([])
    if (!month) return

    const [start, end] = getMonthDateRange(month)
    const res = await fetch("/api/admin/teacher-attendance-monthly", {
      method: "POST",
      body: JSON.stringify({ start, end })
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      return
    }

    const data = await res.json()
    setRecords(data.attendance || [])
    setDates(data.dates || [])
    console.log("recprs",records);
    console.log("dayes",dates)
  }

  const exportToCSV = () => {
    const headers = ["Name", ...dates]
    const rows = records.map(r => [
      r.name,
      ...dates.map(date => r[date] || "")
    ])
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, `Teacher-Attendance-${month}.csv`)
  }

  return (

    
     <div className="bg-white p-3  rounded-lg shadow-md">
        {/* Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
        >
          <h2 className="text-sm font-bold text-cyan-700 flex items-center gap-2">
            <Users className="w-5 h-5" />📖 Monthly Attendance Report
   
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
      
      
<p className="text-gray-600 mb-4">Select a Month and Year to view attendance of your teachers and staff MOnthy wise and genrerate Repotrt if needed</p>
   
      <div className="flex gap-2 mb-4">
        <input
          type="month"
          value={month}
          onChange={e =>
            { 
              setRecords([]) // 
              setMonth(e.target.value)}}
         className="border p-2 rounded w-full"
        />
        </div>
 <div className="flex justify-center mb-4">
   
        <button
          onClick={fetchAttendance}
          className="bg-cyan-700 text-white px-4 py-2 rounded mr-2"
        >
          Load Report
        </button>

        {records.length > 0 && (
          <button
            onClick={exportToCSV}
            className="bg-cyan-700 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {records.length > 0 && (
        <div className="overflow-auto max-h-[400px] border rounded">
          <table className="min-w-max border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border p-2 sticky left-0 bg-gray-100 z-20">Teacher</th>
                {dates.map(date => (
                  <th key={date} className="border p-2 whitespace-nowrap">{date}</th>
                ))}
                 <th className="border p-2">Attendance %</th> {/* NEW COLUMN */}
              </tr>
            </thead>
            <tbody>


               {records.map((r, idx) => {
    let markedDays = 0
    let presentPoints = 0

    for (const date of dates) {
      const status = r[date]
      if (status === "FULL_DAY") {
        presentPoints += 1
        markedDays++
      } else if (status === "HALF_DAY") {
        presentPoints += 0.5
        markedDays++
      } else if (status === "ABSENT") {
        markedDays++
      }
    }

    const attendancePercent = markedDays > 0
      ? ((presentPoints / markedDays) * 100).toFixed(1)
      : "N/A"

    return (
      <tr key={idx}>
        <td className="border p-2 sticky left-0 bg-white z-10">{r.name}</td>
        {dates.map((date) => (
          <td key={date} className="border p-2 text-center">
            {r[date] === "FULL_DAY"
              ? "✅"
              : r[date] === "HALF_DAY"
              ? "🕓"
              : r[date] === "ABSENT"
              ? "❌"
              : "-"}
          </td>
        ))}
        <td className="border p-2 text-center font-semibold">
          {attendancePercent === "N/A" ? "N/A" : `${attendancePercent}%`}
        </td>
      </tr>
    )
  })}
             
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  )
}
