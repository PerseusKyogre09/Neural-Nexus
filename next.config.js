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
  // Create a static fallback for signup page to prevent SSR issues
  async rewrites() {
    return {
      beforeFiles: [
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
      ],
    };
  },
};

module.exports = nextConfig; 