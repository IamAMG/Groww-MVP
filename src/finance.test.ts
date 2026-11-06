import { describe, it, expect } from 'vitest'

// Deterministic SIP future value formula:
// FV = P * [((1 + r)^n - 1) / r] * (1 + r)   for annuity-due (contribution at start of period)
// where P = monthly contribution, r = monthly rate, n = number of months

function sipFutureValue(monthlyContribution: number, annualReturnPercent: number, years: number): number {
  if (monthlyContribution <= 0) return 0
  if (annualReturnPercent <= 0) return monthlyContribution * 12 * years
  const r = annualReturnPercent / 100 / 12
  const n = years * 12
  return monthlyContribution * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
}

function goalProgress(achieved: number, target: number): number {
  if (target <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((achieved / target) * 100)))
}

describe('sipFutureValue', () => {
  it('returns 0 for zero contribution', () => {
    expect(sipFutureValue(0, 12, 10)).toBe(0)
  })

  it('returns 0 for negative contribution', () => {
    expect(sipFutureValue(-100, 12, 10)).toBe(0)
  })

  it('returns simple sum when return is 0%', () => {
    expect(sipFutureValue(5000, 0, 10)).toBe(5000 * 12 * 10)
  })

  it('grows with positive return', () => {
    const withReturn = sipFutureValue(5000, 12, 10)
    const withoutReturn = sipFutureValue(5000, 0, 10)
    expect(withReturn).toBeGreaterThan(withoutReturn)
  })

  it('is finite for reasonable inputs', () => {
    expect(isFinite(sipFutureValue(50000, 15, 30))).toBe(true)
  })
})

describe('goalProgress', () => {
  it('clamps to 0-100', () => {
    expect(goalProgress(0, 100000)).toBe(0)
    expect(goalProgress(100000, 100000)).toBe(100)
    expect(goalProgress(200000, 100000)).toBe(100)
  })

  it('returns 0 for zero target', () => {
    expect(goalProgress(50000, 0)).toBe(0)
  })

  it('calculates percentage', () => {
    expect(goalProgress(180000, 1000000)).toBe(18)
  })
})
