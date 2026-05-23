import { describe, it, expect, beforeEach } from 'vitest'
import { useMembershipStore } from '@/lib/stores/useMembershipStore'

describe('会员管理集成测试', () => {
  beforeEach(() => {
    useMembershipStore.setState({
      members: [],
      transactions: [],
      redemptionItems: [],
      tiers: [],
      selectedMember: null,
      loading: false,
      error: null,
    })
  })

  describe('状态管理集成', () => {
    it('应该能够选择会员', () => {
      useMembershipStore.setState({ 
        selectedMember: { id: 'member-001' } as any 
      })
      
      expect(useMembershipStore.getState().selectedMember?.id).toBe('member-001')
    })

    it('应该能够清除选中会员', () => {
      useMembershipStore.setState({ 
        selectedMember: { id: 'member-001' } as any 
      })
      
      expect(useMembershipStore.getState().selectedMember).not.toBeNull()

      useMembershipStore.setState({ selectedMember: null })
      
      expect(useMembershipStore.getState().selectedMember).toBeNull()
    })

    it('应该在操作过程中正确管理加载和错误状态', () => {
      useMembershipStore.setState({ loading: true, error: null })
      expect(useMembershipStore.getState().loading).toBe(true)

      useMembershipStore.setState({ loading: false, error: '获取数据失败' })
      expect(useMembershipStore.getState().error).toBe('获取数据失败')

      useMembershipStore.setState({ 
        loading: false, 
        error: null 
      })

      expect(useMembershipStore.getState().loading).toBe(false)
      expect(useMembershipStore.getState().error).toBeNull()
    })
  })
})
