import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic middleware - no React imports or dependencies
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Simple URL rewrite logic for auth paths
  if (path === '/signin' || path === '/signup' || path === '/auth/callback') {
    // Add client-side rendering header
    const response = NextResponse.next();
    response.headers.set('x-client-side-rendering', 'true');
    return response;
  }
  
  return NextResponse.next();
}

// Only run middleware on these paths
export const config = {
  matcher: ['/signin', '/signup', '/auth/callback'],
};

// Configure routes for this middleware - run on all routes except static files and API
export const configRoutes = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 