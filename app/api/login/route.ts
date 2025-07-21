import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  type User = {
    id: string
    name: string
    email: string
    password: string
    role: string
  }
 
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]) as unknown as [User[]]
  const user = rows[0]
  if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
  ;(await cookies()).set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })
  return new Response(JSON.stringify({ token, role: user.role }), { status: 200 })
}
