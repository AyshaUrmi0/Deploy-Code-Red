/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ['i.ibb.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking during production build
  distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next',
  swcMinify: true,
  reactStrictMode: false,
}

module.exports = nextConfig 