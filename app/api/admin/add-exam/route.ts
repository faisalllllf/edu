import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Exam name is required.' }, { status: 400 })
    }

    const [exists]: any = await db.query('SELECT id FROM exams WHERE name = ?', [name.trim()])
    if (exists.length > 0) {
      return NextResponse.json({ success: false, message: 'This exam already exists.' }, { status: 409 })
    }

    await db.query('INSERT INTO exams (name) VALUES (?)', [name.trim()])
    return NextResponse.json({ success: true, message: 'Exam added successfully.' })

  } catch (err) {
    console.error('[Add Exam]', err)
    return NextResponse.json({ success: false, message: 'Error adding exam.' }, { status: 500 })
  }
}
