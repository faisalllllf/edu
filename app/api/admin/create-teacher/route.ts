import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  const hashedPassword = await bcrypt.hash(password, 10)
  await db.query('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [uuid(), name, email, hashedPassword, 'TEACHER'])
  return new Response('Teacher created', { status: 200 })
}