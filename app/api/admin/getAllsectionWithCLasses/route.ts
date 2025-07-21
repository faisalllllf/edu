// File: /pages/api/admin/get-sections.ts
import { db } from '@/lib/db'

export async function GET(req: Request) {

  const [rows] = await db.query('select s.name as sectionName,c.name as className from sections s join classes c on s.class_id=c.id');

  console.log("rows",rows);
  return Response.json(rows)
}
