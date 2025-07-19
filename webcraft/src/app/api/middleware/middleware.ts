// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/'];

export function middleware(req: NextRequest) {
  const isPublic = PUBLIC_PATHS.includes(req.nextUrl.pathname);

  const token = req.cookies.get('sessionToken')?.value;

  // 🔒 Block non-public pages without session
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}



// Add this to the bottom of middleware.ts:

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
/*
This ensures the middleware:
✅ Runs on all pages except static files and API routes
✅ Can guard UI pages like /myProfile, /makeTrade, etc.

If you want it on API too, change the matcher:
*/

// matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],