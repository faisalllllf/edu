import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  const teacherId = payload.id

  const { classId, sectionId, subjectId, examId, marks } = await req.json()

  for (const [studentId, marksObtained] of Object.entries(marks)) {
    const [existing]: any = await db.query(
      `SELECT * FROM marks 
       WHERE student_id = ? AND subject_id = ? AND class_id = ? AND section_id = ? AND exam_id = ?`,
      [studentId, subjectId, classId, sectionId, examId]
    )

    if (existing.length > 0) {
      await db.query(
        `UPDATE marks 
         SET marks_obtained = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE student_id = ? AND subject_id = ? AND class_id = ? AND section_id = ? AND exam_id = ?`,
        [marksObtained, studentId, subjectId, classId, sectionId, examId]
      )
    } else {
      await db.query(
        `INSERT INTO marks 
         (student_id, subject_id, class_id, section_id, exam_id, marks_obtained, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [studentId, subjectId, classId, sectionId, examId, marksObtained, teacherId]
      )
    }
  }

  return NextResponse.json({ success: true, message: 'Marks saved successfully.' })
}
