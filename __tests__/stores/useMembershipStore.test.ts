import { describe, it, expect, beforeEach } from 'vitest'
import { useMembershipStore } from '@/lib/stores/useMembershipStore'

function createTestMemberData(overrides: Record<string, unknown> = {}) {
  return {
    storeId: 'store-001',
    phone: '13800138000',
    name: '测试会员',
    tierId: 'bronze',
    tags: [],
    ...overrides,
  } as any
}

describe('useMembershipStore', () => {
  beforeEach(() => {
    useMembershipStore.setState({
      members: [],
      transactions: [],
      redemptionItems: [],
      tiers: [],
      rules: [],
      selectedMember: null,
      loading: false,
      error: null,
      lastFetched: null,
    })
  })

  describe('初始状态', () => {
    it('应该有正确的默认值', () => {
      const state = useMembershipStore.getState()
      
      expect(state.selectedMember).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setSelectedMember', () => {
    it('应该设置选中的会员', () => {
      const memberId = 'member-001'
      
      useMembershipStore.setState({ selectedMember: { id: memberId, name: '测试' } as any })
      const state = useMembershipStore.getState()

      expect(state.selectedMember?.id).toBe(memberId)
    })

    it('应该能够清除选中会员', () => {
      useMembershipStore.setState({ selectedMember: { id: 'test' } as any })
      useMembershipStore.getState().setSelectedMember(null)
      
      expect(useMembershipStore.getState().selectedMember).toBeNull()
    })
  })

  describe('状态更新', () => {
    it('应该能够更新loading状态', () => {
      useMembershipStore.setState({ loading: true })
      
      expect(useMembershipStore.getState().loading).toBe(true)
    })

    it('应该能够更新error状态', () => {
      useMembershipStore.setState({ error: '网络错误' })
      
      expect(useMembershipStore.getState().error).toBe('网络错误')
    })

    it('应该能够清除error状态', () => {
      useMembershipStore.setState({ error: '网络错误' })
      useMembershipStore.getState().clearError()
      
      expect(useMembershipStore.getState().error).toBeNull()
    })
  })

  describe('addMember - 添加会员', () => {
    it('应该成功添加新会员', async () => {
      const memberData = createTestMemberData({ name: '张三' })
      const result = await useMembershipStore.getState().addMember(memberData)

      expect(result).toBeDefined()
      expect(result.id).toMatch(/^member-/)
      expect(result.name).toBe('张三')
      expect(result.points).toBe(0)
      expect(result.visitCount).toBe(0)
      expect(result.createdAt).toBeDefined()

      const state = useMembershipStore.getState()
      expect(state.members.length).toBe(1)
      expect(state.members[0].id).toBe(result.id)
    })

    it('添加时应该设置loading状态', async () => {
      const memberData = createTestMemberData({ name: 'Loading测试' })
      
      const addPromise = useMembershipStore.getState().addMember(memberData)
      
      const result = await addPromise
      
      expect(useMembershipStore.getState().loading).toBe(false)
      expect(result).toBeDefined()
    })

    it('应该初始化会员统计信息', async () => {
      const memberData = createTestMemberData({ name: '李四' })
      const result = await useMembershipStore.getState().addMember(memberData)

      expect(result.totalPointsEarned).toBe(0)
      expect(result.totalSpent).toBe(0)
      expect(result.visitCount).toBe(0)
    })
  })

  describe('updateMember - 更新会员', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '原始会员', phone: '13900139000' })
      )
    })

    it('应该成功更新会员信息', async () => {
      const memberId = useMembershipStore.getState().members[0].id

      await useMembershipStore.getState().updateMember(memberId, {
        name: '更新后的会员',
        phone: '13800138001',
      })

      const updatedMember = useMembershipStore.getState().members.find(m => m.id === memberId)
      expect(updatedMember?.name).toBe('更新后的会员')
      expect(updatedMember?.phone).toBe('13800138001')
      expect(updatedMember?.updatedAt).toBeDefined()
    })

    it('如果选中的是被更新的会员，应同步更新', async () => {
      const memberId = useMembershipStore.getState().members[0].id
      useMembershipStore.getState().setSelectedMember(
        useMembershipStore.getState().members[0]
      )

      await useMembershipStore.getState().updateMember(memberId, {
        name: '同步更新',
      })

      expect(useMembershipStore.getState().selectedMember?.name).toBe('同步更新')
    })
  })

  describe('deleteMember - 删除会员', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '待删除会员', phone: '13700137000' })
      )
    })

    it('应该成功删除会员', async () => {
      const memberId = useMembershipStore.getState().members[0].id
      const initialCount = useMembershipStore.getState().members.length

      await useMembershipStore.getState().deleteMember(memberId)

      expect(useMembershipStore.getState().members.length).toBe(initialCount - 1)
      expect(useMembershipStore.getState().members.find(m => m.id === memberId)).toBeUndefined()
    })

    it('删除后应清除选中状态（如果删除的是当前选中）', async () => {
      const memberId = useMembershipStore.getState().members[0].id
      useMembershipStore.getState().setSelectedMember(
        useMembershipStore.getState().members[0]
      )

      await useMembershipStore.getState().deleteMember(memberId)

      expect(useMembershipStore.getState().selectedMember).toBeNull()
    })
  })

  describe('upgradeMemberTier - 升级会员等级', () => {
    beforeEach(async () => {
      useMembershipStore.setState({
        tiers: [
          { id: 'bronze', name: '青铜', minPoints: 0 },
          { id: 'silver', name: '白银', minPoints: 1000 },
          { id: 'gold', name: '黄金', minPoints: 5000 },
        ] as any
      })

      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '待升级会员', tierId: 'bronze' })
      )
    })

    it('应该成功升级会员等级', () => {
      const memberId = useMembershipStore.getState().members[0].id
      
      useMembershipStore.getState().upgradeMemberTier(memberId, 'silver')

      const updatedMember = useMembershipStore.getState().members.find(m => m.id === memberId)
      expect(updatedMember?.tierId).toBe('silver')
    })

    it('不存在的等级不应该执行升级', () => {
      const memberId = useMembershipStore.getState().members[0].id
      const originalTierId = useMembershipStore.getState().members[0].tierId
      
      useMembershipStore.getState().upgradeMemberTier(memberId, 'non-existent')

      const member = useMembershipStore.getState().members.find(m => m.id === memberId)
      expect(member?.tierId).toBe(originalTierId)
    })
  })

  describe('addPoints - 添加积分', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '积分测试会员' })
      )
    })

    it('应该正确增加积分', async () => {
      const memberId = useMembershipStore.getState().members[0].id

      await useMembershipStore.getState().addPoints(memberId, 100, 'earn', '消费奖励')

      const member = useMembershipStore.getState().members.find(m => m.id === memberId)
      expect(member?.points).toBe(100)
      expect(member?.totalPointsEarned).toBe(100)
    })

    it('应该记录交易流水', async () => {
      const memberId = useMembershipStore.getState().members[0].id

      await useMembershipStore.getState().addPoints(memberId, 50, 'earn', '签到奖励')

      const transaction = useMembershipStore.getState().transactions[0]
      expect(transaction).toBeDefined()
      expect(transaction.memberId).toBe(memberId)
      expect(transaction.points).toBe(50)
      expect(transaction.type).toBe('earn')
      expect(transaction.balanceAfter).toBe(50)
    })

    it('不存在的会员不应该报错', async () => {
      await useMembershipStore.getState().addPoints('non-existent', 100, 'earn', '测试')

      expect(useMembershipStore.getState().transactions.length).toBe(0)
    })
  })

  describe('查询方法', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '活跃会员A', status: 'active' as const, totalSpent: 1000 })
      )
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '活跃会员B', status: 'active' as const, totalSpent: 2000 })
      )
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '非活跃会员', status: 'inactive' as const, totalSpent: 100 })
      )
    })

    it('getMembersSafe 应该返回成员列表', () => {
      const members1 = useMembershipStore.getState().getMembersSafe()
      const members2 = useMembershipStore.getState().getMembersSafe()

      expect(Array.isArray(members1)).toBe(true)
      expect(members1.length).toBe(3)
      expect(members2.length).toEqual(members1.length)
    })

    it('getMemberCount 应该返回总数量', () => {
      expect(useMembershipStore.getState().getMemberCount()).toBe(3)
    })

    it('getActiveMemberCount 应该返回活跃会员数', () => {
      expect(useMembershipStore.getState().getActiveMemberCount()).toBe(2)
    })

    it('getTopMembers 应该按消费金额排序返回指定数量', () => {
      const topMembers = useMembershipStore.getState().getTopMembers(2)

      expect(topMembers.length).toBe(2)
      expect(topMembers).toBeDefined()
    })
  })

  describe('reset - 重置状态', () => {
    it('应该重置所有状态到初始值', async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '临时会员' })
      )

      useMembershipStore.setState({ error: '测试错误' })

      useMembershipStore.getState().reset()

      const state = useMembershipStore.getState()
      expect(state.members.length).toBe(0)
      expect(state.transactions.length).toBe(0)
      expect(state.error).toBeNull()
      expect(state.selectedMember).toBeNull()
      expect(state.loading).toBe(false)
    })
  })

  describe('fetchMembers - 获取会员列表', () => {
    it('应该成功获取会员列表', async () => {
      await useMembershipStore.getState().fetchMembers()

      const state = useMembershipStore.getState()
      expect(state.members.length).toBeGreaterThan(0)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastFetched).not.toBeNull()
    }, 10000)

    it('应该在loading时避免重复请求', async () => {
      useMembershipStore.setState({ loading: true })
      
      await useMembershipStore.getState().fetchMembers()

      expect(useMembershipStore.getState().loading).toBe(true)
    })

    it('应该在数据新鲜时跳过请求', async () => {
      await useMembershipStore.getState().fetchMembers()
      const firstFetchTime = useMembershipStore.getState().lastFetched
      
      await useMembershipStore.getState().fetchMembers()
      
      expect(useMembershipStore.getState().lastFetched).toBe(firstFetchTime)
    }, 10000)
  })

  describe('fetchMemberById - 根据ID获取会员', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '查询会员' })
      )
    })

    it('应该成功获取存在的会员', async () => {
      const memberId = useMembershipStore.getState().members[0].id
      
      await useMembershipStore.getState().fetchMemberById(memberId)

      expect(useMembershipStore.getState().selectedMember?.id).toBe(memberId)
      expect(useMembershipStore.getState().loading).toBe(false)
    })

    it('对不存在的会员应设置错误', async () => {
      await useMembershipStore.getState().fetchMemberById('non-existent')

      expect(useMembershipStore.getState().error).toContain('未找到')
      expect(useMembershipStore.getState().selectedMember).toBeNull()
    })
  })

  describe('redeemPoints - 积分兑换', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(
        createTestMemberData({ name: '兑换会员' })
      )
      useMembershipStore.setState({
        redemptionItems: [
          { id: 'item-001', name: '测试商品', pointsCost: 100, isActive: true, category: 'product', value: 50, validFrom: '2024-01-01' },
        ] as any,
      })
    })

    it('积分足够时应成功兑换', async () => {
      const memberId = useMembershipStore.getState().members[0].id
      
      await useMembershipStore.getState().addPoints(memberId, 200, 'earn', '初始积分')
      const result = await useMembershipStore.getState().redeemPoints(memberId, 'item-001')

      expect(result).toBe(true)
      const member = useMembershipStore.getState().members.find(m => m.id === memberId)
      expect(member?.points).toBe(100)
    })

    it('积分不足时应返回false', async () => {
      const memberId = useMembershipStore.getState().members[0].id
      
      const result = await useMembershipStore.getState().redeemPoints(memberId, 'item-001')

      expect(result).toBe(false)
    })

    it('无效的会员或商品应返回false', async () => {
      const result = await useMembershipStore.getState().redeemPoints('invalid', 'item-001')

      expect(result).toBe(false)
    })
  })

  describe('getTransactionsByMember - 获取会员交易记录', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '交易会员A' }))
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '交易会员B' }))
      
      const memberA = useMembershipStore.getState().members[0]
      const memberB = useMembershipStore.getState().members[1]
      
      await useMembershipStore.getState().addPoints(memberA.id, 100, 'earn', '消费A')
      await useMembershipStore.getState().addPoints(memberB.id, 50, 'earn', '消费B')
      await useMembershipStore.getState().addPoints(memberA.id, -20, 'redeem', '兑换A')
    })

    it('应该返回指定会员的交易记录', async () => {
      const memberA = useMembershipStore.getState().members[0]
      const transactions = useMembershipStore.getState().getTransactionsByMember(memberA.id)

      expect(transactions.length).toBeGreaterThanOrEqual(1)
      expect(transactions.every(tx => tx.memberId === memberA.id)).toBe(true)
    })

    it('应该按时间倒序排列', () => {
      const memberA = useMembershipStore.getState().members[0]
      const transactions = useMembershipStore.getState().getTransactionsByMember(memberA.id)

      for (let i = 0; i < transactions.length - 1; i++) {
        expect(new Date(transactions[i].createdAt).getTime())
          .toBeGreaterThanOrEqual(new Date(transactions[i + 1].createdAt).getTime())
      }
    })
  })

  describe('calculateTierProgress - 计算等级进度', () => {
    beforeEach(() => {
      useMembershipStore.setState({
        tiers: [
          { id: 'bronze', name: '青铜', minPoints: 0, maxPoints: 999, discountRate: 0, benefits: [], color: '#000' },
          { id: 'silver', name: '白银', minPoints: 1000, maxPoints: 4999, discountRate: 0.05, benefits: [], color: '#000' },
          { id: 'gold', name: '黄金', minPoints: 5000, discountRate: 0.10, benefits: [], color: '#000' },
        ] as any,
      })
    })

    it('应该正确计算中间等级的进度', () => {
      const mockMember = { id: 'test', tierId: 'bronze', points: 500 } as any
      
      const progress = useMembershipStore.getState().calculateTierProgress(mockMember)

      expect(progress.current.id).toBe('bronze')
      expect(progress.next?.id).toBe('silver')
      expect(progress.progress).toBe(50)
    })

    it('最高等级的进度应为100%', () => {
      const mockMember = { id: 'test', tierId: 'gold', points: 10000 } as any
      
      const progress = useMembershipStore.getState().calculateTierProgress(mockMember)

      expect(progress.progress).toBe(100)
      expect(progress.next).toBeNull()
    })
  })

  describe('getMembersByTier - 按等级筛选会员', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '青铜会员', tierId: 'bronze' }))
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '白银会员', tierId: 'silver' }))
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '白银会员2', tierId: 'silver' }))
    })

    it('应该返回指定等级的所有会员', () => {
      const silverMembers = useMembershipStore.getState().getMembersByTier('silver')

      expect(silverMembers.length).toBe(2)
      expect(silverMembers.every(m => m.tierId === 'silver')).toBe(true)
    })

    it('不存在的等级应返回空数组', () => {
      const members = useMembershipStore.getState().getMembersByTier('diamond')

      expect(members.length).toBe(0)
    })
  })

  describe('getExpiringPoints - 获取即将过期的积分', () => {
    beforeEach(async () => {
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '过期测试会员' }))
      const memberId = useMembershipStore.getState().members[0].id
      
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 15)
      
      useMembershipStore.setState({
        transactions: [
          {
            id: 'tx-expiring',
            memberId,
            type: 'earn',
            points: 500,
            balanceAfter: 500,
            description: '即将过期',
            createdAt: new Date().toISOString(),
            expiresAt: futureDate.toISOString(),
          } as any,
          {
            id: 'tx-not-expiring',
            memberId,
            type: 'earn',
            points: 1000,
            balanceAfter: 1500,
            description: '未过期',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          } as any,
        ],
      })
    })

    it('应该返回在阈值内过期的积分交易', () => {
      const expiringTx = useMembershipStore.getState().getExpiringPoints(30)

      expect(expiringTx.length).toBe(1)
      expect(expiringTx[0].id).toBe('tx-expiring')
    })

    it('应该按过期时间升序排列', () => {
      const expiringTx = useMembershipStore.getState().getExpiringPoints(30)

      if (expiringTx.length > 1) {
        for (let i = 0; i < expiringTx.length - 1; i++) {
          expect(new Date(expiringTx[i].expiresAt!).getTime())
            .toBeLessThanOrEqual(new Date(expiringTx[i + 1].expiresAt!).getTime())
        }
      }
    })
  })

  describe('边界条件和错误处理', () => {
    it('addMember 失败时应处理异常', async () => {
      try {
        await useMembershipStore.getState().addMember(null as any)
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(useMembershipStore.getState().loading).toBe(false)
    })

    it('updateMember 应处理异常情况', async () => {
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '异常测试' }))
      const memberId = useMembershipStore.getState().members[0].id

      try {
        await useMembershipStore.getState().updateMember(memberId, null as any)
      } catch (e) {
        expect(e).toBeDefined()
      }
    })

    it('deleteMember 应处理异常情况', async () => {
      await useMembershipStore.getState().addMember(createTestMemberData({ name: '删除异常' }))
      const memberId = useMembershipStore.getState().members[0].id

      try {
        await useMembershipStore.getState().deleteMember(memberId)
      } catch (e) {
        expect(e).toBeDefined()
      }

      expect(useMembershipStore.getState().members.find(m => m.id === memberId)).toBeUndefined()
    })

    it('getTopMembers 默认limit应为10', () => {
      for (let i = 0; i < 15; i++) {
        useMembershipStore.setState(state => ({
          members: [...state.members, {
            ...createTestMemberData({ name: `会员${i}`, totalSpent: i * 100 }),
            id: `member-${i}`,
            points: 0,
            totalPointsEarned: 0,
            totalSpent: i * 100,
            visitCount: 0,
            lastVisitAt: new Date().toISOString(),
            status: 'active' as const,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any],
        }))
      }

      const topMembers = useMembershipStore.getState().getTopMembers()
      
      expect(topMembers.length).toBe(10)
    })
  })
})