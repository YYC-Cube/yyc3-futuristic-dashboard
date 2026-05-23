'use client'

import * as React from 'react'

export interface WallpaperConfig {
  id: string
  name: string
  type: 'time-based' | 'weather-based' | 'holiday' | 'static'
  description: string
  emoji: string
  
  // 时间相关配置
  timeRanges?: {
    dawn: { start: string; end: string }    // 日出 (5:00-7:00)
    morning: { start: string; end: string }  // 上午 (7:00-11:00)
    noon: { start: string; end: string }     // 中午 (11:00-14:00)
    afternoon: { start: string; end: string }// 下午 (14:00-17:00)
    sunset: { start: string; end: string }   // 傍晚 (17:00-19:00)
    evening: { start: string; end: string }  // 晚上 (19:00-22:00)
    night: { start: string; end: string }    // 深夜 (22:00-5:00)
  }
  
  // 每个时间段的配色方案
  colorSchemes: {
    [key: string]: {
      background: string
      gradient?: string
      accentColor: string
      textColor: string
      overlayOpacity: number
      blurAmount: number
    }
  }
  
  // 天气相关配置
  weatherMapping?: {
    sunny: string
    cloudy: string
    rainy: string
    snowy: string
    stormy: string
  }
  
  // 节日特殊配置
  holidays?: Array<{
    date: string
    name: string
    emoji: string
    colors: Record<string, string>
    specialEffects?: string[]
  }>
}

