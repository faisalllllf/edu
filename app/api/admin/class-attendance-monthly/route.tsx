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

        const { start, end, className, section } = await req.json()

        if (!start || !end || !className || !section) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const [rows]: any = await db.query(
            `SELECT 
  u.id AS student_id,
  u.name,
  c.name AS class_name,
  sc.name AS section_name,
  a.date,
  a.status
FROM users u
JOIN students s ON s.id = u.id
JOIN classes c ON c.id = s.class_id
JOIN sections sc ON sc.id = s.section_id
LEFT JOIN attendance a ON a.student_id = u.id AND a.date BETWEEN ? AND ?
WHERE u.role = 'STUDENT' AND c.name = ? AND sc.name = ?`,
            [start, end, className, section]
        )

        const dateList = generateDateList(start, end)

        const attendanceMap: Record<string, any> = {}
        for (const row of rows) {
            if (!attendanceMap[row.student_id]) {
                attendanceMap[row.student_id] = {
                    student_id: row.student_id,
                    name: row.name,
                }
            }
            if (row.date) {
                const isoDate = new Date(row.date).toISOString().split("T")[0]
                attendanceMap[row.student_id][isoDate] = row.status
            }
        }

        const formatted = Object.values(attendanceMap).map((student: any) => {
            for (const date of dateList) {
                if (!(date in student)) {
                    student[date] = null
                }
            }
            return student
        })

        return NextResponse.json({
            dates: dateList,
            attendance: formatted,
        })
    } catch (err) {
        console.error("Error fetching class attendance:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
