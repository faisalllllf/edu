// File: /app/dashboard/parent/page.tsx
import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export default async function ParentDashboard() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('token')?.value
  let user: (JwtPayload & { id: string; role: string }) | null = null

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as JwtPayload & {
        id: string
        role: string
      }
      user = decoded
    } catch (e) {
      user = null
    }
  }

  return (
    <div className="p-8">
      <h1>👪 Parent Dashboard</h1>
      {user && <p>Welcome, {user.id} ({user.role})</p>}
    </div>
  )
}