// 预设壁纸配置
export const wallpaperPresets: WallpaperConfig[] = [
  {
    id: 'daily-cycle',
    name: '自然昼夜循环',
    emoji: '🌅',
    type: 'time-based',
    description: '根据真实时间自动切换，模拟日出日落',
    
    timeRanges: {
      dawn: { start: '05:00', end: '07:00' },
      morning: { start: '07:00', end: '11:00' },
      noon: { start: '11:00', end: '14:00' },
      afternoon: { start: '14:00', end: '17:00' },
      sunset: { start: '17:00', end: '19:00' },
      evening: { start: '19:00', end: '22:00' },
      night: { start: '22:00', end: '05:00' },
    },
    
    colorSchemes: {
      dawn: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        accentColor: '#f093fb',
        textColor: '#ffffff',
        overlayOpacity: 0.3,
        blurAmount: 10,
      },
      morning: {
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
        accentColor: '#74ebd5',
        textColor: '#1a202c',
        overlayOpacity: 0.2,
        blurAmount: 8,
      },
      noon: {
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        accentColor: '#667eea',
        textColor: '#2d3748',
        overlayOpacity: 0.15,
        blurAmount: 5,
      },
      afternoon: {
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        accentColor: '#fcb69f',
        textColor: '#744210',
        overlayOpacity: 0.25,
        blurAmount: 8,
      },
      sunset: {
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        accentColor: '#fee140',
        textColor: '#ffffff',
        overlayOpacity: 0.35,
        blurAmount: 12,
      },
      evening: {
        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        accentColor: '#fbc2eb',
        textColor: '#ffffff',
        overlayOpacity: 0.3,
        blurAmount: 10,
      },
      night: {
        background: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 50%, #6b8dd6 100%)',
        accentColor: '#6b8dd6',
        textColor: '#ffffff',
        overlayOpacity: 0.45,
        blurAmount: 15,
      },
    },
  },
  {
    id: 'weather-reactive',
    name: '天气感知壁纸',
    emoji: '🌤️',
    type: 'weather-based',
    description: '根据当地天气自动调整配色和氛围',
    
    weatherMapping: {
      sunny: 'sunny-scheme',
      cloudy: 'cloudy-scheme',
      rainy: 'rainy-scheme',
      snowy: 'snowy-scheme',
      stormy: 'stormy-scheme',
    },
    
    colorSchemes: {
      'sunny-scheme': {
        background: 'linear-gradient(180deg, #87CEEB 0%, #FFD700 80%, #FFA500 100%)',
        accentColor: '#FFD700',
        textColor: '#333333',
        overlayOpacity: 0.2,
        blurAmount: 5,
      },
      'cloudy-scheme': {
        background: 'linear-gradient(180deg, #B0C4DE 0%, #D3D3D3 50%, #A9A9A9 100%)',
        accentColor: '#778899',
        textColor: '#2F4F4F',
        overlayOpacity: 0.35,
        blurAmount: 8,
      },
      'rainy-scheme': {
        background: 'linear-gradient(180deg, #4A5568 0%, #718096 50%, #2D3748 100%)',
        accentColor: '#63B3ED',
        textColor: '#E2E8F0',
        overlayOpacity: 0.5,
        blurAmount: 12,
      },
      'snowy-scheme': {
        background: 'linear-gradient(180deg, #E6E6FA 0%, #FFFFFF 50%, #F0F8FF 100%)',
        accentColor: '#B0C4DE',
        textColor: '#4A5568',
        overlayOpacity: 0.25,
        blurAmount: 6,
      },
      'stormy-scheme': {
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        accentColor: '#e94560',
        textColor: '#ffffff',
        overlayOpacity: 0.65,
        blurAmount: 20,
      },
    },
  },
  {
    id: 'holiday-special',
    name: '节日庆典模式',
    emoji: '🎉',
    type: 'holiday',
    description: '在特殊日期自动切换节日主题',
    
    holidays: [
      {
        date: '01-01',
        name: '元旦',
        emoji: '🎆',
        colors: {
          background: 'linear-gradient(135deg, #ff0000 0%, #ffd700 50%, #ff0000 100%)',
          accentColor: '#ffd700',
          textColor: '#ffffff',
        },
        specialEffects: ['fireworks', 'sparkles'],
      },
      {
        date: '02-14',
        name: '情人节',
        emoji: '💕',
        colors: {
          background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 50%, #db7093 100%)',
          accentColor: '#ff1493',
          textColor: '#ffffff',
        },
        specialEffects: ['hearts', 'float'],
      },
      {
        date: '03-08',
        name: '妇女节',
        emoji: '💐',
        colors: {
          background: 'linear-gradient(135deg, #ff69b4 0%, #dda0dd 50%, #da70d6 100%)',
          accentColor: '#da70d6',
          textColor: '#ffffff',
        },
      },
      {
        date: '05-01',
        name: '劳动节',
        emoji: '👷',
        colors: {
          background: 'linear-gradient(135deg, #ff4500 0%, #ffa500 50%, #ffd700 100%)',
          accentColor: '#ffa500',
          textColor: '#ffffff',
        },
      },
      {
        date: '06-01',
        name: '儿童节',
        emoji: '🎈',
        colors: {
          background: 'linear-gradient(135deg, #00ced1 0%, #ff69b4 50%, #98fb98 100%)',
          accentColor: '#ff69b4',
          textColor: '#ffffff',
        },
        specialEffects: ['balloons', 'confetti'],
      },
      {
        date: '10-01',
        name: '国庆节',
        emoji: '🇨🇳',
        colors: {
          background: 'linear-gradient(135deg, #de2910 0%, #ffde00 30%, #de2910 70%, #ffde00 100%)',
          accentColor: '#ffde00',
          textColor: '#ffffff',
        },
        specialEffects: ['stars', 'glow'],
      },
      {
        date: '12-24',
        name: '平安夜',
        emoji: '🎄',
        colors: {
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a27 50%, #c41e3a 100%)',
          accentColor: '#c41e3a',
          textColor: '#ffffff',
        },
        specialEffects: ['snowflakes', 'lights'],
      },
      {
        date: '12-25',
        name: '圣诞节',
        emoji: '🎅',
        colors: {
          background: 'linear-gradient(135deg, #c41e3a 0%, #228b22 50%, #ffd700 100%)',
          accentColor: '#228b22',
          textColor: '#ffffff',
        },
        specialEffects: ['gifts', 'music'],
      },
    ],
    
    colorSchemes: {
      default: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        accentColor: '#764ba2',
        textColor: '#ffffff',
        overlayOpacity: 0.3,
        blurAmount: 10,
      },
    },
  },
]

interface DynamicWallpaperProps {
  presetId?: string
  enabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function DynamicWallpaper({ 
  presetId = 'daily-cycle', 
  enabled = true,
  className,
  children 
}: DynamicWallpaperProps) {
  const [currentTimeScheme, setCurrentTimeScheme] = React.useState<string>('noon')
  const [currentWeather, setCurrentWeather] = React.useState<string>('sunny')
  const [todayHoliday, setTodayHoliday] = React.useState<{
    date: string
    name: string
    emoji: string
    colors: Record<string, string>
    specialEffects?: string[]
  } | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const preset = wallpaperPresets.find(p => p.id === presetId) || wallpaperPresets[0]

  React.useEffect(() => {
    if (!enabled) return

    const updateTimeBasedScheme = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      if (!preset.timeRanges) return

      let schemeKey = 'night'
      
      for (const [key, range] of Object.entries(preset.timeRanges)) {
        if (currentTime >= range.start && currentTime <= range.end) {
          schemeKey = key
          break
        }
      }

      setCurrentTimeScheme(schemeKey)
    }

    const checkHoliday = () => {
      if (!preset.holidays) return

      const today = new Date()
      const monthDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
      
      const holiday = preset.holidays.find(h => h.date === monthDay)
      setTodayHoliday(holiday || null)
    }

    const fetchWeather = async () => {
      try {
        // 模拟天气API调用（实际项目中应接入真实天气服务）
        const weatherConditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy']
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
        
        // 在实际应用中，这里应该调用天气API：
        // const response = await fetch(`https://api.weather.com/v1/current?location=auto`)
        // const data = await response.json()
        // setCurrentWeather(data.condition)
        
        setCurrentWeather(randomWeather)
      } catch (error) {
        console.warn('Weather fetch failed:', error)
        setCurrentWeather('sunny')
      }
    }

    // 初始化
    setIsLoading(true)
    updateTimeBasedScheme()
    checkHoliday()
    fetchWeather()
    setIsLoading(false)

    // 每分钟更新一次时间方案
    const timeInterval = setInterval(updateTimeBasedScheme, 60000)
    
    // 每30分钟更新一次天气
    const weatherInterval = setInterval(fetchWeather, 1800000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
    }
  }, [presetId, enabled, preset])

