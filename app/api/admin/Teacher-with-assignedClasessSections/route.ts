// File: /pages/api/admin/teachers-with-assignments.ts
import { db } from '@/lib/db'

export async function GET() {
  const [rows] = await db.query(`
    SELECT 
      u.id AS teacher_id,
      u.name AS teacher_name,
      c.name AS class_name,
      s.name AS section_name
    FROM teacher_assignments ta
    JOIN users u ON ta.teacher_id = u.id
    JOIN sections s ON ta.section_id = s.id
    JOIN classes c ON s.class_id = c.id
    WHERE u.role = 'TEACHER'
    ORDER BY u.name
  `)

  console.log("rowsastsectioān",rows);
  return Response.json(rows)
}
