import { aiService, AIMessage } from "./service"

export interface RecommendationItem {
  id: string
  type: "product" | "room" | "service" | "promotion"
  title: string
  description: string
  score: number
  reason: string
  metadata?: Record<string, unknown>
}

export interface UserProfile {
  id: string
  preferences: string[]
  history: string[]
  demographics?: {
    ageGroup?: string
    gender?: string
    location?: string
  }
  behavior?: {
    avgSpending?: number
    visitFrequency?: string
    preferredTime?: string
  }
}

export interface RecommendationContext {
  currentPage: string
  timeOfDay: string
  dayOfWeek: string
  season?: string
  weather?: string
}

class RecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map()
  private itemEmbeddings: Map<string, number[]> = new Map()

  async initialize(): Promise<void> {
    console.log("[RecommendationEngine] Initializing...")
    
    const popularItems = [
      { id: "prod-001", name: "青岛啤酒", category: "beer" },
      { id: "prod-002", name: "果盘", category: "fruits" },
      { id: "room-vip", name: "VIP包厢", category: "room" },
    ]

    for (const item of popularItems) {
      try {
        const embedding = await aiService.generateEmbedding(
          `${item.name} ${item.category} 热门推荐`
        )
        this.itemEmbeddings.set(item.id, embedding)
      } catch (error) {
        console.error(`[RecommendationEngine] Failed to embed ${item.id}:`, error)
      }
    }

    console.log(`[RecommendationEngine] Initialized with ${this.itemEmbeddings.size} items`)
  }

  updateUserProfile(userId: string, profile: Partial<UserProfile>): void {
    const existing = this.userProfiles.get(userId) || {
      id: userId,
      preferences: [],
      history: [],
    }

    this.userProfiles.set(userId, { ...existing, ...profile })
  }

  async getPersonalizedRecommendations(
    userId: string,
    context: RecommendationContext,
    limit: number = 5
  ): Promise<RecommendationItem[]> {
    const user = this.userProfiles.get(userId)

    if (!user) {
      return this.getPopularRecommendations(context, limit)
    }

    const systemPrompt = `你是一个KTV/娱乐场所的智能推荐专家。根据用户画像和当前场景，生成个性化推荐。

用户画像：
- 偏好: ${user.preferences.join(", ")}
- 历史: ${user.history.slice(-5).join(", ")}

当前场景：
- 页面: ${context.currentPage}
- 时间: ${context.timeOfDay}
- 星期: ${context.dayOfWeek}

请返回JSON数组，每个推荐包含：
{
  "id": "唯一标识",
  "type": "product|room|service|promotion",
  "title": "推荐标题",
  "description": "详细描述",
  "score": 0-100的相关度分数,
  "reason": "推荐理由"
}`

    try {
      const response = await aiService.chatCompletion(
        [{ role: "user", content: `请为该用户生成${limit}个个性化推荐` }],
        {
          model: "glm-4.6",
          temperature: 0.7,
          systemPrompt,
        }
      )

      const recommendations = JSON.parse(response.content)

      return recommendations.slice(0, limit).map((rec: any) => ({
        ...rec,
        score: Math.min(100, Math.max(0, rec.score || 50)),
      }))
    } catch (error) {
      console.error("[RecommendationEngine] AI recommendation failed:", error)
      return this.getPopularRecommendations(context, limit)
    }
  }

  getPopularRecommendations(
    context: RecommendationContext,
    limit: number = 5
  ): RecommendationItem[] {
    const baseRecommendations: RecommendationItem[] = [
      {
        id: "prod-001",
        type: "product",
        title: "青岛啤酒 🍺",
        description: "冰镇清爽，聚会必备",
        score: 95,
        reason: "热门商品，销量第一",
      },
      {
        id: "prod-002",
        type: "product",
        title: "精美果盘 🍎",
        description: "新鲜水果，健康美味",
        score: 88,
        reason: "会员推荐，好评如潮",
      },
      {
        id: "promo-weekend",
        type: "promotion",
        title: "周末特惠 🎉",
        description: "包厢8折，酒水买二送一",
        score: 92,
        reason: "限时优惠，不容错过",
      },
      {
        id: "service-karaoke",
        type: "service",
        title: "专业K歌指导 🎤",
        description: "提升你的演唱技巧",
        score: 75,
        reason: "新服务上线，免费体验",
      },
      {
        id: "room-vip",
        type: "room",
        title: "VIP豪华包厢 👑",
        description: "顶级音响，尊贵体验",
        score: 85,
        reason: "升级享受，品质之选",
      },
    ]

    let filtered = baseRecommendations

    if (context.timeOfDay === "evening" || context.timeOfDay === "night") {
      filtered = filtered.map((item) =>
        item.type === "product" ? { ...item, score: item.score + 10 } : item
      )
    }

    if (context.dayOfWeek === "Friday" || context.dayOfWeek === "Saturday") {
      filtered = filtered.map((item) =>
        item.type === "promotion" ? { ...item, score: item.score + 15 } : item
      )
    }

    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  async getContentBasedRecommendations(
    itemId: string,
    itemType: string,
    limit: number = 3
  ): Promise<RecommendationItem[]> {
    const itemEmbedding = this.itemEmbeddings.get(itemId)

    if (!itemEmbedding) {
      return []
    }

    const similarities: Array<{ id: string; similarity: number }> = []

    for (const [id, embedding] of this.itemEmbeddings.entries()) {
      if (id !== itemId) {
        const similarity = this.cosineSimilarity(itemEmbedding, embedding)
        similarities.push({ id, similarity })
      }
    }

    similarities.sort((a, b) => b.similarity - a.similarity)

    return similarities.slice(0, limit).map((sim) => ({
      id: sim.id,
      type: itemType as RecommendationItem["type"],
      title: `相似推荐 ${sim.id}`,
      description: `与您浏览的内容相似度 ${(sim.similarity * 100).toFixed(1)}%`,
      score: sim.similarity * 100,
      reason: "基于内容相似性推荐",
    }))
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)

    return denominator === 0 ? 0 : dotProduct / denominator
  }

  trackUserAction(userId: string, action: string, itemId?: string): void {
    const user = this.userProfiles.get(userId)

    if (!user) return

    switch (action) {
      case "view":
        if (itemId && !user.history.includes(itemId)) {
          user.history.push(itemId)
          if (user.history.length > 50) {
            user.history.shift()
          }
        }
        break

      case "purchase":
        if (itemId) {
          const prefKey = `purchased_${itemId}`
          if (!user.preferences.includes(prefKey)) {
            user.preferences.push(prefKey)
          }
        }
        break

      case "like":
        if (itemId) {
          const prefKey = `liked_${itemId}`
          if (!user.preferences.includes(prefKey)) {
            user.preferences.unshift(prefKey)
          }
        }
        break
    }

    this.userProfiles.set(userId, user)
  }

  clearUserProfile(userId: string): void {
    this.userProfiles.delete(userId)
  }

  getStats(): { totalUsers: number; totalItems: number } {
    return {
      totalUsers: this.userProfiles.size,
      totalItems: this.itemEmbeddings.size,
    }
  }
}

export const recommendationEngine = new RecommendationEngine()
export default RecommendationEngine
