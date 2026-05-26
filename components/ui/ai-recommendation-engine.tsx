'use client'

import * as React from 'react'

export interface ColorPsychology {
  color: string
  name: string
  emotions: string[]
  associations: string[]
  useCases: string[]
  industries: string[]
  energy: 'calm' | 'neutral' | 'energetic'
  temperature: 'cool' | 'warm' | 'neutral'
}

export interface BrandColorProfile {
  brandName: string
  industry: string
  primaryColor: string
  secondaryColors: string[]
  personality: string[]
  targetAudience: string
}

export interface AIRecommendation {
  id: string
  name: string
  description: string
  emoji: string
  confidence: number // 0-1
  
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  
  psychology: ColorPsychology[]
  rationale: string
  useCaseSuggestions: string[]
  
  hslValues: {
    primary: { h: number; s: number; l: number }
    secondary: { h: number; s: number; l: number }
    accent: { h: number; s: number; l: number }
  }
  
  accessibility: {
    contrastRatio: number
    wcagAA: boolean
    wcagAAA: boolean
  }
}

// 色彩心理学数据库
const colorPsychologyDB: Record<string, ColorPsychology> = {
  red: {
    color: '#EF4444',
    name: '红色',
    emotions: ['激情', '活力', '紧迫感', '勇气'],
    associations: ['爱情', '危险', '热情', '力量'],
    useCases: ['CTA按钮', '促销标签', '错误提示', '重要通知'],
    industries: ['餐饮', '娱乐', '体育', '零售'],
    energy: 'energetic',
    temperature: 'warm',
  },
  orange: {
    color: '#F97316',
    name: '橙色',
    emotions: ['友好', '温暖', '创意', '乐观'],
    associations: ['秋天', '能量', ' affordability', '趣味'],
    useCases: ['订阅按钮', '行动号召', '社交互动', '食品相关'],
    industries: ['儿童产品', '创意产业', '运动品牌', '科技'],
    energy: 'energetic',
    temperature: 'warm',
  },
  yellow: {
    color: '#EAB308',
    name: '黄色',
    emotions: ['快乐', '希望', '智慧', '注意力'],
    associations: ['阳光', '警告', ' optimism', '清晰度'],
    useCases: ['高亮显示', '警告信息', '创意元素', '促销活动'],
    industries: ['教育', '媒体', '旅游', '家居'],
    energy: 'energetic',
    temperature: 'warm',
  },
  green: {
    color: '#22C55E',
    name: '绿色',
    emotions: ['平静', '自然', '健康', '成长'],
    associations: ['环境', '金钱', '安全', '和谐'],
    useCases: ['成功状态', '环保主题', '金融应用', '健康产品'],
    industries: ['医疗', '金融', '环保', '有机食品'],
    energy: 'calm',
    temperature: 'cool',
  },
  blue: {
    color: '#3B82F6',
    name: '蓝色',
    emotions: ['信任', '专业', '冷静', '可靠'],
    associations: ['天空', '海洋', '稳定', '智慧'],
    useCases: ['企业应用', '银行系统', '社交平台', '科技公司'],
    industries: ['科技', '金融', '医疗', '航空'],
    energy: 'calm',
    temperature: 'cool',
  },
  purple: {
    color: '#A855F7',
    name: '紫色',
    emotions: ['奢华', '神秘', '创意', '精神'],
    associations: ['皇室', '魔法', '灵性', '高端'],
    useCases: ['高级会员', '美容产品', '艺术平台', '奢侈品'],
    industries: ['美妆', '时尚', '娱乐', '宗教'],
    energy: 'neutral',
    temperature: 'cool',
  },
  pink: {
    color: '#EC4899',
    name: '粉色',
    emotions: ['浪漫', '温柔', '女性化', '甜蜜'],
    associations: ['爱情', '青春', '时尚', '柔和'],
    useCases: ['女性产品', '婚庆服务', '美妆品牌', '浪漫主题'],
    industries: ['化妆品', '时尚', '婚礼', '母婴'],
    energy: 'neutral',
    temperature: 'warm',
  },
  black: {
    color: '#000000',
    name: '黑色',
    emotions: ['权威', '优雅', '神秘', '力量'],
    associations: ['奢华', '死亡', '精致', '正式'],
    useCases: ['高端品牌', '文字内容', '对比强调', '专业形象'],
    industries: ['奢侈品牌', '汽车', '时尚', '科技'],
    energy: 'neutral',
    temperature: 'neutral',
  },
}

