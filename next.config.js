/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "localhost",
    ],
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Experimental features
  experimental: {
    // Disable CSS optimization to prevent critters-related errors
    optimizeCss: false,
    // Server Actions are available by default now
  },
  // Create a static fallback for client-only pages to prevent SSR issues
  async rewrites() {
    return {
      beforeFiles: [
        // Handle signup page
        {
          source: '/signup',
          destination: '/signup-static.html',
          has: [
            {
              type: 'header',
              key: 'x-is-build',
            },
          ],
        },
        // Handle marketplace page
        {
          source: '/marketplace',
          destination: '/marketplace.html',
          has: [
            {
              type: 'header',
              key: 'x-client-route',
            },
          ],
        },
        // Handle upload page
        {
          source: '/upload',
          destination: '/upload.html',
          has: [
            {
              type: 'header',
              key: 'x-client-route',
            },
          ],
        },
      ],
    };
  },
  // Prevent multiple header setting issues
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 