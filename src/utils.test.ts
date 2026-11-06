import { describe, it, expect } from 'vitest'

function formatCurrency(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '0'
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

describe('currency formatting', () => {
  it('formats whole numbers', () => {
    expect(formatCurrency(180000)).toBe('1,80,000')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('0')
  })

  it('handles NaN safely', () => {
    expect(formatCurrency(NaN)).toBe('0')
  })
})