  if (!enabled || isLoading) {
    return <div className={className}>{children}</div>
  }

  // 确定当前使用的配色方案
  let activeScheme = preset.colorSchemes[currentTimeScheme] || preset.colorSchemes.default

  // 如果是节日且存在节日配色，优先使用节日配色
  if (preset.type === 'holiday' && todayHoliday?.colors) {
    activeScheme = {
      ...activeScheme,
      ...todayHoliday.colors,
    }
  }

  // 如果是天气类型，使用天气映射的方案
  if (preset.type === 'weather-based' && preset.weatherMapping) {
    const weatherSchemeKey = (preset.weatherMapping as Record<string, string>)[currentWeather]
    if (weatherSchemeKey && preset.colorSchemes[weatherSchemeKey]) {
      activeScheme = preset.colorSchemes[weatherSchemeKey]
    }
  }

  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* 动态背景 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: activeScheme.background,
          transition: 'background 1s ease-in-out',
          zIndex: -2,
        }}
      />
      
      {/* 背景模糊层 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: `blur(${activeScheme.blurAmount}px)`,
          WebkitBackdropFilter: `blur(${activeScheme.blurAmount}px)`,
          backgroundColor: `rgba(255, 255, 255, ${activeScheme.overlayOpacity})`,
          transition: 'all 1s ease-in-out',
          zIndex: -1,
        }}
      />

      {/* 内容区域 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          color: activeScheme.textColor,
          minHeight: '100vh',
        }}
      >
        {children}
      </div>

      {/* 状态指示器 */}
      <DynamicWallpaperIndicator 
        scheme={currentTimeScheme}
        weather={currentWeather}
        holiday={todayHoliday}
        preset={preset}
      />
    </div>
  )
}

function DynamicWallpaperIndicator({
  scheme,
  weather,
  holiday,
  preset
}: {
  scheme: string
  weather: string
  holiday: {
    date: string
    name: string
    emoji: string
    colors: Record<string, string>
    specialEffects?: string[]
  } | null
  preset: WallpaperConfig
}) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* 时间段指示 */}
      <div className="px-3 py-2 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span>⏰</span>
          <span>{getTimePeriodLabel(scheme)}</span>
        </div>
        
        {preset.type === 'weather-based' && (
          <div className="flex items-center gap-2">
            <span>🌤️</span>
            <span>{getWeatherLabel(weather)}</span>
          </div>
        )}
        
        {holiday && (
          <div className="flex items-center gap-2 animate-pulse">
            <span>{holiday.emoji}</span>
            <span className="font-semibold">{holiday.name}</span>
          </div>
        )}
      </div>

      {/* 切换按钮提示 */}
      <button
        onClick={() => setIsVisible(false)}
        className="w-full px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white/70 transition-colors"
      >
        隐藏
      </button>
    </div>
  )
}

function getTimePeriodLabel(scheme: string): string {
  const labels: Record<string, string> = {
    dawn: '🌅 日出',
    morning: '☀️ 上午',
    noon: '🌞 中午',
    afternoon: '⛅ 下午',
    sunset: '🌇 傍晚',
    evening: '🌆 晚上',
    night: '🌙 深夜',
  }
  return labels[scheme] || scheme
}

function getWeatherLabel(weather: string): string {
  const labels: Record<string, string> = {
    sunny: '☀️ 晴天',
    cloudy: '☁️ 多云',
    rainy: '🌧️ 下雨',
    snowy: '❄️ 下雪',
    stormy: '⛈️ 暴风雨',
  }
  return labels[weather] || weather
}

export default DynamicWallpaper