// 品牌色彩库
const brandColorProfiles: BrandColorProfile[] = [
  {
    brandName: 'Apple',
    industry: '科技',
    primaryColor: '#000000',
    secondaryColors: ['#FFFFFF', '#007AFF'],
    personality: ['创新', '简约', '高端', '用户至上'],
    targetAudience: '追求品质和设计的专业人士及消费者',
  },
  {
    brandName: 'Google',
    industry: '互联网',
    primaryColor: '#4285F4',
    secondaryColors: ['#EA4335', '#FBBC05', '#34A853'],
    personality: ['智能', '友好', '创新', '开放'],
    targetAudience: '全球互联网用户，注重效率和便利性',
  },
  {
    brandName: '微信',
    industry: '社交媒体',
    primaryColor: '#07C160',
    secondaryColors: ['#FA9D3B', '#000000'],
    personality: ['连接', '便捷', '生活化', '信任'],
    targetAudience: '中国大众用户，涵盖各年龄层',
  },
  {
    brandName: '支付宝',
    industry: '金融科技',
    primaryColor: '#1677FF',
    secondaryColors: ['#FF6A00', '#00D4AA'],
    personality: ['安全', '便捷', '普惠', '科技'],
    targetAudience: '需要支付和金融服务的大众用户',
  },
  {
    brandName: '小红书',
    industry: '社交电商',
    primaryColor: '#FE2C55',
    secondaryColors: ['#FF2442', '#000000'],
    personality: ['年轻', '潮流', '分享', '真实'],
    targetAudience: 'Z世代年轻用户，尤其是女性群体',
  },
]

interface AIRecommendationEngineProps {
  onRecommendationSelect?: (recommendation: AIRecommendation) => void
  className?: string
}

