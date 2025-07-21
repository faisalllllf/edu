'use client'

import { ChevronDown, ChevronUp, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MarkAttendanceTeachercard() {
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({})
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [finalStatus, setFinalStatus] = useState('')
  const [classId, setClassId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isOpen, setIsOpen] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetch('/api/teacher/students-for-attendance')
        const data = await res.json()

        if (!res.ok) {
          // 👇 Show specific backend error
          setFetchError(data.error || `Failed to load students (${res.status})`)
          return
        }

        if (!data.students || data.students.length === 0) {
          setFetchError("No students found for your assigned class.")
          return
        }

        setStudents(data.students)
        setClassId(data.class_id || '')
        setSectionId(data.section_id || '')
      } catch (err: any) {
        setFetchError("Unexpected error occurred while loading students.")
      }
    }

    setIsOpen(false);
    loadStudents()
  }, [])


  const handleSubmit = async () => {
    if (!date) {
      setStatus('Please select a date before submitting.')
      return
    }

    if (students.length === 0) {
      setStatus('No students to mark attendance for.')
      return
    }

    setLoading(true)
    setErrors({})
    setStatus('')
    setFinalStatus('')

    try {
      const res = await fetch('/api/teacher/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          attendanceList: students.map(s => ({
            studentId: s.id,
            status: attendance[s.id] || 'FULL_DAY',
          })),
          classId,
          sectionId,
        }),
      })

      const data = await res.json()
      setStatus(data.message || 'Submitted')

      const errMap: { [key: string]: string } = {}
      if (data?.results) {
        data.results.forEach((entry: any) => {
          if (!entry.success) {
            errMap[entry.studentId] = entry.message || 'Error'
          } else {
            setFinalStatus(entry.message || 'Attendance submitted successfully.')
          }
        })
      }

      setErrors(errMap)
    } catch (error: any) {
      setStatus('Something went wrong while submitting attendance.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-full border border-gray-200 mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-100 rounded-md text-cyan-700 font-semibold text-lg transition"
      >
        <span className="flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-sm" />
          Mark Attendance
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[2000px] mt-4' : 'max-h-0'}`}>
        <h2 className="text-xl font-bold mb-4">Mark Attendance For Your Assigned Class Students</h2>

        {fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : (
          <>
            <input
              type="date"
              value={date}
              onChange={e => {
                setFinalStatus('')
                setStatus('')
                setDate(e.target.value)
              }}
              className="border p-2 mb-4"
            />

            {students.length > 0 ? (
              <>
                <table className="w-full table-auto border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Roll No</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s: any) => (
                      <tr key={s.id}>
                        <td className="border px-4 py-2">{s.name}</td>
                        <td className="border px-4 py-2">{s.rollNo}</td>
                        <td className="border px-4 py-2">
                          <select
                            value={attendance[s.id] || 'FULL_DAY'}
                            onChange={e => setAttendance({ ...attendance, [s.id]: e.target.value })}
                            className="border p-1"
                          >
                            <option value="FULL_DAY">Full Day</option>
                            <option value="HALF_DAY">Half Day</option>
                            <option value="ABSENT">Absent</option>
                          </select>
                        </td>
                        <td className="border px-4 py-2 text-red-500 text-sm">
                          {errors[s.id] || 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='flex justify-center items-center m-2'>

                  <button
                    onClick={handleSubmit}
                    className="mt-4 px-6 py-2 bg-cyan-600 text-cyan-800 rounded hover:bg-cyan-500"
                  >
                    Submit Attendance
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 mt-4">No students available for attendance.</p>
            )}
          </>
        )}

        {loading && <p className="text-blue-500 mt-2">Submitting...</p>}
        {status && <p className="text-green-600 mt-2">{status}</p>}
        {finalStatus && <p className="text-green-700 mt-2 font-semibold">{finalStatus}</p>}
      </div>
    </div>
  )
}
