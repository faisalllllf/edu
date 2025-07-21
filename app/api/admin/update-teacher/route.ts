import { db } from '@/lib/db'

export async function PUT(req: Request) {
  const { id, name, email } = await req.json()
  await db.query('UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "TEACHER"', [name, email, id])
  return new Response('Teacher updated', { status: 200 })
}
