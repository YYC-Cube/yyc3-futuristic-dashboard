/**
 * 多行业适配系统
 * 支持不同行业的定制化配置和指标
 */

export type IndustryType =
  | "smart-city"
  | "data-center"
  | "manufacturing"
  | "finance"
  | "healthcare"
  | "energy"
  | "retail"
  | "logistics"

export interface IndustryConfig {
  id: IndustryType
  name: string
  icon: string
  description: string
  primaryColor: string
  metrics: IndustryMetric[]
  dashboardLayout: DashboardLayout
  aiModels: AIModelConfig[]
}

export interface IndustryMetric {
  id: string
  name: string
  unit: string
  normalRange: [number, number]
  criticalThreshold: number
  icon: string
  category: "performance" | "security" | "business" | "operations"
}

export interface DashboardLayout {
  widgets: WidgetConfig[]
  refreshInterval: number
  alertPriority: string[]
}

export interface WidgetConfig {
  id: string
  type: "chart" | "metric" | "alert" | "ai-insight" | "map"
  position: { x: number; y: number; w: number; h: number }
  config: Record<string, any>
}

export interface AIModelConfig {
  id: string
  name: string
  type: "prediction" | "anomaly" | "optimization" | "classification"
  enabled: boolean
  parameters: Record<string, any>
}

/**
 * 行业配置库
 */
