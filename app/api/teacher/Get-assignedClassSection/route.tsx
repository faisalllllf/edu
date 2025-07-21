import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { db } from "@/lib/db"
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: NextRequest) {

 const token = (await cookies()).get('token')?.value
   if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 
   const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
   const teacherId = payload.id
 

  const [rows]: any = await db.query(`
    SELECT 
      ta.section_id as sectionId, 
      s.name AS sectionName, 
      c.id AS classId, 
      c.name AS className
    FROM teacher_assignments ta
    JOIN sections s ON ta.section_id = s.id
    JOIN classes c ON s.class_id = c.id
    WHERE ta.teacher_id = ?
  `, [teacherId])

  if (!rows.length) {
    return NextResponse.json({ error: 'No assignment found' }, { status: 404 })
  }
console.log('Assignment rows:', rows[0]);
  return NextResponse.json({ assignment: rows[0] })
}
