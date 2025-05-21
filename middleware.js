import { NextResponse } from 'next/server';

// Ultra minimal middleware with no dependencies at all

// Export config to define paths
export const config = {
  matcher: ['/signin', '/signup', '/auth/callback']
};

// Clean minimal implementation
export default function middleware(request) {
  // Simply pass through requests to these paths
  return NextResponse.next();
} 