'use client'
import { useState } from 'react'

export default function ViewAttendancePage() {
  const [date, setDate] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAttendance = async () => {
    setLoading(true)
    const res = await fetch('/api/teacher/view-attendance-by-date', {
      method: 'POST',
      body: JSON.stringify({ date })
    })
    const data = await res.json()
    setStudents(data.students || [])
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">View Attendance By Date</h2>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border p-2 mb-4"
      />

      <button onClick={fetchAttendance} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
        Load Attendance
      </button>

      {loading && <p className="mt-4">Loading...</p>}

      {students.length > 0 && (
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
  )
}
