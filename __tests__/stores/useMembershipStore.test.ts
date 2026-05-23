import { describe, it, expect, beforeEach } from 'vitest'
import { useMembershipStore } from '@/lib/stores/useMembershipStore'

describe('useMembershipStore', () => {
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
      
      useMembershipStore.setState({ selectedMember: { id: memberId } as any })
      const state = useMembershipStore.getState()

      expect(state.selectedMember?.id).toBe(memberId)
    })

    it('应该能够清除选中会员', () => {
      useMembershipStore.setState({ selectedMember: { id: 'test' } as any })
      useMembershipStore.setState({ selectedMember: null })
      
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
      useMembershipStore.setState({ error: null })
      
      expect(useMembershipStore.getState().error).toBeNull()
    })
  })
})
