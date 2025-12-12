import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  const productionDomain = "fordgeindia.online";

  // 🚀 LOCAL DEVELOPMENT SUPPORT:
  if (host.includes("localhost")) {
    // localhost:3000 → no subdomain
    // vendor.localhost:3000 → works
    const parts = host.split(".");
    const maybeSub = parts.length > 1 ? parts[0] : null;

    if (maybeSub && maybeSub !== "localhost") {
      url.searchParams.set("vendor", maybeSub);
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  // 🚀 PRODUCTION SUPPORT:
  if (host.endsWith(productionDomain)) {
    const subdomain = host.replace(`.${productionDomain}`, "");

    if (subdomain !== "www" && subdomain !== "fordgeindia") {
      url.searchParams.set("vendor", subdomain);
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};



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
