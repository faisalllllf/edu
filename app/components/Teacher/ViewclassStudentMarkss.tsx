"use client"

import { ChevronDown, ChevronUp, FileText } from "lucide-react"
import { useEffect, useState } from "react"

interface Student {
  id?: string
  name: string
  rollNo: string
  marks?: Record<string, string> // 🔥 Changed to string since your data has string marks
}

interface Exam {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
}

export default function ViewClassStudentMarksPage() {
  const [examId, setExamId] = useState("")
  const [classID, setClassID] = useState("")
  const [sectionID, setSectionID] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [exams, setExams] = useState<Exam[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([])

  // Fetch exams on component mount
  useEffect(() => {
    fetch("/api/admin/get-exams")
      .then((res) => res.json())
      .then((data) => setExams(data.exams || []))
      .catch(() => setError("Failed to load exams"))
  }, [])

  const fetchMarks = async () => {
    if (!examId) {
      setError("Please select an exam")
      return
    }

    setError("")
    setLoading(true)

    try {
      // Fetch class and section assignment
      const assignmentRes = await fetch("/api/teacher/Get-assignedClassSection")
      const assignmentData = await assignmentRes.json()

      if (assignmentData.error) {
        throw new Error(assignmentData.error)
      }

      const currentClassID = assignmentData.assignment.classId
      const currentSectionID = assignmentData.assignment.sectionId

      setClassID(currentClassID)
      setSectionID(currentSectionID)

      // Fetch assigned subjects for this class and section
      const subjectRes = await fetch(
        `/api/teacher/assigned-subjects-to-classget?classId=${currentClassID}&sectionId=${currentSectionID}`,
      )
      const subjectData = await subjectRes.json()

      if (subjectData.error) {
        throw new Error(subjectData.error)
      }

      const subjects = subjectData.subjects.map((s: Subject) => s.name)
      setAssignedSubjects(subjects)

      // Fetch student marks
      const marksRes = await fetch("/api/teacher/class-section-marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId }),
      })

      const marksData = await marksRes.json()

      if (marksData.error) {
        throw new Error(marksData.error)
      }

      setStudents(marksData.students || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStudents([])
      setAssignedSubjects([])
    } finally {
      setLoading(false)
    }
  }

  console.log("Assigned Subjects:", assignedSubjects)
  console.log("Students:", students)

  const calculateStudentStats = (student: Student) => {
    console.log("Calculating stats for student:", student)
    const marks = assignedSubjects.map((subject) => {
      console.log(`Checking subject: ${subject} for student: ${student.name}`)

      const mark = student.marks?.[subject];
      console.log( student.marks);
      console.log(`Mark for ${subject} (${student.name}):`, mark, typeof mark)

      // 🔥 Check if mark exists and is a valid string that can be converted to number
      if (mark && typeof mark === "string" && mark.trim() !== "") {
        const numericMark = Number.parseFloat(mark)
        return !isNaN(numericMark) ? numericMark : null
      }
      return null
    })

    const validMarks = marks.filter((mark): mark is number => mark !== null)
    const hasPending = marks.some((mark) => mark === null)

    if (hasPending || validMarks.length === 0) {
      return {
        total: "-",
        percentage: "Pending",
        marks,
      }
    }

    const total = validMarks.reduce((sum, mark) => sum + mark, 0)
    const maxPossible = assignedSubjects.length * 100
    const percentage = ((total / maxPossible) * 100).toFixed(2) + "%"

    return {
      total: total.toFixed(2),
      percentage,
      marks,
    }
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-full border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-50 rounded-md text-cyan-700 font-semibold transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-sm" />
          View My Assigned Students Marks
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[800px] mt-6" : "max-h-0"}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Exam
              </label>
              <select
                id="exam-select"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Choose an exam...</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={fetchMarks}
              disabled={loading || !examId}
              className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Loading..." : "Load Marks"}
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

          {students.length > 0 && assignedSubjects.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Roll No</th>
                    {assignedSubjects.map((subject) => (
                      <th
                        key={subject}
                        className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700"
                      >
                        {subject}
                      </th>
                    ))}
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Total</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const stats = calculateStudentStats(student)

                    return (
                      <tr key={student.id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="border border-gray-300 px-4 py-3 text-gray-900">{student.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-900">{student.rollNo}</td>
                        {assignedSubjects.map((subject, subjectIdx) => {
                          // 🔥 Get the actual string mark from student data
                          const stringMark = student.marks?.[subject]
                          const numericMark = stats.marks[subjectIdx]

                          return (
                            <td key={subject} className="border border-gray-300 px-4 py-3 text-center">
                              {numericMark !== null && stringMark ? (
                                <span className="text-gray-900 font-medium">
                                  {Number.parseFloat(stringMark).toFixed(0)}
                                </span>
                              ) : (
                                <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-sm">Pending</span>
                              )}
                            </td>
                          )
                        })}
                        <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                          {stats.total}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <span
                            className={`font-semibold ${
                              stats.percentage === "Pending" ? "text-yellow-600" : "text-green-600"
                            }`}
                          >
                            {stats.percentage}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {students.length === 0 && !loading && !error && examId && (
            <div className="text-center py-8 text-gray-500">No student data found for the selected exam.</div>
          )}
        </div>
      </div>
    </div>
  )
}
