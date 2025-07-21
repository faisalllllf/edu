'use client'

import { useEffect, useState } from 'react'

export default function MarkAttendancePage() {
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({})
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [Finalstatus, setFinalStatus] = useState('')
  const[classId,setClassId]=useState('');
 const[SectionId,setSectionId]=useState('');
 const [errors, setErrors] = useState<{ [key: string]: string }>({})
 
  useEffect(() => {
    fetch('/api/teacher/students-for-attendance')
      .then(res => res.json())
      .then(data =>{ 
        
        setStudents(data.students || [])
        setClassId(data.class_id || '')
        setSectionId(data.section_id || '')
    })
      

  }, [])
  const handleSubmit = async () => {
    setLoading(true)
    setErrors({})
    setStatus('')
    setFinalStatus('')
    const res = await fetch('/api/teacher/mark-attendance', {
      method: 'POST',
      body: JSON.stringify({
        date,
        attendanceList: students.map(s => ({
          studentId: s.id,
          status: attendance[s.id] || 'FULL_DAY',
        })),
        classId: classId,
        sectionId: SectionId
      }),
    })
    const data = await res.json()
    setStatus(data.message)
    setLoading(false);
    if (data?.results) {
      const errMap: { [key: string]: string } = {}
      data.results.forEach((entry: any) => {
        if (!entry.success) {
          errMap[entry.studentId] = entry.message || 'Error'
        }
        else{
            setFinalStatus(entry.message);
        }
      })
      setErrors(errMap)
    }
   
  }
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

      <input type="date" value={date} onChange={e => {
        
        setFinalStatus('')
        setDate(e.target.value)
        setStatus('')
        }} className="border p-2 mb-4" />

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

      <button onClick={handleSubmit} className="mt-4 px-6 py-2 bg-green-600 text-white rounded">
        Submit Attendance
      </button>

      {loading && <p className="text-blue-500 mt-2">Submitting...</p>}
      {status && <p className="text-green-600 mt-2">{status}</p>}
      {Finalstatus && <p className="text-green-600 mt-2">{Finalstatus}</p>}
      
    </div>
  )
}
