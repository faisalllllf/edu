import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [rows]: any = await db.query(`
    SELECT u.id AS teacher_id,
           u.name              AS teacher_name,
           c.id AS class_id,
           c.name AS class_name,
           s.id    AS section_id,
      s.name  AS section_name,
           subj.id AS subject_id,
           subj.name AS subject_name
    FROM teacher_subject_assignments tsa
    JOIN users u       ON tsa.teacher_id = u.id
    JOIN classes c     ON tsa.class_id   = c.id
     JOIN sections s    ON tsa.section_id = s.id
    JOIN subjects subj ON tsa.subject_id = subj.id
    WHERE u.role = 'TEACHER';
  `);
  
  

  return NextResponse.json({ assignments: rows });
}
