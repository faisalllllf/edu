// ✅ STEP 4: API - /api/teacher/marks (GET to view)
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  const subjectId = searchParams.get('subjectId');
  const examName = searchParams.get('examName');

  if (!classId || !sectionId || !subjectId || !examName)
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

  const [rows]: any = await db.query(
    `SELECT * FROM marks WHERE class_id = ? AND section_id = ? AND subject_id = ? AND exam_name = ?`,
    [classId, sectionId, subjectId, examName]
  );

  return NextResponse.json(rows);
}