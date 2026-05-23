import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cn } from '@/lib/utils'

describe('工具函数测试套件', () => {
  describe('cn() - 类名合并函数', () => {
    it('应该合并基础类名', () => {
      expect(cn('flex', 'items-center')).toBe('flex items-center')
    })

    it('应该处理条件类名', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
    })

    it('应该处理undefined和null值', () => {
      expect(cn('base', undefined, null, 'extra')).toBe('base extra')
    })

    it('应该处理空字符串', () => {
      expect(cn('', 'valid', '')).toBe('valid')
    })

    it('应该合并Tailwind冲突类名（后者优先）', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('应该处理对象形式的类名', () => {
      expect(cn({ 'text-red': true, 'text-blue': false })).toBe('text-red')
    })

    it('应该处理数组形式的类名', () => {
      expect(cn(['flex', 'items-center'], ['justify-center'])).toBe(
        'flex items-center justify-center'
      )
    })

    it('应该处理混合输入类型', () => {
      const condition = true
      expect(cn(
        'base',
        condition && 'active',
        { 'hover:scale': true },
        ['p-2', 'm-1']
      )).toContain('base')
    })

    it('应该处理数字类名', () => {
      expect(cn('col-span-1', 'col-span-2')).toBe('col-span-2')
    })

    it('应该处理响应式变体', () => {
      expect(cn('text-sm', 'md:text-lg')).toContain('text-sm')
      expect(cn('text-sm', 'md:text-lg')).toContain('md:text-lg')
    })
  })
})
