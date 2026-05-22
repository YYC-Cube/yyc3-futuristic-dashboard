import { NextRequest, NextResponse } from "next/server"

const FOUNDRY_ENDPOINT = process.env.FOUNDRY_AGENT_ENDPOINT || ""
const FOUNDRY_API_KEY = process.env.FOUNDRY_AGENT_API_KEY || ""

const SYSTEM_PROMPT = `你是 YYC3 智慧商家管理系统的 AI 助手。你的职责是：

1. 业务查询：回答关于包厢状态、订单、商品、会员、库存等问题
2. 数据分析：提供营业数据分析、趋势解读、经营建议
3. 异常告警：识别异常数据（如库存不足、包厢超时）并提醒
4. 操作辅助：指导用户完成开房、点单、结账等业务操作

回复要求：
- 使用中文回复
- 数据查询结果用表格或列表展示
- 经营建议需基于数据支撑
- 对于不确定的信息，明确说明`

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages }: { messages: ChatMessage[] } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages is required" },
        { status: 400 }
      )
    }

    if (!FOUNDRY_ENDPOINT || !FOUNDRY_API_KEY) {
      return NextResponse.json({
        reply: generateMockReply(messages),
        source: "mock",
      })
    }

    const response = await fetch(FOUNDRY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FOUNDRY_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Foundry Agent 请求失败" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || data.reply || "暂无回复",
      source: "foundry",
    })
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    )
  }
}

function generateMockReply(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1]?.content || ""
  const lower = lastMessage.toLowerCase()

  if (lower.includes("包厢") || lower.includes("房间")) {
    return "当前共有 8 个包厢，其中 3 个空闲、4 个消费中、1 个清洁中。VIP-01 和 VIP-02 已空闲超过 2 小时，建议主动联系老客户预约。"
  }
  if (lower.includes("营业") || lower.includes("收入") || lower.includes("销售")) {
    return "今日营业额 ¥12,580，较昨日增长 15%。高峰时段为 20:00-22:00，酒水类商品占比 62%。建议关注啤酒库存，预计明晚将低于安全线。"
  }
  if (lower.includes("会员")) {
    return "当前共有 156 位活跃会员，本月新增 12 位。金卡会员消费频次是普通会员的 3.2 倍，建议针对银卡会员推送升级优惠。"
  }
  if (lower.includes("库存") || lower.includes("商品")) {
    return "当前有 3 项商品库存低于安全线：百威啤酒（剩余 24 瓶）、矿泉水（剩余 36 瓶）、纸巾（剩余 8 条）。建议尽快补货。"
  }

  return "您好！我是 YYC3 智能助手，可以帮您查询包厢状态、营业数据、会员信息、库存情况等。请问有什么需要帮助的？"
}
