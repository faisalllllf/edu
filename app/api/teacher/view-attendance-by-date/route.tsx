import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 })
    }

    let payload
    try {
      const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      payload = verified.payload
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 })
    }

    const teacherId = payload.id
    if (!teacherId) {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 400 })
    }

    const { date } = await req.json()
    if (!date) {
      return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
    }

    const [assignments]: any = await db.query(
      `SELECT class_id, section_id FROM teacher_assignments WHERE teacher_id = ?`,
      [teacherId]
    )

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ error: 'You are not assigned to any class or section.' }, { status: 403 })
    }

    const { class_id, section_id } = assignments[0]

    const [records]: any = await db.query(
      `SELECT s.id, s.name, s.rollNo, a.status FROM students s
       LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ?
       WHERE s.class_id = ? AND s.section_id = ?`,
      [date, class_id, section_id]
    )

    return NextResponse.json({ students: records || [] })
  } catch (err) {
    console.error('Attendance view error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
