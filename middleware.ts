import { NextRequest, NextResponse } from 'next/server';

// Define paths that should be client-side only (no SSR)
const CLIENT_ONLY_PATHS = ['/signup', '/marketplace', '/upload'];

export function middleware(request: NextRequest) {
  // Check if the request is for a client-only path
  const url = request.nextUrl.pathname;
  
  if (CLIENT_ONLY_PATHS.some(path => url.startsWith(path))) {
    // For client-only paths, we'll add a header that Next.js can use to avoid SSR
    const response = NextResponse.next();
    // Only set headers if they haven't been sent yet
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('x-client-route', 'true');
    return response;
  }
  
  // For all other paths, just pass through
  return NextResponse.next();
}

// Configure routes for this middleware - run on all routes except static files and API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 