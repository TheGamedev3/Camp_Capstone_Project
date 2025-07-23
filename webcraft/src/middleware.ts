


const Routes={
    // doesn't require a session to view
    public:[
        '/',
        '/profile/:userId'
    ],

    // requires there to be no session
    // if a session is found, it redirects to /myProfile
    entrance:[
        '/signup',
        '/login'
    ],

    // protected routes require a session
    // and if no session is found, it redirects to login
    protected:[
        '/myProfile'
    ]
}

function matchPath(pathname: string, pattern: string): boolean {
  const pathSegments = pathname.split("/").filter(Boolean);
  const patternSegments = pattern.split("/").filter(Boolean);

  if (pathSegments.length !== patternSegments.length) return false;

  return patternSegments.every((segment, i) =>
    segment.startsWith(":") || segment === pathSegments[i]
  );
}

function protType(pathname: string): 'public' | 'entrance' | 'protected' | null {
  const arrayCompare = (index)=>Routes[index].some(pattern => matchPath(pathname, pattern));
  for (const type of ['public', 'entrance', 'protected'] as const) {
    if (arrayCompare(type)) return type;
  }
  console.warn(`ROUTE "${pathname}" NOT FOUND!`);
  return null;
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function PageRoute(req:NextRequest, pageRoute: string){
    const token = req.cookies.get('sid')?.value;

    // Route Protecting
    const rerouteTo=(()=>{
      switch(protType(pageRoute)){
        case 'public': return null;
        case 'entrance': {if(token)return"/myProfile"; break}
        case 'protected': {if(!token)return"/login"; break}
      } return null;
    })();
    if(rerouteTo === null){
      // ✅ pass
      return NextResponse.next();
    }else{
      // ✈️ reroute
      return NextResponse.redirect(new URL(rerouteTo, req.url));
    }
}

function APIRoute(req:NextRequest, apiRoute: string){
  // ✅ pass
  return NextResponse.next();
}

export function middleware(req: NextRequest) {

  const route = req.nextUrl.pathname;
  if (route.startsWith('/api/')) {
    return APIRoute(req, route);
  }else{
    return PageRoute(req, route);
  }
}



/*
  This matcher:

  ✅ Includes all page and API routes
  🚫 Excludes static assets and resources

*/

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};