import { describe, it, expect } from 'vitest'

function safeFallbackReason(reason: string | null): string {
  if (!reason) return ''
  return reason
}

describe('safe fallback', () => {
  it('returns empty string for no reason', () => {
    expect(safeFallbackReason(null)).toBe('')
  })

  it('returns the reason when present', () => {
    expect(safeFallbackReason('insufficient sources')).toBe('insufficient sources')
  })
})
