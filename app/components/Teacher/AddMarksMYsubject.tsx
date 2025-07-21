'use client'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Edit3 } from 'lucide-react'

export default function AddMarksSubjectPage() {
    const [assignments, setAssignments] = useState<any[]>([])
    const [exams, setExams] = useState<any[]>([])
    const [classId, setClassId] = useState('')
    const [sectionId, setSectionId] = useState('')
    const [subjectId, setSubjectId] = useState('')
    const [examId, setExamId] = useState('')
    const [students, setStudents] = useState<any[]>([])
    const [marks, setMarks] = useState<{ [studentId: string]: string }>({})
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [marksStatus, setMarksStatus] = useState<{ [studentId: string]: boolean }>({})
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        fetch('/api/teacher/assigned-subjects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setAssignments(data)
                else if (Array.isArray(data.assignments)) setAssignments(data.assignments)
                else setAssignments([])
            })
            .catch(() => setAssignments([]))

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

    const fetchStudents = async () => {
        setLoading(true)
        const res = await fetch('/api/teacher/students-with-marksPrepopulate', {
            method: 'POST',
            body: JSON.stringify({
                classId,
                sectionId,
                subjectId,
                examId,
            })
        })
        const data = await res.json()
        setStudents(data.students || [])
        setMarks(Object.fromEntries(data.students.map((s: { id: any; marks: any }) => [s.id, s.marks || ''])))
        setMarksStatus(Object.fromEntries(data.students.map((s: { id: any; status: string }) =>
            [s.id, s.status === '✅'])))
        setLoading(false)
    }

    const handleSubmit = async () => {
        setLoading(true)
        const res = await fetch('/api/teacher/add-marks', {
            method: 'POST',
            body: JSON.stringify({ subjectId, classId, sectionId, examId, marks }),
        })
        const data = await res.json()
        setStatus(data.message)
        const newStatus: { [id: string]: boolean } = {}
        Object.keys(marks).forEach(id => { newStatus[id] = true })
        setMarksStatus(newStatus)
        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-3 w-full border border-gray-200  mx-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-100 rounded-md text-cyan-700 font-semibold text-sm transition"
            >
                <span className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Add Marks
                </span>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[2000px] mt-4' : 'max-h-0'}`}>
                <h2 className="text-xl font-bold text-cyan-700 mb-4">Add Student Marks for Your Assigned Subject</h2>
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                    <select value={classId} onChange={e => { setClassId(e.target.value); setSectionId(''); setSubjectId(''); setExamId('') }} className="border p-2 rounded flex-1">
                        <option value="">Select Class</option>
                        {[...new Set(assignments.map(a => JSON.stringify({ id: a.class_id, name: a.class_name })))]
                            .map(str => JSON.parse(str))
                            .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={sectionId} onChange={e => { setSectionId(e.target.value); setSubjectId(''); setExamId('') }} className="border p-2 rounded flex-1">
                        <option value="">Select Section</option>
                        {getFilteredSections().map(s => <option key={s.section_id} value={s.section_id}>{s.section_name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                    <select value={subjectId} onChange={e => { setSubjectId(e.target.value); setExamId('') }} className="border p-2 rounded flex-1">
                        <option value="">Select Subject</option>
                        {getFilteredSubjects().map(sub => <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>)}
                    </select>
                    <select value={examId} onChange={e => setExamId(e.target.value)} className="border p-2 rounded flex-1">
                        <option value="">Select Exam</option>
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                        ))}
                    </select>
                </div>
                {classId && sectionId && subjectId && examId && (
                    <button onClick={fetchStudents} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded mb-4">
                        Load Students
                    </button>
                )}
                {loading && (
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mt-4" />
                )}
                {!loading && students.length > 0 && (
                    <>
                        <table className="w-full table-auto mt-4 ">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className=" px-4 py-2">Name</th>
                                    <th className=" px-4 py-2">Roll No</th>
                                    <th className=" px-4 py-2">Marks</th>
                                    <th className=" px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s: any) => (
                                    <tr key={s.id} className="text-center">
                                        <td className="border px-4 py-2">{s.name}</td>
                                        <td className="border px-4 py-2">{s.rollNo}</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                className="border p-1 w-24"
                                                value={marks[s.id] || ''}
                                                onChange={e => setMarks({ ...marks, [s.id]: e.target.value })}
                                                disabled={s.status === '✅'}
                                            />
                                        </td>
                                        <td className="border px-4 py-2 text-xl">{marksStatus[s.id] ? '✅' : '❌'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                           <div className='flex justify-center items-center m-2'>
 
                        <button onClick={handleSubmit} className="mt-4 px-6 py-2 bg-cyan-700 text-cyan-600 rounded">
                            Submit Marks
                        </button>
                        </div>
                        {status && <p className="mt-2 text-green-700">{status}</p>}
                    </>
                )}
            </div>
        </div>
    )
}