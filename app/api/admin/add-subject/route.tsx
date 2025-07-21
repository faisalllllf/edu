import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { name } = await req.json()
  const id = uuid()

  await db.query('INSERT INTO subjects (id, name) VALUES (?, ?)', [id, name])
  return Response.json({ success: true, message: 'Subject added' })
}
