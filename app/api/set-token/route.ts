import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { token } = await req.json()

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 })
  }
console.log("insode token");
  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