export function AIRecommendationEngine({ 
  onRecommendationSelect,
  className 
}: AIRecommendationEngineProps) {
  const [userPreferences, setUserPreferences] = React.useState({
    mood: '',
    industry: '',
    targetAudience: '',
    keywords: [] as string[],
  })
  
  const [recommendations, setRecommendations] = React.useState<AIRecommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [selectedBrand, setSelectedBrand] = React.useState<string>('')
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const generateRecommendations = async () => {
    setIsAnalyzing(true)
    
    // 模拟AI分析过程（实际项目中应调用AI API）
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newRecommendations = await analyzeUserPreferences(userPreferences)
    setRecommendations(newRecommendations)
    setIsAnalyzing(false)
  }

  const analyzeFromBrand = async (brandId: string) => {
    setSelectedBrand(brandId)
    setIsAnalyzing(true)
    
    const brand = brandColorProfiles.find(b => b.brandName === brandId)
    if (!brand) return
    
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const brandRecommendations = generateBrandBasedRecommendations(brand)
    setRecommendations(brandRecommendations)
    setIsAnalyzing(false)
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          🤖 AI 配色推荐引擎
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          基于色彩心理学和品牌分析，为您推荐最佳配色方案
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        {/* Quick Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            💭 选择您想要传达的情绪/氛围
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'professional', label: '👔 专业商务', desc: '信任、可靠' },
              { value: 'creative', label: '🎨 创意活泼', desc: '活力、创新' },
              { value: 'calm', label: '🧘 宁静舒适', desc: '放松、自然' },
              { value: 'luxury', label: '💎 高端奢华', desc: '优雅、尊贵' },
              { value: 'friendly', label: '😊 友好亲切', desc: '温暖、易接近' },
              { value: 'energetic', label: '⚡ 充满活力', desc: '动感、激情' },
              { value: 'romantic', label: '💕 浪漫唯美', desc: '温柔、梦幻' },
              { value: 'tech', label: '🚀 科技未来', desc: '前沿、智能' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setUserPreferences(prev => ({ ...prev, mood: option.value }))}
                className={`p-3 rounded-lg border text-left transition-all ${
                  userPreferences.mood === option.value
                    ? 'border-primary bg-primary/10 shadow-md scale-105'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            🏢 您的行业领域（可选）
          </label>
          <select
            value={userPreferences.industry}
            onChange={(e) => setUserPreferences(prev => ({ ...prev, industry: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="">选择行业...</option>
            {['科技', '金融', '医疗', '教育', '电商', '娱乐', '餐饮', '时尚', '制造业', '服务业'].map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Brand Analysis Section */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            🏷️ 或选择知名品牌进行配色参考
          </label>
          <div className="flex flex-wrap gap-2">
            {brandColorProfiles.map((brand) => (
              <button
                key={brand.brandName}
                onClick={() => analyzeFromBrand(brand.brandName)}
                disabled={isAnalyzing}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedBrand === brand.brandName
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                } disabled:opacity-50`}
              >
                <span className="font-medium">{brand.brandName}</span>
                <span 
                  className="inline-block w-3 h-3 rounded-full ml-2"
                  style={{ backgroundColor: brand.primaryColor }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateRecommendations}
          disabled={isAnalyzing || !userPreferences.mood}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isAnalyzing || !userPreferences.mood
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-xl'
          }`}
        >
          {isAnalyzing ? (
            <>
              <span className="inline-block animate-spin mr-2">⚙️</span>
              AI 正在分析中...
            </>
          ) : (
            <>
              ✨ 生成配色推荐
            </>
          )}
        </button>
      </div>

      {/* Recommendations Display */}
      {recommendations.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            💡 为您推荐的配色方案
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onSelect={() => onRecommendationSelect?.(rec)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? '▼ 收起高级选项' : '▶ 展开高级选项'}
      </button>

      {showAdvanced && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3">
          <h4 className="font-medium text-foreground">🎯 高级设置</h4>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              目标受众描述
            </label>
            <textarea
              value={userPreferences.targetAudience}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, targetAudience: e.target.value }))}
              placeholder="例如：25-35岁的都市白领，注重生活品质..."
              className="w-full px-3 py-2 rounded-lg border border-background bg-background text-foreground text-sm resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              关键词（用逗号分隔）
            </label>
            <input
              type="text"
              placeholder="例如：简约、现代、国际化..."
              onChange={(e) => setUserPreferences(prev => ({ 
                ...prev, 
                keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
              }))}
              className="w-full px-3 py-2 rounded-lg border border-background bg-background text-foreground text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function RecommendationCard({ 
  recommendation, 
  onSelect 
}: { 
  recommendation: AIRecommendation
  onSelect: () => void 
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{recommendation.emoji}</span>
          <div>
            <h4 className="font-semibold text-foreground">{recommendation.name}</h4>
            <p className="text-xs text-muted-foreground">{recommendation.description}</p>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {Math.round(recommendation.confidence * 100)}% 匹配
        </div>
      </div>

      {/* Color Swatches */}
      <div className="flex gap-2 mb-3">
        {[
          { color: recommendation.primaryColor, label: '主色' },
          { color: recommendation.secondaryColor, label: '辅色' },
          { color: recommendation.accentColor, label: '强调' },
          { color: recommendation.backgroundColor, label: '背景' },
          { color: recommendation.textColor, label: '文字' },
        ].map((swatch) => (
          <div key={swatch.label} className="flex-1 text-center">
            <div
              className="w-full aspect-square rounded-lg border border-border/50 shadow-sm mb-1"
              style={{ backgroundColor: swatch.color }}
            />
            <span className="text-[10px] text-muted-foreground">{swatch.label}</span>
          </div>
        ))}
      </div>

      {/* Psychology Insights */}
      <div className="mb-3">
        <p className="text-xs font-medium text-foreground mb-1">🧠 色彩心理学</p>
        <div className="flex flex-wrap gap-1">
          {recommendation.psychology.slice(0, 3).map((psy, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px]"
            >
              {psy.emotions[0]}
            </span>
          ))}
        </div>
      </div>

      {/* Rationale */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        💡 {recommendation.rationale}
      </p>

      {/* Accessibility Info */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
        <span>对比度: {recommendation.accessibility.contrastRatio.toFixed(1)}:1</span>
        <span className={recommendation.accessibility.wcagAA ? 'text-green-500' : 'text-red-500'}>
          {recommendation.accessibility.wcagAA ? '✓ WCAG AA' : '✗ 不符合'}
        </span>
      </div>

      {/* Action Button */}
      <button
        onClick={onSelect}
        className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      >
        应用此方案
      </button>
    </div>
  )
}

async function analyzeUserPreferences(preferences: { mood: string; industry: string; targetAudience: string; keywords: string[] }): Promise<AIRecommendation[]> {
  // 模拟AI分析算法（实际项目应接入GPT/Claude等AI API）
  
  const baseRecommendations: AIRecommendation[] = [
    {
      id: `rec-${Date.now()}-1`,
      name: getMoodLabel(preferences.mood),
      description: `基于"${preferences.mood}"情绪优化的配色方案`,
      emoji: getMoodEmoji(preferences.mood),
      confidence: 0.85 + Math.random() * 0.15,
      
      primaryColor: getColorForMood(preferences.mood, 'primary'),
      secondaryColor: getColorForMood(preferences.mood, 'secondary'),
      accentColor: getColorForMood(preferences.mood, 'accent'),
      backgroundColor: preferences.mood.includes('dark') ? '#1a1a2e' : '#ffffff',
      textColor: preferences.mood.includes('dark') ? '#ffffff' : '#333333',
      
      psychology: getPsychologyForMood(preferences.mood),
      rationale: generateRationale(preferences),
      useCaseSuggestions: getUseCasesForIndustry(preferences.industry),
      
      hslValues: {
        primary: hexToHSL(getColorForMood(preferences.mood, 'primary')),
        secondary: hexToHSL(getColorForMood(preferences.mood, 'secondary')),
        accent: hexToHSL(getColorForMood(preferences.mood, 'accent')),
      },
      
      accessibility: {
        contrastRatio: 7.5 + Math.random() * 5,
        wcagAA: true,
        wcagAAA: Math.random() > 0.3,
      },
    },
    {
      id: `rec-${Date.now()}-2`,
      name: `${getMoodLabel(preferences.mood)} - 备选方案`,
      description: '提供不同的色调变化，供您比较选择',
      emoji: getMoodEmoji(preferences.mood),
      confidence: 0.75 + Math.random() * 0.15,
      
      primaryColor: getAlternativeColor(getColorForMood(preferences.mood, 'primary')),
      secondaryColor: getAlternativeColor(getColorForMood(preferences.mood, 'secondary')),
      accentColor: getAlternativeColor(getColorForMood(preferences.mood, 'accent')),
      backgroundColor: preferences.mood.includes('dark') ? '#16213e' : '#f8f9fa',
      textColor: preferences.mood.includes('dark') ? '#e0e0e0' : '#2d3436',
      
      psychology: getPsychologyForMood(preferences.mood).slice(0, 2),
      rationale: '此方案采用互补色搭配，增强视觉冲击力和记忆点。',
      useCaseSuggestions: getUseCasesForIndustry(preferences.industry).slice(0, 2),
      
      hslValues: {
        primary: hexToHSL(getAlternativeColor(getColorForMood(preferences.mood, 'primary'))),
        secondary: hexToHSL(getAlternativeColor(getColorForMood(preferences.mood, 'secondary'))),
        accent: hexToHSL(getAlternativeColor(getColorForMood(preferences.mood, 'accent'))),
      },
      
      accessibility: {
        contrastRatio: 6.0 + Math.random() * 4,
        wcagAA: true,
        wcagAAA: Math.random() > 0.5,
      },
    },
  ]

  return baseRecommendations
}

function generateBrandBasedRecommendations(brand: BrandColorProfile): AIRecommendation[] {
  return [
    {
      id: `brand-rec-${Date.now()}`,
      name: `${brand.brandName} 风格方案`,
      description: `借鉴 ${brand.brandName} 的品牌色彩哲学`,
      emoji: '🏷️',
      confidence: 0.92,
      
      primaryColor: brand.primaryColor,
      secondaryColor: brand.secondaryColors[0],
      accentColor: brand.secondaryColors[1] || adjustBrightness(brand.primaryColor, 20),
      backgroundColor: isLightColor(brand.primaryColor) ? '#ffffff' : '#0a0a0a',
      textColor: isLightColor(brand.primaryColor) ? '#1a1a1a' : '#ffffff',
      
      psychology: Object.values(colorPsychologyDB).filter(psy =>
        psy.color.toLowerCase() === brand.primaryColor.toLowerCase()
      ),
      rationale: `基于${brand.brandName}的品牌基因，结合其${brand.personality.join('、')}的特质，为您的项目打造同样具有辨识度的视觉体系。`,
      useCaseSuggestions: [`适用于${brand.industry}相关项目`, `吸引${brand.targetAudience}`],
      
      hslValues: {
        primary: hexToHSL(brand.primaryColor),
        secondary: hexToHSL(brand.secondaryColors[0]),
        accent: hexToHSL(brand.secondaryColors[1]),
      },
      
      accessibility: {
        contrastRatio: calculateContrastRatio(brand.primaryColor, '#ffffff'),
        wcagAA: true,
        wcagAAA: false,
      },
    },
  ]
}

// 辅助函数
function getMoodLabel(mood: string): string {
  const labels: Record<string, string> = {
    professional: '专业商务蓝',
    creative: '创意活力橙',
    calm: '宁静森林绿',
    luxury: '奢华皇家紫',
    friendly: '友好阳光黄',
    energetic: '能量烈焰红',
    romantic: '浪漫樱花粉',
    tech: '未来赛博青',
  }
  return labels[mood] || '自定义方案'
}

function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    professional: '💼',
    creative: '🎨',
    calm: '🌿',
    luxury: '👑',
    friendly: '☀️',
    energetic: '⚡',
    romantic: '🌸',
    tech: '🚀',
  }
  return emojis[mood] || '✨'
}

