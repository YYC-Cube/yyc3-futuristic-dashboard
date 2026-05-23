/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  typescript: {
    ignoreBuildErrors: false,
  },

  serverExternalPackages: ["@sentry/nextjs"],

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
      },
    ],
    minimumCacheTTL: 60,
  },

  trailingSlash: true,

  basePath: "",

  assetPrefix: process.env.NODE_ENV === "production" ? "" : undefined,

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  async headers() {
    return []
  },

  async rewrites() {
    return []
  },

  async redirects() {
    return []
  },
}

export default nextConfig
