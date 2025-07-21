import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { db } from '@/lib/db'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET() {
  const token = (await cookies()).get('token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

   try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userId = payload.id

    const [rows]: any = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId])
    if (!rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}