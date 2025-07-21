'use client'

import { useEffect, useState } from 'react'

export default function ViewMarksPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [classId, setClassId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [examName, setExamName] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
 const [examId, setExamId] = useState('')
   const [exams, setExams] = useState<any[]>([])
useEffect(() => {
  fetch('/api/teacher/assigned-subjects')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setAssignments(data)
      } else if (Array.isArray(data.assignments)) {
        setAssignments(data.assignments)
      } else {
        setAssignments([]) // fallback if unexpected structure
      }
    })
    .catch(err => {
      console.error("Error fetching assignments:", err)
      setAssignments([])
    })

    
    fetch('/api/admin/get-exams')
      .then(res => res.json())
      .then(data => setExams(data.exams || []))
}, [])


  const getFilteredSections = () =>
    assignments.filter(a => a.class_id === classId).map(a => ({
      section_id: a.section_id,
      section_name: a.section_name,
    }))

  const getFilteredSubjects = () =>
    assignments.filter(a => a.class_id === classId && a.section_id === sectionId).map(a => ({
      subject_id: a.subject_id,
      subject_name: a.subject_name,
    }))

  const handleFetch = async () => {
    if (!examId || !classId || !sectionId || !subjectId) {
      setStatus('Please fill all fields')
      return
    }

    setLoading(true)
    const res = await fetch('/api/teacher/marks-list', {
      method: 'POST',
      body: JSON.stringify({ classId, sectionId, subjectId, examId })
    })
    const data = await res.json()
    setStudents(data.students || [])
    setLoading(false)
    setStatus('')
    
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">View Student Marks</h2>

      {/* Dropdowns */}
      <div className="flex gap-4 flex-wrap">
        <select value={classId} onChange={e => {
          setClassId(e.target.value)
          setSectionId('')
          setSubjectId('')
        }} className="border p-2">
          <option value="">Select Class</option>
          {[...new Set(assignments.map(a => JSON.stringify({ id: a.class_id, name: a.class_name })))]
            .map(str => JSON.parse(str))
            .map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
        </select>

        <select value={sectionId} onChange={e => {
          setSectionId(e.target.value)
          setSubjectId('')
        }} className="border p-2">
          <option value="">Select Section</option>
          {getFilteredSections().map(s => (
            <option key={s.section_id} value={s.section_id}>{s.section_name}</option>
          ))}
        </select>

        <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="border p-2">
          <option value="">Select Subject</option>
          {getFilteredSubjects().map(sub => (
            <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
          ))}
        </select>

           <select value={examId} onChange={e => setExamId(e.target.value)} className="border p-2">
        <option value="">Select Exam</option>
        {exams.map(exam => (
          <option key={exam.id} value={exam.id}>{exam.name}</option>
        ))}
      </select>
      </div>

      <button
        onClick={handleFetch}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Load Marks
      </button>

      {status && <p className="text-red-600">{status}</p>}
      {loading && <p>Loading...</p>}

      {!loading && students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Roll No</th>
              <th className="border px-4 py-2">Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s: any) => (
              <tr key={s.student_id} className="text-center">
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.rollNo}</td>
                <td className="border px-4 py-2">{s.marks_obtained ?? '❌ Not Added'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
