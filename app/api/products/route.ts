import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export const revalidate = 300

export async function GET() {
  try {
    const res = await apiClient.getProducts()

    return NextResponse.json(
      {
        code: 200,
        message: "获取商品列表成功",
        data: res.data?.products || [],
        total: res.data?.total || 0,
        timestamp: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
          "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "获取商品列表失败",
        data: [],
        total: 0,
        timestamp: Date.now(),
      },
      { status: 500 }
    )
  }
}
