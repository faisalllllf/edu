import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
 const adminId = payload.id
    const { date, attendanceList } = await req.json();
    if (!date || !Array.isArray(attendanceList)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    for (const entry of attendanceList) {
      const { teacherId, status, remarks } = entry;

      const [existing]: any = await db.query(
        `SELECT id FROM teacher_attendance WHERE teacher_id = ? AND date = ?`,
        [teacherId, date]
      );

      if (existing.length > 0) {
        await db.query(
          `UPDATE teacher_attendance SET status = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
           WHERE teacher_id = ? AND date = ?`,
          [status, remarks || null, teacherId, date]
        );
      } else {
        await db.query(
          `INSERT INTO teacher_attendance (teacher_id, date, status, remarks,created_by)
           VALUES (?, ?, ?, ?,?)`,
          [teacherId, date, status, remarks || null,adminId]
        );
      }
    }

    return NextResponse.json({ success: true, message: "Teacher attendance marked." });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
