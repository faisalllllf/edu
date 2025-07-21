// ✅ File: /app/dashboard/teacher/view-student-marks/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ViewStudentMarks() {
  const [examName, setExamName] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
const [exams, setExams] = useState<any[]>([])

useEffect(()=>{
 fetch('/api/admin/get-exams')
      .then(res => res.json())
      .then(data => setExams(data.exams || []))
},[]);

  const [examId, setExamId] = useState('')
  const fetchMarks = async () => {
    if (!examId) return setError('Please enter an exam name')
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/teacher/class-section-marks', {
        method: 'POST',
        body: JSON.stringify({ examId })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setStudents(data.students)
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
    
  }

  const allSubjects = Array.from(
    new Set(
      students.flatMap(s => Object.keys(s.marks || {}))
    )
  )

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">View Student Marks</h2>

         <select value={examId} onChange={e => setExamId(e.target.value)} className="border p-2">
        <option value="">Select Exam</option>
        {exams.map(exam => (
          <option key={exam.id} value={exam.id}>{exam.name}</option>
        ))}
      </select>
      <button
        onClick={fetchMarks}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Load Marks
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {students.length > 0 && (
        <table className="table-auto w-full mt-4 border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Student</th>
              <th className="border px-4 py-2">Roll No</th>
              {allSubjects.map(subject => (
                <th key={subject} className="border px-4 py-2">{subject}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.rollNo}</td>
                {allSubjects.map(subject => (
                  <td key={subject} className="border px-4 py-2">
                    {s.marks?.[subject] !== undefined ? s.marks[subject] : '❌'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
