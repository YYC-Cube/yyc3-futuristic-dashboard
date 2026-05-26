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
})