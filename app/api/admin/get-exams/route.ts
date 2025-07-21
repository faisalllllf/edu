import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    console.log("inside");
  try {
    const [exams]: any = await db.query(`
      SELECT id, name 
      FROM exams 
      ORDER BY created_at DESC
    `)
    return NextResponse.json({ exams })
  } catch (err) {
    console.error('[Get Exams]', err)
    return NextResponse.json({ exams: [], message: 'Error loading exams.' }, { status: 500 })
  }
}

