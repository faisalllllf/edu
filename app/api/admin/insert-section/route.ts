import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { name, classId } = await req.json()

  // Check for duplicate section

  const [rows]: any = await db.query(
  'SELECT * FROM sections WHERE name = ? AND class_id = ?',
  [name, classId]
)

if (rows.length > 0) {
  return new Response('Section already exists for this class', { status: 400 })
}
  await db.query(
    'INSERT INTO sections (id, name, class_id) VALUES (?, ?, ?)',
    [uuid(), name, classId]
  )

  return new Response('Section created', { status: 200 })
}
