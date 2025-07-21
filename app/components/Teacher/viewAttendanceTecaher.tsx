'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function ViewAttendanceCardTeacher() {
  const [date, setDate] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchAttendance = async () => {
  if (!date) {
    setError('Please select a date.')
    return
  }

  setLoading(true)
  setError(null)
  setStudents([])

  try {
    const res = await fetch('/api/teacher/view-attendance-by-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || `Server responded with ${res.status}`)
    }

    if (!data || !Array.isArray(data.students)) {
      throw new Error('Invalid response from server.')
    }

    if (data.students.length === 0) {
      setError('No attendance records found for this date.')
    }

    setStudents(data.students)
  } catch (err: any) {
    setError(err.message || 'Something went wrong while fetching attendance.')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-full border border-gray-200 mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-100 rounded-md text-cyan-700 font-semibold text-xl transition"
      >
        <span className="flex items-center gap-2">
          <data className="w-5 h-5" />
          View Attendance
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[2000px] mt-4' : 'max-h-0'}`}>
        <h2 className="text-xl font-bold mb-4">View Attendance By Date</h2>

        <div className="flex items-center mb-4 gap-2">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
             <div className='flex justify-center items-center m-2'>
    <div className='flex justify-center items-center m-2'>
 
          <button
            onClick={fetchAttendance}
            className="px-4 py-2 bg-cyan-700 text-cyan-600 rounded hover:bg-700 transition"
          >
            Load Attendance
          </button>
          </div>

          </div>
        </div>

        {loading && <p className="mt-4 text-blue-600">Loading attendance data...</p>}

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {!loading && students.length > 0 && (
          <table className="w-full table-auto border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Roll No</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr key={s.id}>
                  <td className="border px-4 py-2">{s.name}</td>
                  <td className="border px-4 py-2">{s.rollNo}</td>
                  <td className="border px-4 py-2">{s.status || '❌ Not Marked'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
