import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { classId, markedBy, date, records } = await req.json()
    if (!classId || !markedBy || !date || !records) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    for (const record of records) {
      await db.query(
        'INSERT INTO attendance (id, student_id, date, status, marked_by, class_id) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), record.studentId, date, record.status, markedBy, classId]
      )
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('[ATTENDANCE ERROR]', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}