import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classId = searchParams.get('classId')

  if (!classId) return new Response(JSON.stringify({ error: 'Missing classId' }), { status: 400 })

  const [rows] = await db.query('SELECT * FROM students WHERE class_id = ?', [classId])
  return new Response(JSON.stringify(rows), { status: 200 })
}
