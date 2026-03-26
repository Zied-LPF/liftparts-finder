import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Autoriser routes publiques + assets PWA
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/logos') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next()
  }

  const cookie = req.cookies.get('lpf_auth')

  if (!cookie) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
