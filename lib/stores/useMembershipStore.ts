'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import logger from '../logger'

export interface MemberTier {
  id: string
  name: string
  nameEn: string
  icon: string
  minPoints: number
  maxPoints?: number
  discountRate: number
  benefits: string[]
  color: string
}

export interface PointsRule {
  id: string
  type: 'consumption' | 'checkin' | 'referral' | 'birthday' | 'review' | 'activity'
  name: string
  description: string
  pointsPerUnit: number
  maxPointsPerDay?: number
  isActive: boolean
  multiplier?: number
  validFrom: string
  validTo?: string
}

export interface PointsTransaction {
  id: string
  memberId: string
  type: 'earn' | 'redeem' | 'expire' | 'adjust'
  points: number
  balanceAfter: number
  ruleId?: string
  orderId?: string
  description: string
  createdAt: string
  expiresAt?: string
  metadata?: Record<string, unknown>
}

export interface Member {
  id: string
  storeId: string
  phone: string
  name: string
  avatar?: string
  gender?: 'male' | 'female'
  birthday?: string
  tierId: string
  points: number
  totalPointsEarned: number
  totalSpent: number
  visitCount: number
  lastVisitAt: string
  status: 'active' | 'inactive' | 'blacklisted'
  preferences: {
    favoriteRoomType?: string
    favoriteSongs?: string[]
    dietaryRestrictions?: string[]
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface RedemptionItem {
  id: string
  name: string
  description: string
  pointsCost: number
  category: 'room_discount' | 'product' | 'service' | 'gift' | 'voucher'
  value: number
  stock?: number
  isActive: boolean
  imageUrl?: string
  validFrom: string
  validTo?: string
  memberTierIds?: string[]
}

const EMPTY_MEMBERS: Member[] = []
const EMPTY_TRANSACTIONS: PointsTransaction[] = []
const EMPTY_REDEMPTIONS: RedemptionItem[] = []

interface MembershipState {
  members: Member[]
  transactions: PointsTransaction[]
  redemptionItems: RedemptionItem[]
  tiers: MemberTier[]
  rules: PointsRule[]
  
  selectedMember: Member | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

interface MembershipActions {
  fetchMembers: () => Promise<void>
  fetchMemberById: (memberId: string) => Promise<void>
  addMember: (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Member>
  updateMember: (memberId: string, updates: Partial<Member>) => Promise<void>
  deleteMember: (memberId: string) => Promise<void>
  upgradeMemberTier: (memberId: string, newTierId: string) => void
  
  addPoints: (memberId: string, points: number, type: PointsTransaction['type'], description: string, metadata?: Partial<PointsTransaction>) => Promise<void>
  redeemPoints: (memberId: string, itemId: string) => Promise<boolean>
  getTransactionsByMember: (memberId: string) => PointsTransaction[]
  
  calculateTierProgress: (member: Member) => { current: MemberTier; next: MemberTier | null; progress: number }
  getMembersByTier: (tierId: string) => Member[]
  getTopMembers: (limit?: number) => Member[]
  getExpiringPoints: (daysThreshold?: number) => PointsTransaction[]
  
  getMembersSafe: () => Member[]
  getMemberCount: () => number
  getActiveMemberCount: () => number
  
  setSelectedMember: (member: Member | null) => void
  clearError: () => void
  reset: () => void
}

type MembershipStore = MembershipState & MembershipActions

const STALE_TIME = 3 * 60 * 1000 // 3 minutes

export const useMembershipStore = create<MembershipStore>()(
  devtools(
    (set, get) => ({
      members: EMPTY_MEMBERS,
      transactions: EMPTY_TRANSACTIONS,
      redemptionItems: EMPTY_REDEMPTIONS,
      tiers: getDefaultTiers(),
      rules: getDefaultRules(),
      
      selectedMember: null,
      loading: false,
      error: null,
      lastFetched: null,

      fetchMembers: async () => {
        const now = Date.now()
        const { lastFetched, loading } = get()
        if (loading) return
        if (lastFetched && now - lastFetched < STALE_TIME) return

        set({ loading: true, error: null })
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 600))
          logger.info('Membership', 'Members fetched successfully')
          set({ 
            members: getMockMembers(),
            transactions: getMockTransactions(),
            redemptionItems: getMockRedemptionItems(),
            loading: false, 
            lastFetched: now 
          })
        } catch (err) {
          logger.error('Membership', 'Fetch members failed', err)
          set({ 
            error: "获取会员列表失败", 
            loading: false,
            members: EMPTY_MEMBERS,
          })
        }
      },

      fetchMemberById: async (memberId: string) => {
        set({ loading: true, error: null })
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const member = get().members.find(m => m.id === memberId)
          if (member) {
            set({ selectedMember: member, loading: false })
          } else {
            set({ error: "未找到该会员", loading: false })
          }
        } catch (err) {
          logger.error('Membership', 'Fetch member failed', err)
          set({ error: "获取会员信息失败", loading: false })
        }
      },

      addMember: async (memberData): Promise<Member> => {
        set({ loading: true, error: null })
        try {
          const newMember: Member = {
            ...memberData,
            id: `member-${Date.now()}`,
            points: 0,
            totalPointsEarned: 0,
            totalSpent: 0,
            visitCount: 0,
            lastVisitAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          set(state => ({
            members: [...state.members, newMember],
            loading: false,
          }))

          console.log(`✅ [Membership] Member created: ${newMember.name}`)
          return newMember
        } catch (err) {
          logger.error('Membership', 'Create member failed', err)
          set({ error: "创建会员失败", loading: false })
          throw err
        }
      },

      updateMember: async (memberId: string, updates: Partial<Member>) => {
        set({ loading: true, error: null })
        try {
          set(state => ({
            members: state.members.map(member =>
              member.id === memberId
                ? { ...member, ...updates, updatedAt: new Date().toISOString() }
                : member
            ),
            selectedMember: state.selectedMember?.id === memberId 
              ? { ...state.selectedMember, ...updates, updatedAt: new Date().toISOString() as unknown as string }
              : state.selectedMember,
            loading: false,
          }))
          console.log(`✅ [Membership] Member updated: ${memberId}`)
        } catch (err) {
          logger.error('Membership', 'Update member failed', err)
          set({ error: "更新会员信息失败", loading: false })
          throw err
        }
      },

      deleteMember: async (memberId: string) => {
        set({ loading: true, error: null })
        try {
          set(state => ({
            members: state.members.filter(member => member.id !== memberId),
            selectedMember: state.selectedMember?.id === memberId ? null : state.selectedMember,
            loading: false,
          }))
          console.log(`✅ [Membership] Member deleted: ${memberId}`)
        } catch (err) {
          logger.error('Membership', 'Delete member failed', err)
          set({ error: "删除会员失败", loading: false })
          throw err
        }
      },

      upgradeMemberTier: (memberId: string, newTierId: string) => {
        const tier = get().tiers.find(t => t.id === newTierId)
        if (!tier) {
          console.warn(`⚠️ [Membership] Tier ${newTierId} not found`)
          return
        }
        
        get().updateMember(memberId, { tierId: newTierId })
        console.log(`🎉 [Membership] Member ${memberId} upgraded to ${tier.name}`)
      },

      addPoints: async (memberId, points, type, description, metadata?: Record<string, unknown>) => {
        const member = get().members.find(m => m.id === memberId)
        if (!member) {
          logger.warn('Membership', 'Member not found', { memberId })
          return
        }

        const transaction: PointsTransaction = {
          id: `tx-${Date.now()}`,
          memberId,
          type,
          points,
          balanceAfter: member.points + points,
          description,
          createdAt: new Date().toISOString(),
          ...(metadata as Omit<Partial<PointsTransaction>, 'id' | 'memberId' | 'type' | 'points' | 'balanceAfter' | 'description' | 'createdAt'>),
        }

        await get().updateMember(memberId, {
          points: member.points + points,
          totalPointsEarned: type === 'earn' ? member.totalPointsEarned + points : member.totalPointsEarned,
        })

        set(state => ({
          transactions: [transaction, ...state.transactions],
        }))

        console.log(`✅ [Membership] ${type === 'earn' ? '+' : '-'}${Math.abs(points)} points for member ${memberId}`)
      },

      redeemPoints: async (memberId: string, itemId: string): Promise<boolean> => {
        const member = get().members.find(m => m.id === memberId)
        const item = get().redemptionItems.find(i => i.id === itemId)

        if (!member || !item) {
          console.error('❌ [Membership] Invalid member or item')
          return false
        }

        if (member.points < item.pointsCost) {
          console.warn('⚠️ [Membership] Insufficient points')
          return false
        }

        await get().addPoints(memberId, -item.pointsCost, 'redeem', `兑换: ${item.name}`, { metadata: { itemId } })
        console.log(`🎁 [Membership] Redeemed: ${item.name}`)
        return true
      },

      getTransactionsByMember: (memberId: string) => {
        return (get().transactions ?? EMPTY_TRANSACTIONS)
          .filter(tx => tx.memberId === memberId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      calculateTierProgress: (member: Member) => {
        const tiers = get().tiers.sort((a, b) => a.minPoints - b.minPoints)
        const currentIndex = tiers.findIndex(t => t.id === member.tierId)
        const current = tiers[currentIndex]
        const next = tiers[currentIndex + 1] || null
        
        let progress = 100
        if (next) {
          progress = Math.round(
            ((member.points - current.minPoints) / (next.minPoints - current.minPoints)) * 100
          )
        }

        return { current, next, progress: Math.min(100, Math.max(0, progress)) }
      },

      getMembersByTier: (tierId: string) => {
        return (get().members ?? EMPTY_MEMBERS).filter(member => member.tierId === tierId)
      },

      getTopMembers: (limit = 10) => {
        return [...(get().members ?? EMPTY_MEMBERS)]
          .sort((a, b) => b.totalPointsEarned - a.totalPointsEarned)
          .slice(0, limit)
      },

      getExpiringPoints: (daysThreshold = 30) => {
        const thresholdDate = new Date()
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

        return (get().transactions ?? EMPTY_TRANSACTIONS)
          .filter(tx => 
            tx.type === 'earn' && 
            tx.expiresAt && 
            new Date(tx.expiresAt) <= thresholdDate
          )
          .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime())
      },

      getMembersSafe: () => get().members ?? EMPTY_MEMBERS,

      getMemberCount: () => (get().members ?? EMPTY_MEMBERS).length,

      getActiveMemberCount: () => 
        (get().members ?? EMPTY_MEMBERS).filter(m => m.status === 'active').length,

      setSelectedMember: (member: Member | null) => set({ selectedMember: member }),

      clearError: () => set({ error: null }),

      reset: () => set({
        members: EMPTY_MEMBERS,
        transactions: EMPTY_TRANSACTIONS,
        redemptionItems: EMPTY_REDEMPTIONS,
        selectedMember: null,
        loading: false,
        error: null,
        lastFetched: null,
      }),
    }),
    { name: 'MembershipStore' }
  )
)

function getDefaultTiers(): MemberTier[] {
  return [
    {
      id: 'bronze',
      name: '青铜会员',
      nameEn: 'Bronze',
      icon: '🥉',
      minPoints: 0,
      maxPoints: 999,
      discountRate: 0,
      benefits: ['基础积分', '生日优惠'],
      color: '#CD7F32',
    },
    {
      id: 'silver',
      name: '白银会员',
      nameEn: 'Silver',
      icon: '🥈',
      minPoints: 1000,
      maxPoints: 4999,
      discountRate: 0.05,
      benefits: ['95折优惠', '优先预订', '专属客服'],
      color: '#C0C0C0',
    },
    {
      id: 'gold',
      name: '黄金会员',
      nameEn: 'Gold',
      icon: '🥇',
      minPoints: 5000,
      maxPoints: 19999,
      discountRate: 0.10,
      benefits: ['9折优惠', '免费升级', 'VIP包厢'],
      color: '#FFD700',
    },
    {
      id: 'platinum',
      name: '铂金会员',
      nameEn: 'Platinum',
      icon: '💎',
      minPoints: 20000,
      discountRate: 0.15,
      benefits: ['85折优惠', '私人管家', '定制服务', '年度礼包'],
      color: '#E5E4E2',
    },
    {
      id: 'diamond',
      name: '钻石会员',
      nameEn: 'Diamond',
      icon: '👑',
      minPoints: 50000,
      discountRate: 0.20,
      benefits: ['8折优惠', '股东权益', '品牌联名', '全球通用'],
      color: '#B9F2FF',
    },
  ]
}

function getDefaultRules(): PointsRule[] {
  return [
    {
      id: 'rule-consumption',
      type: 'consumption',
      name: '消费积分',
      description: '每消费1元获得1积分',
      pointsPerUnit: 1,
      maxPointsPerDay: 5000,
      isActive: true,
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'rule-checkin',
      type: 'checkin',
      name: '签到积分',
      description: '每日签到获得50积分',
      pointsPerUnit: 50,
      maxPointsPerDay: 50,
      isActive: true,
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'rule-referral',
      type: 'referral',
      name: '推荐奖励',
      description: '推荐新用户注册获得1000积分',
      pointsPerUnit: 1000,
      isActive: true,
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'rule-birthday',
      type: 'birthday',
      name: '生日双倍',
      description: '生日当天消费双倍积分',
      pointsPerUnit: 2,
      multiplier: 2,
      isActive: true,
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'rule-review',
      type: 'review',
      name: '评价奖励',
      description: '每次有效评价获得100积分',
      pointsPerUnit: 100,
      maxPointsPerDay: 300,
      isActive: true,
      validFrom: '2024-06-01T00:00:00Z',
    },
  ]
}

function getMockMembers(): Member[] {
  return [
    {
      id: 'member-001',
      storeId: 'store-001',
      phone: '138-0000-0001',
      name: '张三',
      gender: 'male',
      birthday: '1990-05-15',
      tierId: 'platinum',
      points: 25680,
      totalPointsEarned: 45000,
      totalSpent: 128000,
      visitCount: 156,
      lastVisitAt: '2026-05-22T21:30:00Z',
      status: 'active',
      preferences: {
        favoriteRoomType: 'vip',
        favoriteSongs: ['流行', '经典'],
      },
      tags: ['VIP', '高价值客户'],
      createdAt: '2024-03-15T14:00:00Z',
      updatedAt: '2026-05-23T09:15:00Z',
    },
    {
      id: 'member-002',
      storeId: 'store-001',
      phone: '139-0000-0002',
      name: '李四',
      gender: 'female',
      birthday: '1995-08-22',
      tierId: 'gold',
      points: 12500,
      totalPointsEarned: 22000,
      totalSpent: 65000,
      visitCount: 89,
      lastVisitAt: '2026-05-20T19:45:00Z',
      status: 'active',
      preferences: {
        favoriteRoomType: 'large',
      },
      tags: ['忠实客户'],
      createdAt: '2024-07-20T11:30:00Z',
      updatedAt: '2026-05-21T16:30:00Z',
    },
    {
      id: 'member-003',
      storeId: 'store-002',
      phone: '137-0000-0003',
      name: '王五',
      tierId: 'silver',
      points: 3200,
      totalPointsEarned: 5500,
      totalSpent: 18000,
      visitCount: 34,
      lastVisitAt: '2026-05-18T22:00:00Z',
      status: 'active',
      preferences: {},
      tags: [],
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2026-05-19T10:20:00Z',
    },
  ]
}

function getMockTransactions(): PointsTransaction[] {
  return [
    {
      id: 'tx-001',
      memberId: 'member-001',
      type: 'earn',
      points: 288,
      balanceAfter: 25680,
      ruleId: 'rule-consumption',
      orderId: 'order-123',
      description: 'VIP包厢消费',
      createdAt: '2026-05-22T21:35:00Z',
    },
    {
      id: 'tx-002',
      memberId: 'member-001',
      type: 'redeem',
      points: -1500,
      balanceAfter: 25392,
      description: '兑换: 免费欢唱券',
      createdAt: '2026-05-20T18:00:00Z',
    },
    {
      id: 'tx-003',
      memberId: 'member-002',
      type: 'earn',
      points: 50,
      balanceAfter: 12550,
      ruleId: 'rule-checkin',
      description: '每日签到',
      createdAt: '2026-05-23T08:00:00Z',
    },
  ]
}

function getMockRedemptionItems(): RedemptionItem[] {
  return [
    {
      id: 'item-001',
      name: '免费欢唱券',
      description: '免费欢唱2小时（适用于所有房型）',
      pointsCost: 1500,
      category: 'voucher',
      value: 388,
      stock: 999,
      isActive: true,
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'item-002',
      name: '商品抵扣券',
      description: '全场商品满100减20',
      pointsCost: 800,
      category: 'product',
      value: 20,
      stock: 500,
      isActive: true,
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'item-003',
      name: 'VIP房升级',
      description: '免费升级至VIP包厢一次',
      pointsCost: 3000,
      category: 'room_discount',
      value: 300,
      stock: 100,
      isActive: true,
      memberTierIds: ['gold', 'platinum', 'diamond'],
      validFrom: '2024-01-01T00:00:00Z',
    },
    {
      id: 'item-004',
      name: '限量版周边',
      description: 'YYC3定制T恤一件',
      pointsCost: 2000,
      category: 'gift',
      value: 128,
      stock: 50,
      isActive: true,
      imageUrl: '/yyc3-logo.png',
      validFrom: '2024-06-01T00:00:00Z',
      validTo: '2026-12-31T23:59:59Z',
    },
  ]
}

export type { MembershipState, MembershipActions }
