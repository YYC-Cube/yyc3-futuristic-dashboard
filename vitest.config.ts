import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "lib/stores/**",
        "lib/services/**",
        "lib/api/**",
        "lib/auth/**",
        "lib/hooks/**",
        "lib/utils.ts",
        "lib/cache/**",
      ],
      exclude: [
        "**/*.d.ts",
        "**/types.ts",
        "**/index.ts",
        "**/node_modules/**",
        "**/__tests__/**",
      ],
      thresholds: {
        statements: 50,
        branches: 40,
        functions: 50,
        lines: 50,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
