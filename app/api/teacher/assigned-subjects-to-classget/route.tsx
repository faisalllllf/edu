import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get('classId')
  const sectionId = searchParams.get('sectionId')

  if (!classId || !sectionId) {
    return Response.json({ error: 'Missing class or section' }, { status: 400 })
  }
console.log('Fetching subjects for classId:', classId, 'sectionId:', sectionId);
  const [data] = await db.query(
    `SELECT s.id, s.name FROM assigned_subjects css
     JOIN subjects s ON css.subject_id = s.id
     WHERE css.class_id = ? AND css.section_id = ?`,
    [classId, sectionId]
  )

  return Response.json({ subjects: data })
}
