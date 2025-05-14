import { NextRequest, NextResponse } from 'next/server';

// Define paths that should be client-side only (no SSR)
const CLIENT_ONLY_PATHS = ['/signup'];

export function middleware(request: NextRequest) {
  // Simply pass through all requests - we're using client-side only for problematic pages
  return NextResponse.next();
}

// Configure routes for this middleware - run on all routes except static files and API
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 