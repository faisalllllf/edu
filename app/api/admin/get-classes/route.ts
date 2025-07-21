import { db } from '@/lib/db'

export async function GET() {
  const [rows] = await db.query('SELECT id, name FROM classes')
  return Response.json(rows)
}
