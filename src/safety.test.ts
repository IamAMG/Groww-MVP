import { describe, it, expect } from 'vitest'

// Safety rules: classify whether a query requests restricted advice
function classifyIntent(query: string): 'allowed' | 'restricted' {
  const q = query.toLowerCase()

  // Specific fund/stock recommendations
  const hasFundOrStock = q.includes('fund') || q.includes('stock')
  const hasRecommendation =
    q.includes('which') || q.includes('recommend') || q.includes('should i buy') || q.includes('should i sell') || q.includes('should i hold')
  if (hasFundOrStock && hasRecommendation) return 'restricted'

  // SIP buy/sell/hold/stop/increase/pause advice
  if (q.includes('should i') && q.includes('sip') && (q.includes('buy') || q.includes('sell') || q.includes('hold') || q.includes('stop') || q.includes('increase') || q.includes('pause'))) return 'restricted'

  // Guaranteed/assured returns
  if ((q.includes('guarantee') || q.includes('assured')) && q.includes('return')) return 'restricted'

  // SIP stop/increase/pause advice
  if (q.includes('should i') && q.includes('sip') && (q.includes('stop') || q.includes('increase') || q.includes('pause'))) return 'restricted'

  return 'allowed'
}

describe('safety classification', () => {
  it('allows ordinary educational questions', () => {
    expect(classifyIntent('Why are my SIP returns fluctuating?')).toBe('allowed')
    expect(classifyIntent('What does XIRR mean?')).toBe('allowed')
    expect(classifyIntent('Why did my AutoPay fail?')).toBe('allowed')
  })

  it('blocks specific fund/stock recommendations', () => {
    expect(classifyIntent('Which mutual fund should I invest in?')).toBe('restricted')
    expect(classifyIntent('Which stock should I buy?')).toBe('restricted')
    expect(classifyIntent('Recommend a fund')).toBe('restricted')
  })

  it('blocks buy/sell/hold requests', () => {
    expect(classifyIntent('Should I buy this fund?')).toBe('restricted')
    expect(classifyIntent('Should I sell my SIP?')).toBe('restricted')
    expect(classifyIntent('Should I hold this stock?')).toBe('restricted')
  })

  it('blocks guaranteed return promises', () => {
    expect(classifyIntent('Can you guarantee a 12% return?')).toBe('restricted')
    expect(classifyIntent('Assured return of 15%?')).toBe('restricted')
  })

  it('blocks SIP stop/increase/pause advice', () => {
    expect(classifyIntent('Should I stop my SIP?')).toBe('restricted')
    expect(classifyIntent('Should I increase my monthly SIP?')).toBe('restricted')
    expect(classifyIntent('Should I pause my SIP?')).toBe('restricted')
  })
})
