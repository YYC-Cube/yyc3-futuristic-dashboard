import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"

/* eslint-disable no-console */

interface BundleStats {
  name: string
  size: number
  sizeFormatted: string
  gzipSize: number
  gzipFormatted: string
  percentage: string
}

interface AnalysisResult {
  totalSize: number
  totalGzip: number
  chunks: BundleStats[]
  recommendations: string[]
  timestamp: string
}

export function analyzeBundle(): AnalysisResult {
  try {
    const nextDir = path.join(process.cwd(), ".next")
    const manifestPath = path.join(nextDir, "build-manifest.json")

    if (!fs.existsSync(manifestPath)) {
      return generateEmptyReport()
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
    const chunks = analyzeChunks(manifest)
    
    return {
      totalSize: chunks.reduce((sum, c) => sum + c.size, 0),
      totalGzip: chunks.reduce((sum, c) => sum + c.gzipSize, 0),
      chunks,
      recommendations: generateRecommendations(chunks),
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[Bundle Analyzer] Error:", error)
    return generateEmptyReport()
  }
}

function analyzeChunks(manifest: any): BundleStats[] {
  const chunks: BundleStats[] = []
  
  if (manifest.pages) {
    Object.entries(manifest.pages).forEach(([page, files]: [string, any]) => {
      let totalSize = 0
      
      if (Array.isArray(files)) {
        files.forEach((file: string) => {
          const filePath = path.join(".next", file)
          if (fs.existsSync(filePath)) {
            totalSize += fs.statSync(filePath).size
          }
        })
      }

      if (totalSize > 0) {
        chunks.push({
          name: page,
          size: totalSize,
          sizeFormatted: formatBytes(totalSize),
          gzipSize: Math.round(totalSize * 0.3),
          gzipFormatted: formatBytes(Math.round(totalSize * 0.3)),
          percentage: "0%",
        })
      }
    })
  }

  chunks.sort((a, b) => b.size - a.size)

  const maxSize = chunks[0]?.size || 1
  chunks.forEach(chunk => {
    chunk.percentage = ((chunk.size / maxSize) * 100).toFixed(1) + "%"
  })

  return chunks
}

function generateRecommendations(chunks: BundleStats[]): string[] {
  const recommendations: string[] = []

  const largeChunks = chunks.filter(c => c.size > 200 * 1024)
  largeChunks.forEach(chunk => {
    recommendations.push(
      `⚠️ "${chunk.name}" 较大 (${chunk.sizeFormatted})，考虑使用 dynamic import() 懒加载`
    )
  })

  if (chunks.length > 10) {
    recommendations.push("📦 Chunk 数量较多，考虑合并相关模块")
  }

  const totalSize = chunks.reduce((sum, c) => sum + c.size, 0)
  if (totalSize > 1024 * 1024) {
    recommendations.push(`🔍 总包体积 ${formatBytes(totalSize)} 超过 1MB，建议进行代码分割优化`)
  }

  recommendations.push("💡 启用 Tree Shaking 移除未使用的代码")
  recommendations.push("🎨 使用 @next/bundle-analyzer 进行详细分析")

  return recommendations
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function generateEmptyReport(): AnalysisResult {
  return {
    totalSize: 0,
    totalGzip: 0,
    chunks: [],
    recommendations: [
      "⚠️ 无法分析 bundle，请先运行 `pnpm run build`",
      "💡 使用 `npx @next/bundle-analyzer` 进行详细分析",
    ],
    timestamp: new Date().toISOString(),
  }
}

export function printAnalysisReport(report: AnalysisResult): void {
  console.log("\n" + "=".repeat(80))
  console.log("📊 YYC3 Bundle Size Analysis Report")
  console.log("=".repeat(80))
  console.log(`\n📅 分析时间: ${report.timestamp}`)
  console.log(`\n📦 总大小: ${formatBytes(report.totalSize)} (Gzipped: ${formatBytes(report.totalGzip)})`)
  
  console.log("\n" + "-".repeat(80))
  console.log("📋 Chunk 详情:")
  console.log("-".repeat(80))
  
  report.chunks.forEach((chunk, index) => {
    console.log(
      `\n${index + 1}. ${chunk.name}\n` +
      `   大小: ${chunk.sizeFormatted} | Gzip: ${chunk.gzipFormatted} | 占比: ${chunk.percentage}`
    )
  })

  console.log("\n" + "-".repeat(80))
  console.log("💡 优化建议:")
  console.log("-".repeat(80))
  
  report.recommendations.forEach(rec => {
    console.log(`  ${rec}`)
  })

  console.log("\n" + "=".repeat(80) + "\n")
}
