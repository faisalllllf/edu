import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const encoder = new TextEncoder()

const protectedRoutes = ['/dashboard']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      console.log('[middleware] No token. Redirecting...')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
      await jwtVerify(token, encoder.encode(JWT_SECRET))
      console.log('[middleware] JWT verified')
    } catch (err) {
      console.error('[middleware] JWT verification failed:', err)
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
