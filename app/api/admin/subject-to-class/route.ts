import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { classId, sectionId, subjectId } = await req.json()



  // Check for duplicates
  const [result]: any = await db.query(
    `SELECT id FROM assigned_subjects WHERE class_id = ? AND section_id = ? AND subject_id = ?`,
    [classId, sectionId, subjectId]
  )

  console.log('Duplicate check result:', result)
 
  if (result.length > 0) {
    return Response.json({ success: false, message: 'Subject already assigned.' }, { status: 400 })
  }

  // Insert new assignment
  await db.query(
    `INSERT INTO assigned_subjects (id, class_id, section_id, subject_id) VALUES (?, ?, ?, ?)`,
    [uuid(), classId, sectionId, subjectId]
  )

  return Response.json({ success: true, message: 'Subject assigned to class-section.' })
}
