/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core settings
  reactStrictMode: false,
  swcMinify: false,
  
  // Image optimization settings
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.arweave.net' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.ipfs.nftstorage.link' },
      { protocol: 'https', hostname: '**.ipfs.w3s.link' },
      { protocol: 'https', hostname: '**.ipfs.dweb.link' },
    ],
  },
  
  // Disable type checking and linting during build
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // Middleware configuration
  experimental: {
    middlewarePrefetch: false,
  },
  
  // Webpack configuration
  webpack: (config, { isEdgeRuntime }) => {
    // Handle Edge runtime (middleware)
    if (isEdgeRuntime) {
      const originalEntry = config.entry;
      
      // Handle middleware entry
      config.entry = async () => {
        const entries = await originalEntry();
        
        if (entries['middleware']) {
          console.log('Configuring webpack for middleware');
        }
        
        return entries;
      };
      
      // Force React to be empty in edge runtime
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          'react': false,
          'react-dom': false,
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 