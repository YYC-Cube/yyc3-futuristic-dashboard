import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GhostModeToggle } from '@/components/ui/ghost-mode-toggle'

describe('GhostModeToggle', () => {
  it('应该能够渲染而不崩溃', () => {
    const { container } = render(<GhostModeToggle />)
    expect(container).toBeDefined()
  })
})
