import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
const token = (await cookies()).get('token')?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided." }, { status: 401 })
    }

    // Verify JWT
    let payload
    try {
      const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      payload = verified.payload
    } catch (err: any) {
      if (err?.code === "ERR_JWT_EXPIRED") {
        return NextResponse.json({ error: "Token expired." }, { status: 401 })
      }
      return NextResponse.json({ error: "Invalid token." }, { status: 401 })
    }

    const teacherId = payload.id
    if (!teacherId) {
      return NextResponse.json({ error: "Invalid token payload: Missing teacher ID." }, { status: 400 })
    }

    // Fetch assigned class & section
    const [assignments]: any[] = await db.query(
      `SELECT class_id, section_id FROM teacher_assignments WHERE teacher_id = ?`,
      [teacherId]
    )

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ error: "No class or section assigned to you." }, { status: 400 })
    }

    const { class_id, section_id } = assignments[0]

    // Fetch students
    const [students]: any[] = await db.query(
      `SELECT id, name, rollNo FROM students WHERE class_id = ? AND section_id = ?`,
      [class_id, section_id]
    )

    return NextResponse.json({
      students: students || [],
      class_id,
      section_id
    })
  } catch (err: any) {
    console.error("API Error - /students-for-attendance:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
