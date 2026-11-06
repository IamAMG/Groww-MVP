import { describe, it, expect } from 'vitest'

function clampPct(value: number): number {
  return Math.max(0, Math.min(100, value))
}

describe('percentage clamp', () => {
  it('clamps below zero to zero', () => {
    expect(clampPct(-5)).toBe(0)
  })
  it('clamps above hundred to hundred', () => {
    expect(clampPct(150)).toBe(100)
  })
  it('keeps valid values', () => {
    expect(clampPct(42)).toBe(42)
  })
})
