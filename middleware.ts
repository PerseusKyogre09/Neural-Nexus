import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define paths that should be client-side only (no SSR)
const CLIENT_ONLY_PATHS = ['/signup', '/marketplace', '/upload'];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  
  // Debug logging
  console.log(`Middleware running for path: ${url.pathname}`);
  
  // Create a Supabase client for auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is used for setting cookies in the browser after a response
          // It's not needed for the middleware since we can't modify cookies here
        },
        remove(name: string, options: any) {
          // This is used for removing cookies in the browser after a response
          // It's not needed for the middleware since we can't modify cookies here
        },
      },
    }
  );

  // Check if the user is authenticated
  const { data } = await supabase.auth.getSession();
  
  // Paths that don't require authentication
  const publicPaths = [
    '/',
    '/signin',
    '/signup',
    '/auth/callback',
    '/auth-error',
    '/api/auth/supabase-signup',
    // Navbar public paths
    '/hosting',
    '/community',
    '/research',
    '/open-source-models',
    '/open-source',
    '/pricing',
    '/playground',
    '/api',
    '/about',
    '/careers',
    // Footer public paths
    '/features',
    '/docs',
    '/api-docs',
    '/blog',
    '/blog/category/open-source',
    '/tutorials',
    '/showcase',
    '/github',
    '/privacy',
    '/terms',
    '/cookies',
    '/contact',
    '/company',
    '/partners',
    '/api-reference',
    '/guidelines',
    '/discord',
    '/inference',
    '/leaderboard'
  ];
  
  // More flexible public path check
  const isPublicPath = (path: string) => {
    // Check exact match first
    if (publicPaths.includes(path)) return true;
    
    // Check for path prefixes
    for (const publicPath of publicPaths) {
      if (path.startsWith(`${publicPath}/`)) return true;
    }
    
    // Check for system paths
    if (path.startsWith('/api/') || 
        path.startsWith('/_next/') || 
        path.startsWith('/fonts/') || 
        path.startsWith('/images/')) {
      return true;
    }

    // Handle special subpages (like dynamic routes)
    if (path.match(/^\/careers\/[\w-]+$/)) return true; // Career detail pages
    if (path.match(/^\/blog\/[\w-]+$/)) return true;    // Blog post pages
    if (path.match(/^\/docs\/[\w-]+$/)) return true;    // Documentation subpages
    if (path.match(/^\/partners\/[\w-]+$/)) return true; // Partner pages
    
    return false;
  };

  // Check if the request is for a client-only path
  const isClientOnlyPath = CLIENT_ONLY_PATHS.some(path => url.pathname.startsWith(path));
  
  // For client-only paths, we'll add a header that Next.js can use to avoid SSR
  if (isClientOnlyPath) {
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('x-use-client-only', 'true');
    return response;
  }

  // Handle protected routes
  if (!isPublicPath(url.pathname) && !data.session) {
    // Debug logging
    console.log(`Redirecting from ${url.pathname} to /signin - Not a public path and user not authenticated`);
    
    // Redirect to signin page
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Handle signed in users trying to access auth pages
  if ((url.pathname === '/signin' || url.pathname === '/signup') && data.session) {
    // Debug logging
    console.log(`Redirecting from ${url.pathname} to /dashboard - User already authenticated`);
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Debug logging
  console.log(`Allowing access to: ${url.pathname}`);
  
  return NextResponse.next();
}

// Configure routes for this middleware - run on all routes except static files and API
export const config = {
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