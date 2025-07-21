import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { teacherId, subjectId, classId, sectionId } = await req.json()

  const [exists]: any = await db.query(`
    SELECT * FROM teacher_subject_assignments
    WHERE teacher_id = ? AND subject_id = ? AND class_id = ? AND section_id = ?
  `, [teacherId, subjectId, classId, sectionId])

  if (exists.length > 0) {
    return Response.json({ success: false, message: 'Already assigned.' }, { status: 400 })
  }

  await db.query(`
    INSERT INTO teacher_subject_assignments (id, teacher_id, subject_id, class_id, section_id)
    VALUES (?, ?, ?, ?, ?)
  `, [uuid(), teacherId, subjectId, classId, sectionId])

  return Response.json({ success: true, message: 'Assignment successful' })
}
