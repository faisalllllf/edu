// File: /app/api/teacher/marks-list/route.ts
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

  const { classId, sectionId, subjectId, examId } = await req.json()

  // Check assignment validity
  const [valid]: any = await db.query(`
    SELECT * FROM teacher_subject_assignments
    WHERE teacher_id = ? AND class_id = ? AND section_id = ? AND subject_id = ?
  `, [teacherId, classId, sectionId, subjectId])

  if (valid.length === 0) {
    return NextResponse.json({ error: 'You are not assigned to this class/subject.' }, { status: 403 })
  }

  // Fetch marks
  const [rows]: any = await db.query(`
    SELECT s.id AS student_id, s.name, s.rollNo, m.marks_obtained
    FROM students s
    LEFT JOIN marks m
      ON s.id = m.student_id
      AND m.subject_id = ?
      AND m.class_id = ?
      AND m.section_id = ?
      AND m.exam_id = ?
    WHERE s.class_id = ? AND s.section_id = ?
  `, [subjectId, classId, sectionId, examId, classId, sectionId])

  return NextResponse.json({ students: rows })
}