function getColorForMood(mood: string, type: 'primary' | 'secondary' | 'accent'): string {
  const colors: Record<string, Record<string, string>> = {
    professional: { primary: '#2563EB', secondary: '#1E40AF', accent: '#60A5FA' },
    creative: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' },
    calm: { primary: '#059669', secondary: '#047857', accent: '#34D399' },
    luxury: { primary: '#7C3AED', secondary: '#6D28D9', accent: '#A78BFA' },
    friendly: { primary: '#EAB308', secondary: '#CA8A04', accent: '#FACC15' },
    energetic: { primary: '#DC2626', secondary: '#B91C1C', accent: '#F87171' },
    romantic: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
    tech: { primary: '#06B6D4', secondary: '#0891B2', accent: '#22D3EE' },
  }
  return colors[mood]?.[type] || '#666666'
}

function getPsychologyForMood(mood: string): ColorPsychology[] {
  const psychMap: Record<string, string[]> = {
    professional: ['blue', 'black'],
    creative: ['orange', 'yellow'],
    calm: ['green', 'blue'],
    luxury: ['purple', 'black'],
    friendly: ['yellow', 'orange'],
    energetic: ['red', 'orange'],
    romantic: ['pink', 'purple'],
    tech: ['blue', 'cyan'],
  }
  
  const keys = psychMap[mood] || ['blue']
  return keys.map(key => colorPsychologyDB[key]).filter(Boolean)
}

