/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Disable static page generation
  output: 'standalone',
  // Skip static optimization
  generateStaticParams: async () => {
    return [];
  },
}

module.exports = nextConfig

