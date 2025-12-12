// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const url = req.nextUrl

  // Get subdomain part (before first dot)
  const [subdomain] = host.split('.')

  // Skip if it's just localhost or main domain
  if (
    subdomain &&
    subdomain !== 'localhost' &&
    subdomain !== 'yourdomain' // adjust for production
  ) {
    // Rewrite to portfolio route internally
    url.pathname = `/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Match all paths except _next/static, _next/image, favicon, etc.
    */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