export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  "smart-city": {
    id: "smart-city",
    name: "智慧城市",
    icon: "Building2",
    description: "城市基础设施监控与管理",
    primaryColor: "cyan",
    metrics: [
      {
        id: "traffic-flow",
        name: "交通流量",
        unit: "车辆/小时",
        normalRange: [1000, 5000],
        criticalThreshold: 8000,
        icon: "Car",
        category: "operations",
      },
      {
        id: "air-quality",
        name: "空气质量指数",
        unit: "AQI",
        normalRange: [0, 100],
        criticalThreshold: 200,
        icon: "Wind",
        category: "operations",
      },
      {
        id: "energy-consumption",
        name: "能源消耗",
        unit: "MW",
        normalRange: [500, 2000],
        criticalThreshold: 3000,
        icon: "Zap",
        category: "operations",
      },
      {
        id: "public-safety",
        name: "公共安全指数",
        unit: "%",
        normalRange: [85, 100],
        criticalThreshold: 70,
        icon: "Shield",
        category: "security",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 5000,
      alertPriority: ["security", "operations", "performance"],
    },
    aiModels: [
      {
        id: "traffic-prediction",
        name: "交通流量预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 60, confidence: 0.85 },
      },
      {
        id: "incident-detection",
        name: "事件异常检测",
        type: "anomaly",
        enabled: true,
        parameters: { sensitivity: 0.8 },
      },
    ],
  },
  "data-center": {
    id: "data-center",
    name: "数据中心",
    icon: "Server",
    description: "服务器集群与云资源管理",
    primaryColor: "blue",
    metrics: [
      {
        id: "server-load",
        name: "服务器负载",
        unit: "%",
        normalRange: [20, 70],
        criticalThreshold: 90,
        icon: "Server",
        category: "performance",
      },
      {
        id: "network-throughput",
        name: "网络吞吐量",
        unit: "Gbps",
        normalRange: [10, 50],
        criticalThreshold: 80,
        icon: "Network",
        category: "performance",
      },
      {
        id: "storage-usage",
        name: "存储使用率",
        unit: "%",
        normalRange: [40, 80],
        criticalThreshold: 95,
        icon: "HardDrive",
        category: "operations",
      },
      {
        id: "cooling-efficiency",
        name: "制冷效率",
        unit: "PUE",
        normalRange: [1.2, 1.5],
        criticalThreshold: 2.0,
        icon: "Thermometer",
        category: "operations",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 3000,
      alertPriority: ["performance", "security", "operations"],
    },
    aiModels: [
      {
        id: "capacity-planning",
        name: "容量规划预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 168, confidence: 0.9 },
      },
      {
        id: "failure-prediction",
        name: "故障预测",
        type: "anomaly",
        enabled: true,
        parameters: { sensitivity: 0.9 },
      },
    ],
  },
  manufacturing: {
    id: "manufacturing",
    name: "智能制造",
    icon: "Factory",
    description: "生产线监控与质量管理",
    primaryColor: "orange",
    metrics: [
      {
        id: "production-rate",
        name: "生产速率",
        unit: "件/小时",
        normalRange: [100, 500],
        criticalThreshold: 50,
        icon: "Package",
        category: "business",
      },
      {
        id: "quality-rate",
        name: "良品率",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 90,
        icon: "CheckCircle",
        category: "business",
      },
      {
        id: "equipment-efficiency",
        name: "设备综合效率",
        unit: "%",
        normalRange: [75, 95],
        criticalThreshold: 60,
        icon: "Gauge",
        category: "performance",
      },
      {
        id: "energy-per-unit",
        name: "单位能耗",
        unit: "kWh/件",
        normalRange: [0.5, 2.0],
        criticalThreshold: 3.0,
        icon: "Zap",
        category: "operations",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 2000,
      alertPriority: ["business", "performance", "operations"],
    },
    aiModels: [
      {
        id: "quality-prediction",
        name: "质量预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 24, confidence: 0.88 },
      },
      {
        id: "maintenance-optimization",
        name: "维护优化",
        type: "optimization",
        enabled: true,
        parameters: { strategy: "predictive" },
      },
    ],
  },
  finance: {
    id: "finance",
    name: "金融科技",
    icon: "DollarSign",
    description: "交易监控与风险管理",
    primaryColor: "green",
    metrics: [
      {
        id: "transaction-volume",
        name: "交易量",
        unit: "笔/秒",
        normalRange: [100, 1000],
        criticalThreshold: 2000,
        icon: "TrendingUp",
        category: "business",
      },
      {
        id: "fraud-score",
        name: "欺诈风险评分",
        unit: "分",
        normalRange: [0, 30],
        criticalThreshold: 70,
        icon: "AlertTriangle",
        category: "security",
      },
      {
        id: "system-latency",
        name: "系统延迟",
        unit: "ms",
        normalRange: [10, 50],
        criticalThreshold: 200,
        icon: "Clock",
        category: "performance",
      },
      {
        id: "compliance-score",
        name: "合规评分",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 85,
        icon: "Shield",
        category: "security",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 1000,
      alertPriority: ["security", "business", "performance"],
    },
    aiModels: [
      {
        id: "fraud-detection",
        name: "欺诈检测",
        type: "classification",
        enabled: true,
        parameters: { threshold: 0.85, realtime: true },
      },
      {
        id: "risk-assessment",
        name: "风险评估",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 1, confidence: 0.92 },
      },
    ],
  },
  healthcare: {
    id: "healthcare",
    name: "医疗健康",
    icon: "Heart",
    description: "医疗设备与患者监控",
    primaryColor: "red",
    metrics: [
      {
        id: "patient-monitoring",
        name: "患者监护数",
        unit: "人",
        normalRange: [50, 200],
        criticalThreshold: 300,
        icon: "Users",
        category: "operations",
      },
      {
        id: "equipment-status",
        name: "设备在线率",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 90,
        icon: "Activity",
        category: "performance",
      },
      {
        id: "emergency-response",
        name: "应急响应时间",
        unit: "分钟",
        normalRange: [1, 5],
        criticalThreshold: 10,
        icon: "AlertCircle",
        category: "operations",
      },
      {
        id: "data-security",
        name: "数据安全等级",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 85,
        icon: "Lock",
        category: "security",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 5000,
      alertPriority: ["operations", "security", "performance"],
    },
    aiModels: [
      {
        id: "patient-risk",
        name: "患者风险预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 24, confidence: 0.9 },
      },
      {
        id: "resource-optimization",
        name: "资源优化",
        type: "optimization",
        enabled: true,
        parameters: { strategy: "dynamic" },
      },
    ],
  },
  energy: {
    id: "energy",
    name: "能源管理",
    icon: "Zap",
    description: "电力系统与能源优化",
    primaryColor: "yellow",
    metrics: [
      {
        id: "power-generation",
        name: "发电量",
        unit: "MW",
        normalRange: [500, 2000],
        criticalThreshold: 3000,
        icon: "Zap",
        category: "business",
      },
      {
        id: "grid-stability",
        name: "电网稳定性",
        unit: "%",
        normalRange: [95, 100],
        criticalThreshold: 85,
        icon: "Activity",
        category: "performance",
      },
      {
        id: "renewable-ratio",
        name: "可再生能源占比",
        unit: "%",
        normalRange: [30, 70],
        criticalThreshold: 20,
        icon: "Leaf",
        category: "business",
      },
      {
        id: "transmission-loss",
        name: "传输损耗",
        unit: "%",
        normalRange: [2, 5],
        criticalThreshold: 10,
        icon: "TrendingDown",
        category: "operations",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 3000,
      alertPriority: ["performance", "business", "operations"],
    },
    aiModels: [
      {
        id: "demand-forecasting",
        name: "需求预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 72, confidence: 0.87 },
      },
      {
        id: "load-balancing",
        name: "负载均衡优化",
        type: "optimization",
        enabled: true,
        parameters: { strategy: "realtime" },
      },
    ],
  },
  retail: {
    id: "retail",
    name: "智慧零售",
    icon: "ShoppingCart",
    description: "零售运营与客户分析",
    primaryColor: "purple",
    metrics: [
      {
        id: "customer-flow",
        name: "客流量",
        unit: "人/小时",
        normalRange: [100, 500],
        criticalThreshold: 1000,
        icon: "Users",
        category: "business",
      },
      {
        id: "conversion-rate",
        name: "转化率",
        unit: "%",
        normalRange: [15, 35],
        criticalThreshold: 10,
        icon: "TrendingUp",
        category: "business",
      },
      {
        id: "inventory-turnover",
        name: "库存周转率",
        unit: "次/月",
        normalRange: [4, 12],
        criticalThreshold: 2,
        icon: "Package",
        category: "operations",
      },
      {
        id: "customer-satisfaction",
        name: "客户满意度",
        unit: "%",
        normalRange: [85, 100],
        criticalThreshold: 70,
        icon: "Star",
        category: "business",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 10000,
      alertPriority: ["business", "operations", "performance"],
    },
    aiModels: [
      {
        id: "sales-prediction",
        name: "销售预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 168, confidence: 0.85 },
      },
      {
        id: "customer-segmentation",
        name: "客户分群",
        type: "classification",
        enabled: true,
        parameters: { clusters: 5 },
      },
    ],
  },
  logistics: {
    id: "logistics",
    name: "智慧物流",
    icon: "Truck",
    description: "物流运输与仓储管理",
    primaryColor: "indigo",
    metrics: [
      {
        id: "delivery-rate",
        name: "准时送达率",
        unit: "%",
        normalRange: [90, 100],
        criticalThreshold: 80,
        icon: "CheckCircle",
        category: "business",
      },
      {
        id: "vehicle-utilization",
        name: "车辆利用率",
        unit: "%",
        normalRange: [70, 90],
        criticalThreshold: 50,
        icon: "Truck",
        category: "operations",
      },
      {
        id: "warehouse-efficiency",
        name: "仓储效率",
        unit: "%",
        normalRange: [80, 95],
        criticalThreshold: 65,
        icon: "Warehouse",
        category: "performance",
      },
      {
        id: "cost-per-delivery",
        name: "单次配送成本",
        unit: "元",
        normalRange: [10, 30],
        criticalThreshold: 50,
        icon: "DollarSign",
        category: "business",
      },
    ],
    dashboardLayout: {
      widgets: [],
      refreshInterval: 5000,
      alertPriority: ["business", "operations", "performance"],
    },
    aiModels: [
      {
        id: "route-optimization",
        name: "路线优化",
        type: "optimization",
        enabled: true,
        parameters: { algorithm: "genetic", realtime: true },
      },
      {
        id: "demand-prediction",
        name: "需求预测",
        type: "prediction",
        enabled: true,
        parameters: { horizon: 72, confidence: 0.88 },
      },
    ],
  },
}

/**
 * 获取行业配置
 */
export function getIndustryConfig(industry: IndustryType): IndustryConfig {
  return INDUSTRY_CONFIGS[industry]
}

/**
 * 获取所有行业列表
 */
export function getAllIndustries(): IndustryConfig[] {
  return Object.values(INDUSTRY_CONFIGS)
}

/**
 * 根据行业生成定制化指标
 */
export function generateIndustryMetrics(industry: IndustryType): Record<string, number> {
  const config = getIndustryConfig(industry)
  const metrics: Record<string, number> = {}

  config.metrics.forEach((metric) => {
    const [min, max] = metric.normalRange
    const value = Math.floor(Math.random() * (max - min) + min)
    metrics[metric.id] = value
  })

  return metrics
}
