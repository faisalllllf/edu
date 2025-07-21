import { db } from '@/lib/db'

export async function GET() {
  const [rows] = await db.query('SELECT id, name, email FROM users WHERE role = "TEACHER"')
  return Response.json(rows)
}