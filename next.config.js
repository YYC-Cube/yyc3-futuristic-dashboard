/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 启用严格模式和 SWC 编译优化
  reactStrictMode: true,
  swcMinify: true,

  // ✅ App Router 与实验特性支持
  experimental: {
    appDir: true,
    serverActions: true,
    instrumentationHook: true, // 支持 reportWebVitals
  },

  // ✅ 国际化配置（默认中文）
  i18n: {
    locales: ["zh-CN", "en"],
    defaultLocale: "zh-CN",
  },

  // ✅ 安全头部配置（推荐）
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],

  // ✅ 环境变量注入（可选）
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
  },

  // ✅ 输出模式（适用于 Docker/Vercel）
  output: "standalone",
}

module.exports = nextConfig
