import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  const teacherId = payload.id

  const { examId } = await req.json()
  if (!examId) return NextResponse.json({ error: 'Exam name required' }, { status: 400 })

  // Get assigned class and section
  const [assignedRows]: any = await db.query(
    `SELECT class_id, section_id FROM teacher_assignments WHERE teacher_id = ?`,
    [teacherId]
  )

  if (!assignedRows.length) {
    return NextResponse.json({ error: 'You are not assigned to any class' }, { status: 403 })
  }

  const { class_id, section_id } = assignedRows[0]

  const [rows]: any = await db.query(`
    SELECT 
      s.id AS student_id,
      s.name,
      s.rollNo,
      subj.name AS subject,
      m.marks_obtained
    FROM students s
    LEFT JOIN marks m ON s.id = m.student_id AND m.exam_id = ?
    LEFT JOIN subjects subj ON m.subject_id = subj.id
    WHERE s.class_id = ? AND s.section_id = ?
  `, [examId, class_id, section_id])

  // Group by student
  console.log('Fetched rows:', rows);
  const studentMap: any = {}
  for (const row of rows) {
    if (!studentMap[row.student_id]) {
      studentMap[row.student_id] = {
        name: row.name,
        rollNo: row.rollNo,
        marks: row.marks_obtained ? { [row.subject]: row.marks_obtained } : {},
      }
    }
    if (row.subject) {
      studentMap[row.student_id].marks[row.subject] = row.marks_obtained
    }
  }

  const result = Object.values(studentMap)
console.log('Fetched students:', result);
  return NextResponse.json({ students: result })
}
