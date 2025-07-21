// File: /pages/api/admin/get-sections.ts
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get('classId')
  const [rows] = await db.query('SELECT id, name FROM sections WHERE class_id = ?', [classId])
  return Response.json(rows)
}
