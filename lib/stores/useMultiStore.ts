'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import logger from '../logger'

export interface StoreLocation {
  address: string
  city: string
  province: string
  postalCode: string
  latitude?: number
  longitude?: number
}

export interface StoreBusinessHours {
  open: string
  close: string
  isOpen24Hours: boolean
  specialHours?: Array<{
    date: string
    open: string
    close: string
    reason: string
  }>
}

export interface StoreContact {
  phone: string
  email: string
  managerName: string
  emergencyContact?: string
}

export interface StoreConfig {
  currency: string
  timezone: string
  taxRate: number
  serviceChargeRate: number
  roomTypes: Array<{
    id: string
    name: string
    capacity: number
    basePrice: number
  }>
  features: string[]
}

export interface StoreStats {
  totalRooms: number
  availableRooms: number
  occupiedRooms: number
  todayRevenue: number
  monthRevenue: number
  todayOrders: number
  memberCount: number
  rating: number
  lastUpdated: string
}

export interface Store {
  id: string
  name: string
  nameEn: string
  code: string
  logo?: string
  description: string
  status: 'active' | 'inactive' | 'maintenance' | 'pending'
  location: StoreLocation
  businessHours: StoreBusinessHours
  contact: StoreContact
  config: StoreConfig
  stats: StoreStats
  createdAt: string
  updatedAt: string
  tags: string[]
  isDefault: boolean
  isHeadquarters: boolean
}

const EMPTY_STORES: Store[] = []

