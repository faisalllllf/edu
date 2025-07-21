import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'


export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    // Check if user already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (Array.isArray(existing) && existing.length > 0) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    await db.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, role.toUpperCase()]
    )

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: any) {
    console.error('[REGISTER ERROR]', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
