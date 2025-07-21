import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
export async function POST(req: NextRequest) {
  const token = (await cookies()).get('token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
  const teacherId = payload.id

  const { name, rollNo, dob, aadhar } = await req.json()

  const [assignment]: any = await db.query(`
    SELECT class_id, section_id
    FROM teacher_assignments
    WHERE teacher_id = ?
  `, [teacherId])

  if (!assignment.length) {
    return NextResponse.json({ success: false, message: 'You are not assigned to any class.' })
  }

  const { class_id, section_id } = assignment[0]

  const email = `${rollNo.toLowerCase()}@school.com`
  const rawPassword = 'student123'
  const hashedPassword = await bcrypt.hash(rawPassword, 10)
  const id = uuidv4()

  try {
    // Insert into users
    await db.query(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, 'STUDENT')
    `, [id, name, email, hashedPassword])

    // Insert into students
    await db.query(`
      INSERT INTO students (id, name, rollNo, dob, aadhar, class_id, section_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, name, rollNo, dob, aadhar, class_id, section_id])

    return NextResponse.json({
      success: true,
      message: 'Student added successfully.',
      login: { email, password: rawPassword }
    })

  } catch (err: any) {
    console.error('[Add Student Error]', err)

    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({
        success: false,
        message: 'A student with this roll number or email already exists.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred while adding the student.'
    }, { status: 500 })
  }
}
