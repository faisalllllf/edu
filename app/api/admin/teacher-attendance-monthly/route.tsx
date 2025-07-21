// File: app/api/admin/teacher-attendance-monthly/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// Helper to generate date list between two dates
function generateDateList(start: string, end: string): string[] {
  const result: string[] = []
  const curr = new Date(start)
  const last = new Date(end)

  while (curr <= last) {
    result.push(curr.toISOString().split("T")[0])
    curr.setDate(curr.getDate() + 1)
  }

  return result
}


export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { start, end } = await req.json()
    if (!start || !end) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 })
    }

    const [rows]: any = await db.query(
      `SELECT u.id AS teacher_id, u.name, ta.date, ta.status
       FROM users u
       LEFT JOIN teacher_attendance ta ON ta.teacher_id = u.id
         AND ta.date BETWEEN ? AND ?
       WHERE u.role = 'TEACHER'`,
      [start, end]
    )

    const dateList = generateDateList(start, end)

    // Organize data
    const attendanceMap: Record<string, any> = {}
    for (const row of rows) {
      if (!attendanceMap[row.teacher_id]) {
        attendanceMap[row.teacher_id] = { teacher_id: row.teacher_id, name: row.name }
      }
     if (row.date) {
  const isoDate = new Date(row.date).toISOString().split("T")[0]
  attendanceMap[row.teacher_id][isoDate] = row.status
}
    }

    // Fill in missing dates with null
    const formatted = Object.values(attendanceMap).map((teacher: any) => {
      for (const date of dateList) {
        if (!(date in teacher)) {
          teacher[date] = null
        }
      }
      return teacher
    })

    return NextResponse.json({
      dates: dateList,
       attendance: Object.values(attendanceMap),
    })
  } catch (err) {
    console.error('Error fetching monthly attendance:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
