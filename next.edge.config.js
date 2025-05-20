/**
 * Edge-specific Next.js configuration
 * Used when building the middleware for the edge runtime
 */

module.exports = {
  experimental: {
    runtime: 'edge',
  },
  reactStrictMode: false, // Disable React strict mode for Edge functions
  swcMinify: false, // Disable SWC minifier
  compiler: {
    // Disable React features
    react: false,
    // Don't remove console.log in Edge runtime
    removeConsole: false,
  },
  // Configure middleware to only run on authentication paths
  middleware: {
    // Only match specific paths
    matcher: ['/signin', '/signup', '/auth/callback'],
  },
}; 