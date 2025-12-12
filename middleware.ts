// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(req: NextRequest) {
//   const host = req.headers.get('host') || ''
//   const url = req.nextUrl

//   // Get subdomain part (before first dot)
//   const [subdomain] = host.split('.')

//   // Skip if it's just localhost or main domain
//   if (
//     subdomain &&
//     subdomain !== 'localhost' &&
//     subdomain !== 'yourdomain' // adjust for production
//   ) {
//     // Rewrite to portfolio route internally
//     url.pathname = `/${subdomain}${url.pathname}`
//     return NextResponse.rewrite(url)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//       Match all paths except _next/static, _next/image, favicon, etc.
//     */
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// }
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  const domain = "fordgeindia.online";

  // Ignore main domain and www
  if (host === domain || host === `www.${domain}`) {
    return NextResponse.next();
  }

  // Handle subdomains
  if (host.endsWith(`.${domain}`)) {
    const subdomain = host.replace(`.${domain}`, "");
    
    // Rewrite to /[slug]
    url.pathname = `/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
