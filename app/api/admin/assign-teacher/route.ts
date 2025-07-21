// File: /pages/api/admin/assign-teacher.ts
import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { teacherId, sectionId, classId } = await req.json()

  // Step 1: Validate the section belongs to the class
  const [sectionRows] = await db.query(
    'SELECT * FROM sections WHERE id = ? AND class_id = ?',
    [sectionId, classId]
  )

  if ((sectionRows as any[]).length === 0) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Section does not belong to the selected class.',
    }), { status: 400 })
  }

  // Step 2: Ensure teacher is not already assigned
  const [existingTeacher] = await db.query(
    'SELECT * FROM teacher_assignments WHERE teacher_id = ?',
    [teacherId]
  )

  if ((existingTeacher as any[]).length > 0) {
    return new Response(JSON.stringify({
      success: false,
      message: 'This teacher is already assigned to a section.',
    }), { status: 400 })
  }

  // Step 3: Ensure class-section doesn't already have a teacher
  const [existingAssignment] = await db.query(`
    SELECT ta.* FROM teacher_assignments ta
    WHERE ta.class_id = ? AND ta.section_id = ?
  `, [classId, sectionId])

  if ((existingAssignment as any[]).length > 0) {
    return new Response(JSON.stringify({
      success: false,
      message: 'This class-section already has a teacher assigned.',
    }), { status: 400 })
  }

  // Step 4: Insert assignment
  await db.query(
    'INSERT INTO teacher_assignments (id, teacher_id, class_id, section_id) VALUES (?, ?, ?, ?)',
    [uuid(), teacherId, classId, sectionId]
  )

  return new Response(JSON.stringify({
    success: true,
    message: 'Teacher assigned to section successfully.',
  }), { status: 200 })
}
