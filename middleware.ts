// Absolute bare minimum middleware with zero React dependencies
import type { NextRequest } from 'next/server';

// Simple export config with matchers
export const config = {
  matcher: ['/signin', '/signup', '/auth/callback']
};

// Ultra-minimal middleware function with no dependencies
export default function middleware(request: NextRequest) {
  // Just set headers and return
  const response = new Response(null, {
    status: 200,
    headers: {
      'x-edge-middleware': 'true',
      'x-client-side-rendering': 'true'
    }
  });
  
  return response;
} 