/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Force client API base to relative path to avoid CORS
  env: {
    NEXT_PUBLIC_API_URL: '/api/v1',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5000/api/:path*', // docker internal service name
      },
    ];
  },
};

module.exports = nextConfig;