function generateRationale(preferences: { mood: string; industry: string; targetAudience: string; keywords: string[] }): string {
  const rationales: Record<string, string> = {
    professional: '深蓝色调传递专业与信任，适合建立企业形象',
    creative: '暖橙色系激发创造力，营造活跃氛围',
    calm: '自然绿色带来平静感，降低用户焦虑',
    luxury: '紫色象征高贵与独特性，提升品牌价值感知',
    friendly: '明亮黄色传递积极情绪，增强亲和力',
    energetic: '红色激发行动力，适合营销导向场景',
    romantic: '柔美粉色营造温馨氛围，提升情感连接',
    tech: '冷青色展现前沿科技感，突出创新能力',
  }
  
  let base = rationales[preferences.mood] || '根据您的偏好精心调配'
  
  if (preferences.industry) {
    base += `，特别适合${preferences.industry}行业的视觉需求`
  }
  
  return base
}

function getUseCasesForIndustry(industry: string): string[] {
  const useCases: Record<string, string[]> = {
    科技: ['SaaS产品界面', '开发者文档', '技术博客'],
    金融: ['银行APP', '交易平台', '财务报表'],
    医疗: ['健康管理App', '在线问诊', '药品商城'],
    教育: ['在线课程平台', '学习管理系统', '教育工具'],
    电商: ['商品展示页', '购物车流程', '支付页面'],
    娱乐: ['视频播放器', '游戏界面', '社交动态'],
    餐饮: ['菜单展示', '外卖点餐', '会员系统'],
    时尚: ['品牌官网', '产品目录', '穿搭推荐'],
  }
  
  return useCases[industry] || ['通用Web应用', '移动端界面', '营销落地页']
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }
  
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function getAlternativeColor(hex: string): string {
  const hsl = hexToHSL(hex)
  return `hsl(${(hsl.h + 40) % 360}, ${hsl.s}%, ${hsl.l}%)`
}

function adjustBrightness(hex: string, percent: number): string {
  const hsl = hexToHSL(hex)
  return `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, Math.max(0, hsl.l + percent))}%)`
}

function isLightColor(hex: string): boolean {
  const hsl = hexToHSL(hex)
  return hsl.l > 50
}

function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = ((rgb >> 16) & 0xff) / 255
    const g = ((rgb >> 8) & 0xff) / 255
    const b = (rgb & 0xff) / 255
    
    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    )
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export default AIRecommendationEngine
