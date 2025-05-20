// Pure JavaScript middleware with absolutely no React dependencies

export const config = {
  matcher: ['/signin', '/signup', '/auth/callback']
};

export default function middleware(request) {
  // Create basic response with headers
  return new Response(null, {
    status: 200,
    headers: {
      'x-edge-middleware': 'true',
      'x-client-side-rendering': 'true'
    }
  });
} 