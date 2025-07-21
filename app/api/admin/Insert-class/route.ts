import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  const { name } = await req.json()
  await db.query('INSERT INTO classes (id, name) VALUES (?, ?)', [uuid(), name])
  return new Response('Class created', { status: 200 })
}
