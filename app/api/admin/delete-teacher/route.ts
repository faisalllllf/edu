import { db } from '@/lib/db'

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await db.query('DELETE FROM users WHERE id = ? AND role = "TEACHER"', [id])
  return new Response('Teacher deleted', { status: 200 })
}