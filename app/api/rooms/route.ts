import { NextResponse } from "next/server"
import { roomService } from "@/lib/api/services/roomService"

export const revalidate = 60

export async function GET() {
  try {
    const rooms = await roomService.getAll()

    return NextResponse.json(
      {
        code: 200,
        message: "获取包厢列表成功",
        data: rooms,
        timestamp: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Vercel-CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "获取包厢列表失败",
        data: null,
        timestamp: Date.now(),
      },
      { status: 500 }
    )
  }
}
