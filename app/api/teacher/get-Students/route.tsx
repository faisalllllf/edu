import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// /app/api/teacher/students/route.ts
export async function GET(req: NextRequest) {
 
      const token = (await cookies()).get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
 
  const teacherId = payload.id

  const [rows]: any = await db.query(`
    SELECT ta.class_id, ta.section_id
    FROM teacher_assignments ta
    WHERE ta.teacher_id = ?
  `, [teacherId])

  if (!rows.length) return NextResponse.json([], { status: 200 })

  const { class_id, section_id } = rows[0]

  const [students]: any = await db.query(`
    SELECT * FROM students
    WHERE class_id = ? AND section_id = ?
  `, [class_id, section_id])

  return NextResponse.json(students)
}
function verifyJwt(token: string) {
    throw new Error("Function not implemented.")
}

