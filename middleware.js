// Ultra minimal middleware with no dependencies at all

// Export config to define paths
export const config = {
  matcher: ['/signin', '/signup', '/auth/callback']
};

// Bare minimum implementation
export default function middleware(request) {
  return new Response();
} 