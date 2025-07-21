// ✅ STEP 2: API - /api/teacher/assigned-subjects/route.ts

import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: NextRequest) {
 
       const token = (await cookies()).get('token')?.value
   if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
 const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  
   const teacherId = payload.id
  const [rows]: any = await db.query(`
    SELECT tsa.subject_id, subj.name AS subject_name, c.id AS class_id, c.name AS class_name, s.id AS section_id, s.name AS section_name
    FROM teacher_subject_assignments tsa
    JOIN subjects subj ON tsa.subject_id = subj.id
    JOIN classes c ON tsa.class_id = c.id
    JOIN sections s ON tsa.section_id = s.id
    WHERE tsa.teacher_id = ?
  `, [teacherId]);


console.log("rows",rows);
 return NextResponse.json({ assignments: rows });
}