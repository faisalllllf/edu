import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET() {
  const token = (await cookies()).get('token')?.value
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const teacherId = payload.id
console.log("teacherid",teacherId);
    const [rows] = await db.query('SELECT * FROM classes WHERE teacher_id = ?', [teacherId])
    return new Response(JSON.stringify(rows), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 403 })
  }
}