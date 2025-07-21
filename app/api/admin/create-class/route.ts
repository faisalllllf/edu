import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  const { name, teacherId } = await req.json()

  if (!name || !teacherId) {
    return new Response(JSON.stringify({ error: 'Missing class name or teacherId' }), { status: 400 })
  }

  const id = uuidv4()
  await db.query('INSERT INTO classes (id, name, teacher_id) VALUES (?, ?, ?)', [id, name, teacherId])

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}