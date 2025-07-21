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

    const { date } = await req.json();
    if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

    const [teachers]: any = await db.query(`
      SELECT u.id AS teacher_id, u.name, ta.status, ta.remarks
      FROM users u
      LEFT JOIN teacher_attendance ta ON ta.teacher_id = u.id AND ta.date = ?
      WHERE u.role = 'TEACHER'
    `, [date]);


    const processed = teachers.map((t: any) => ({
  ...t,
  alreadyMarked: !!t.status,  // will be true if attendance is recorded
}));


    return NextResponse.json({ teachers:processed });
  } catch (err) {
    console.error("err",err);
    console.error("Fetch teacher attendance error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }

  
}
