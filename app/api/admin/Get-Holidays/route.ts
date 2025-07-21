// app/api/admin/holidays/route.ts
import { db } from '@/lib/db'

export async function GET() {
  const [holidays] = await db.query('SELECT * FROM holidays ORDER BY date ASC')
  console.log("holidays",holidays)
  return Response.json(holidays)
}
