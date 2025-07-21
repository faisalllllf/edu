import { db } from '@/lib/db'

export async function GET() {
  const [subjects]: any = await db.query('SELECT * FROM subjects')
  return Response.json(subjects)
}
