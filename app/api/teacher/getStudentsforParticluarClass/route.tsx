import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const sectionId = searchParams.get('sectionId');
  if (!classId || !sectionId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
console.log("sectopm amd class",sectionId,classId);
  const [students]: any = await db.query(
    `SELECT * FROM students WHERE class_id = ? AND section_id = ?`,
    [classId, sectionId]
  );

  return NextResponse.json(students);
}