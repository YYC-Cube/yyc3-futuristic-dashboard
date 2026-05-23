import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

describe('ThemeToggle', () => {
  it('应该能够渲染而不崩溃', () => {
    const { container } = render(<ThemeToggle />)
    expect(container).toBeDefined()
  })
})
