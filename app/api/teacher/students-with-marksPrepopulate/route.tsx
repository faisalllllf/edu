import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  const teacherId = payload.id

  const { classId, sectionId, subjectId,examId } = await req.json()
console.log(classId, sectionId, subjectId ,parseInt(examId))
  const [students]: any = await db.query(
    `SELECT s.id, s.name, s.rollNo FROM students s WHERE s.class_id = ? AND s.section_id = ?`,
    [classId, sectionId]
  )
const [marks]: any = await db.query(
  `SELECT student_id, marks_obtained FROM marks 
   WHERE class_id = ? AND section_id = ? AND subject_id = ? AND exam_id = ?`,
  [classId, sectionId, subjectId, examId]
)

const marksMap = new Map()
for (const m of marks) {

  marksMap.set(m.student_id, m.marks_obtained);
}

console.log("marks",marks);

const withStatus = students.map((s: any) => ({
  ...s,
  status: marksMap.has(s.id) ? '✅' : '❌',
  marks: marksMap.get(s.id) || ''
}))

  return NextResponse.json({ students: withStatus })
}
