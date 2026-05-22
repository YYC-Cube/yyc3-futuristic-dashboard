export type AIModel = "glm-4.6" | "glm-4.5v" | "glm-4.5-flash" | "embedding-3"

export interface AIMessage {
  role: "system" | "user" | "assistant"
  content: string
  timestamp?: number
}

export interface AIResponse {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: string
}

export interface ChatCompletionOptions {
  model?: AIModel
  temperature?: number
  maxTokens?: number
  stream?: boolean
  systemPrompt?: string
}

export interface VisionInput {
  image: string | File
  mimeType: string
  text?: string
}

class AIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.ZHIPU_API_KEY || ""
    this.baseUrl = process.env.ZHIPU_BASE_URL || "https://open.bigmodel.cn/api/paas/v4"
  }

  async chatCompletion(
    messages: AIMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<AIResponse> {
    const {
      model = "glm-4.6",
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt,
    } = options

    const formattedMessages = []

    if (systemPrompt) {
      formattedMessages.push({
        role: "system",
        content: systemPrompt,
      })
    }

    formattedMessages.push(
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
    )

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature,
          max_tokens: maxTokens,
          top_p: 0.9,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      return {
        content: data.choices[0]?.message?.content || "",
        model: data.model,
        usage: data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        finishReason: data.choices[0]?.finish_reason || "stop",
      }
    } catch (error) {
      console.error("[AIService] Chat completion error:", error)
      throw error
    }
  }

  async visionAnalysis(
    input: VisionInput,
    question: string,
    options: Omit<ChatCompletionOptions, "stream"> = {}
  ): Promise<AIResponse> {
    const { model = "glm-4.5v", ...rest } = options

    let imageData: string

    if (input.image instanceof File) {
      const buffer = await input.image.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      imageData = `data:${input.mimeType};base64,${base64}`
    } else {
      imageData = input.image
    }

    const messages: AIMessage[] = [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: imageData },
          },
          {
            type: "text",
            text: question || input.text || "请描述这张图片的内容",
          },
        ].join("\n"),
      },
    ]

    return this.chatCompletion(messages, { ...options, model })
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "embedding-3",
        input: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`Embedding API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.data[0]?.embedding || []
  }

  async streamingChat(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options: ChatCompletionOptions = {}
  ): Promise<void> {
    const { model = "glm-4.6", ...rest } = options

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        stream: true,
        ...rest,
      }),
    })

    if (!response.ok) {
      throw new Error(`Streaming API Error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error("No reader available")
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.startsWith("data: "))

      for (const line of lines) {
        const data = line.slice(6)

        if (data === "[DONE]") {
          return
        }

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0]?.delta?.content

          if (content) {
            onChunk(content)
          }
        } catch {
          // Skip invalid JSON chunks
        }
      }
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: "positive" | "negative" | "neutral"
    confidence: number
    score: number
  }> {
    const systemPrompt = `你是一个情感分析专家。分析用户文本的情感倾向。
返回JSON格式：
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0-1之间的置信度,
  "score": -1到1的情感分数（-1极度负面，1极度正面）
}`

    const response = await this.chatCompletion(
      [{ role: "user", content: text }],
      {
        model: "glm-4.5-flash",
        temperature: 0.1,
        systemPrompt,
      }
    )

    try {
      return JSON.parse(response.content)
    } catch {
      return {
        sentiment: "neutral",
        confidence: 0.5,
        score: 0,
      }
    }
  }

  async summarizeText(
    text: string,
    maxLength: number = 200
  ): Promise<string> {
    const systemPrompt = `你是一个文本摘要专家。请将用户提供的文本总结为简洁的摘要，不超过${maxLength}字。保持关键信息完整。`

    const response = await this.chatCompletion(
      [{ role: "user", content: text }],
      {
        model: "glm-4.5-flash",
        temperature: 0.3,
        systemPrompt,
      }
    )

    return response.content
  }

  async translateText(
    text: string,
    targetLanguage: string = "English"
  ): Promise<string> {
    const systemPrompt = `你是一个专业翻译专家。请将用户文本翻译成${targetLanguage}，保持原文的语气和风格。`

    const response = await this.chatCompletion(
      [{ role: "user", content: text }],
      {
        model: "glm-4.5-flash",
        temperature: 0.2,
        systemPrompt,
      }
    )

    return response.content
  }
}

export const aiService = new AIService()
export default AIService