interface MultiStoreState {
  stores: Store[]
  activeStoreId: string | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

interface MultiStoreActions {
  fetchStores: () => Promise<void>
  setActiveStore: (storeId: string) => void
  addStore: (storeData: Omit<Store, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => Promise<Store>
  updateStore: (storeId: string, updates: Partial<Store>) => Promise<void>
  deleteStore: (storeId: string) => Promise<void>
  toggleStoreStatus: (storeId: string) => Promise<void>
  refreshStoreStats: (storeId: string) => Promise<void>
  
  getActiveStore: () => Store | null
  getActiveStoreSafe: () => Store | null
  getStoreById: (id: string) => Store | undefined
  getStoresByStatus: (status: Store['status']) => Store[]
  getActiveStores: () => Store[]
  getDefaultStore: () => Store | undefined
  
  clearError: () => void
  reset: () => void
}

type MultiStoreStore = MultiStoreState & MultiStoreActions

const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export const useMultiStoreStore = create<MultiStoreStore>()(
  devtools(
    (set, get) => ({
      stores: EMPTY_STORES,
      activeStoreId: null,
      loading: false,
      error: null,
      lastFetched: null,

      fetchStores: async () => {
        const now = Date.now()
        const { lastFetched, loading } = get()
        if (loading) return
        if (lastFetched && now - lastFetched < STALE_TIME) return

        set({ loading: true, error: null })
        try {
          // TODO: Replace with actual API call
          // const response = await storeService.getStores()
          // set({ stores: response.data ?? EMPTY_STORES, loading: false, lastFetched: now })
          
          // Mock data for development
          await new Promise(resolve => setTimeout(resolve, 500))
          logger.info('MultiStore', 'Stores fetched successfully')
          set({ 
            stores: getMockStores(), 
            loading: false, 
            lastFetched: now 
          })
        } catch (err) {
          logger.error('MultiStore', 'Fetch stores failed', err)
          set({ 
            error: "获取门店列表失败", 
            loading: false,
            stores: EMPTY_STORES,
          })
        }
      },

      setActiveStore: (storeId: string) => {
        const store = get().getStoreById(storeId)
        if (!store) {
          console.warn(`⚠️ [MultiStore] Store ${storeId} not found`)
          return
        }
        
        try {
          localStorage.setItem('active-store-id', storeId)
          set({ activeStoreId: storeId })
          logger.info('MultiStore', `Active store changed to: ${store.name}`)
        } catch (storageError) {
          console.warn('⚠️ [MultiStore] localStorage write failed:', storageError)
          set({ activeStoreId: storeId })
        }
      },

      addStore: async (storeData): Promise<Store> => {
        set({ loading: true, error: null })
        try {
          const newStore: Store = {
            ...storeData,
            id: `store-${Date.now()}`,
            stats: {
              totalRooms: 0,
              availableRooms: 0,
              occupiedRooms: 0,
              todayRevenue: 0,
              monthRevenue: 0,
              todayOrders: 0,
              memberCount: 0,
              rating: 0,
              lastUpdated: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          set(state => ({
            stores: [...state.stores, newStore],
            loading: false,
          }))

          logger.info('MultiStore', `Store created: ${newStore.name}`)
          return newStore
        } catch (err) {
          logger.error('MultiStore', 'Create store failed', err)
          set({ error: "创建门店失败", loading: false })
          throw err
        }
      },

      updateStore: async (storeId: string, updates: Partial<Store>) => {
        set({ loading: true, error: null })
        try {
          set(state => ({
            stores: state.stores.map(store =>
              store.id === storeId
                ? { ...store, ...updates, updatedAt: new Date().toISOString() }
                : store
            ),
            loading: false,
          }))
          logger.info('MultiStore', `Store updated: ${storeId}`)
        } catch (err) {
          logger.error('MultiStore', 'Update store failed', err)
          set({ error: "更新门店失败", loading: false })
          throw err
        }
      },

      deleteStore: async (storeId: string) => {
        set({ loading: true, error: null })
        try {
          set(state => ({
            stores: state.stores.filter(store => store.id !== storeId),
            activeStoreId: state.activeStoreId === storeId ? null : state.activeStoreId,
            loading: false,
          }))
          logger.info('MultiStore', `Store deleted: ${storeId}`)
        } catch (err) {
          logger.error('MultiStore', 'Delete store failed', err)
          set({ error: "删除门店失败", loading: false })
          throw err
        }
      },

      toggleStoreStatus: async (storeId: string) => {
        const store = get().getStoreById(storeId)
        if (!store) return

        const newStatus: Store['status'] = 
          store.status === 'active' ? 'inactive' : 'active'

        await get().updateStore(storeId, { status: newStatus })
        logger.info('MultiStore', `Store ${storeId} status toggled to: ${newStatus}`)
      },

      refreshStoreStats: async (storeId: string) => {
        try {
          // TODO: Replace with actual API call
          // const stats = await storeService.getStoreStats(storeId)
          
          const mockStats: StoreStats = {
            totalRooms: Math.floor(Math.random() * 50) + 10,
            availableRooms: Math.floor(Math.random() * 20),
            occupiedRooms: Math.floor(Math.random() * 30),
            todayRevenue: Math.floor(Math.random() * 50000) + 10000,
            monthRevenue: Math.floor(Math.random() * 500000) + 100000,
            todayOrders: Math.floor(Math.random() * 200) + 50,
            memberCount: Math.floor(Math.random() * 1000) + 100,
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            lastUpdated: new Date().toISOString(),
          }

          set(state => ({
            stores: state.stores.map(store =>
              store.id === storeId
                ? { ...store, stats: mockStats }
                : store
            ),
          }))

          logger.info('MultiStore', `Stats refreshed for store: ${storeId}`)
        } catch (err) {
          logger.error('MultiStore', 'Refresh stats failed', err)
        }
      },

      getActiveStore: () => {
        const { stores, activeStoreId } = get()
        return stores.find(store => store.id === activeStoreId) ?? null
      },

      getActiveStoreSafe: () => {
        try {
          const { stores, activeStoreId } = get()
          return stores.find(store => store.id === activeStoreId) ?? null
        } catch (err) {
          logger.error('MultiStore', 'getActiveStoreSafe failed', err)
          return null
        }
      },

      getStoreById: (id: string) => {
        return (get().stores ?? EMPTY_STORES).find(store => store.id === id)
      },

      getStoresByStatus: (status: Store['status']) => {
        return (get().stores ?? EMPTY_STORES).filter(store => store.status === status)
      },

      getActiveStores: () => {
        return (get().stores ?? EMPTY_STORES).filter(store => store.status === 'active')
      },

      getDefaultStore: () => {
        return (get().stores ?? EMPTY_STORES).find(store => store.isDefault)
      },

      clearError: () => set({ error: null }),

      reset: () => {
        try {
          localStorage.removeItem('active-store-id')
        } catch (storageError) {
          console.warn('⚠️ [MultiStore] localStorage remove failed:', storageError)
        }
        set({
          stores: EMPTY_STORES,
          activeStoreId: null,
          loading: false,
          error: null,
          lastFetched: null,
        })
      },
    }),
    { name: 'MultiStoreStore' }
  )
)

function getMockStores(): Store[] {
  return [
    {
      id: 'store-001',
      name: 'YYC3 智慧KTV 总店',
      nameEn: 'YYC3 Smart KTV Headquarters',
      code: 'HQ',
      description: '位于市中心的旗舰店，配备最先进的音响系统和智能管理系统',
      status: 'active',
      isDefault: true,
      isHeadquarters: true,
      logo: '/yyc3-logo.png',
      tags: ['旗舰', '智能', '高端'],
      location: {
        address: '科技大道888号',
        city: '深圳',
        province: '广东',
        postalCode: '518000',
        latitude: 22.5431,
        longitude: 114.0579,
      },
      businessHours: {
        open: '12:00',
        close: '06:00',
        isOpen24Hours: false,
      },
      contact: {
        phone: '0755-8888-8888',
        email: 'hq@yyc3.com',
        managerName: '张经理',
        emergencyContact: '138-0000-0001',
      },
      config: {
        currency: 'CNY',
        timezone: 'Asia/Shanghai',
        taxRate: 0.06,
        serviceChargeRate: 0.1,
        roomTypes: [
          { id: 'small', name: '小包', capacity: 6, basePrice: 188 },
          { id: 'medium', name: '中包', capacity: 10, basePrice: 288 },
          { id: 'large', name: '大包', capacity: 15, basePrice: 388 },
          { id: 'vip', name: 'VIP包', capacity: 20, basePrice: 688 },
        ],
        features: ['AI推荐', '智能灯光', '语音控制', '实时监控'],
      },
      stats: {
        totalRooms: 45,
        availableRooms: 18,
        occupiedRooms: 22,
        todayRevenue: 125800,
        monthRevenue: 3856000,
        todayOrders: 156,
        memberCount: 2340,
        rating: 4.8,
        lastUpdated: new Date().toISOString(),
      },
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2026-05-23T09:30:00Z',
    },
    {
      id: 'store-002',
      name: 'YYC3 科技园分店',
      nameEn: 'YYC3 Science Park Branch',
      code: 'SP',
      description: '面向年轻群体的时尚KTV，主打科技感和社交体验',
      status: 'active',
      isDefault: false,
      isHeadquarters: false,
      tags: ['时尚', '年轻', '科技'],
      location: {
        address: '高新南一道666号',
        city: '深圳',
        province: '广东',
        postalCode: '518057',
        latitude: 22.5327,
        longitude: 113.9345,
      },
      businessHours: {
        open: '13:00',
        close: '05:00',
        isOpen24Hours: false,
      },
      contact: {
        phone: '0755-6666-6666',
        email: 'sciencepark@yyc3.com',
        managerName: '李经理',
      },
      config: {
        currency: 'CNY',
        timezone: 'Asia/Shanghai',
        taxRate: 0.06,
        serviceChargeRate: 0.1,
        roomTypes: [
          { id: 'small', name: '小包', capacity: 4, basePrice: 158 },
          { id: 'medium', name: '中包', capacity: 8, basePrice: 258 },
          { id: 'large', name: '大包', capacity: 12, basePrice: 358 },
        ],
        features: ['AR互动', '游戏模式', '直播功能'],
      },
      stats: {
        totalRooms: 30,
        availableRooms: 12,
        occupiedRooms: 15,
        todayRevenue: 68500,
        monthRevenue: 1980000,
        todayOrders: 89,
        memberCount: 1580,
        rating: 4.6,
        lastUpdated: new Date().toISOString(),
      },
      createdAt: '2024-06-20T10:00:00Z',
      updatedAt: '2026-05-23T08:45:00Z',
    },
    {
      id: 'store-003',
      name: 'YYC3 广州天河店',
      nameEn: 'YYC3 Guangzhou Tianhe Branch',
      code: 'GZ',
      description: '广州核心商圈的高端娱乐场所',
      status: 'maintenance',
      isDefault: false,
      isHeadquarters: false,
      tags: ['高端', '商务', '装修升级中'],
      location: {
        address: '天河路385号太古汇',
        city: '广州',
        province: '广东',
        postalCode: '510620',
        latitude: 23.1291,
        longitude: 113.3265,
      },
      businessHours: {
        open: '14:00',
        close: '04:00',
        isOpen24Hours: false,
      },
      contact: {
        phone: '020-8888-9999',
        email: 'tianhe@yyc3.com',
        managerName: '王经理',
      },
      config: {
        currency: 'CNY',
        timezone: 'Asia/Shanghai',
        taxRate: 0.06,
        serviceChargeRate: 0.1,
        roomTypes: [
          { id: 'luxury', name: '豪华房', capacity: 25, basePrice: 1288 },
          { id: 'vip', name: 'VIP房', capacity: 18, basePrice: 888 },
          { id: 'standard', name: '标准房', capacity: 12, basePrice: 488 },
        ],
        features: ['私人管家', '定制服务', '高端音响'],
      },
      stats: {
        totalRooms: 25,
        availableRooms: 0,
        occupiedRooms: 0,
        todayRevenue: 0,
        monthRevenue: 0,
        todayOrders: 0,
        memberCount: 890,
        rating: 4.9,
        lastUpdated: new Date().toISOString(),
      },
      createdAt: '2025-03-10T12:00:00Z',
      updatedAt: '2026-05-20T16:20:00Z',
    },
  ]
}

export type { MultiStoreState, MultiStoreActions }
