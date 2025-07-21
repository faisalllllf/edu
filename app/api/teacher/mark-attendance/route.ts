// File: /app/api/teacher/mark-attendance/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const teacherId = payload.id

    const { date, classId, sectionId, attendanceList } = await req.json()

    if (!date || !classId || !sectionId || !Array.isArray(attendanceList)) {
      return NextResponse.json({ error: 'Missing or invalid attendance data' }, { status: 400 })
    }

    const results: {
      studentId: string
      success: boolean
      message?: string
    }[] = []

    for (const entry of attendanceList) {
      const { studentId, status } = entry

      try {
        const [existing]: any = await db.query(
          `SELECT id FROM attendance WHERE student_id = ? AND class_id = ? AND section_id = ? AND date = ?`,
          [studentId, classId, sectionId, date]
        )

        if (existing.length > 0) {
          await db.query(
            `UPDATE attendance SET status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE student_id = ? AND class_id = ? AND section_id = ? AND date = ?`,
            [status, studentId, classId, sectionId, date]
          )
           results.push({ studentId, success: true,message:"Attendance updated " })
        } else {
          await db.query(
            `INSERT INTO attendance (student_id, class_id, section_id, date, status, created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [studentId, classId, sectionId, date, status, teacherId]
          )

           results.push({ studentId, success: true })
        }

       
      } catch (innerErr: any) {
        results.push({
          studentId,
          success: false,
          message: innerErr?.message || 'Failed to process attendance'
        })
      }
    }

    const failed = results.filter(r => !r.success)
    const successCount = results.length - failed.length

    return NextResponse.json({
      success: failed.length === 0,
      message: `${successCount} of ${results.length} attendance records processed.`,
      results
    })
  } catch (err: any) {
    console.error('Attendance API Error:', err)
    return NextResponse.json({
      error: true,
      message: err?.message || 'Something went wrong while marking attendance'
    }, { status: 500 })
  }
}
