// /app/api/logout/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = cookies()
  ;(await cookieStore).set('token', '', {
    path: '/',
    expires: new Date(0), // Expire immediately
  })
  return NextResponse.json({ success: true, message: 'Logged out' })
}
