import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { BottomNav, Card, CardBody, CardFooter, Button, OutlineButton, Badge } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'
import { ROUTES, SIMULATED_BADGE } from '@/constants/index'

const SAMPLE_QUESTIONS = [
  'Why are my current portfolio returns lower than expected?',
  'Why are SIP returns fluctuating?',
  'What does XIRR mean?',
  'Why is my portfolio value lower than my invested amount?',
]

const MOCK_ANSWERS: Record<string, { answer: string; sources: { title: string; url: string | null }[] }> = {
  'Why are my current portfolio returns lower than expected?': {
    answer: 'Short-term returns can dip below expectations due to market volatility, expense ratios, or fund underperformance versus its benchmark. SIPs benefit from rupee-cost averaging over longer periods, so temporary dips are normal. Review your fund’s 3- and 5-year returns against its category average before deciding.',
    sources: [
      { title: 'SEBI Investor Education – SIP Fundamentals', url: 'https://www.sebi.gov.in' },
      { title: 'AMFI Mutual Fund Basics', url: null },
    ],
  },
  'Why are SIP returns fluctuating?': {
    answer: 'SIP returns fluctuate because your instalments buy mutual fund units at changing NAVs. When markets fall, your fixed SIP amount buys more units; when markets rise, fewer units. This averaging smooths volatility over time but does not eliminate it.',
    sources: [
      { title: 'SEBI Investor Education – SIP Fundamentals', url: 'https://www.sebi.gov.in' },
    ],
  },
  'What does XIRR mean?': {
    answer: 'XIRR (Extended Internal Rate of Return) calculates the annualised return on investments made at irregular intervals, like monthly SIPs. It accounts for the timing and amount of each cash flow, making it more accurate than absolute returns for SIPs.',
    sources: [
      { title: 'AMFI Mutual Fund Basics', url: null },
    ],
  },
  'Why is my portfolio value lower than my invested amount?': {
    answer: 'If current market values of your holdings are below your total invested amount, your portfolio shows a notional loss. This is unrealised until you redeem. Staying invested through market cycles and avoiding panic exits is generally recommended for long-term goals.',
    sources: [
      { title: 'SEBI Investor Education – SIP Fundamentals', url: 'https://www.sebi.gov.in' },
    ],
  },
}

function getMockAnswer(question: string): { answer: string | null; sources: { title: string; url: string | null }[]; fallbackReason: string | null } {
  const q = question.toLowerCase()
  for (const [key, value] of Object.entries(MOCK_ANSWERS)) {
    if (q.includes(key.toLowerCase().split('?')[0])) {
      return { ...value, fallbackReason: null }
    }
  }
  return {
    answer: null,
    sources: [],
    fallbackReason: 'I could not find a verified answer in the approved educational sources. Try rephrasing your question about SIP returns, XIRR, or portfolio variance.',
  }
}

export function Compass() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<{ title: string; url: string | null }[]>([])
  const [loading, setLoading] = useState(false)
const [fallbackReason, setFallbackReason] = useState<string | null>(null)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer(null)
    setSources([])
    setFallbackReason(null)

    try {
      const { answer: ans, sources: src, fallbackReason: reason } = getMockAnswer(question)
      setAnswer(ans)
      setSources(src)
      setFallbackReason(reason)
    } catch {
      setAnswer("I'm unable to generate an explanation right now. Please try again.")
      setFallbackReason('Service unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4" />
          <button onClick={() => navigate('/dashboard')} className="text-sm text-muted hover:text-text">Back to SIP Health</button>
        </div>

        <h1 className="text-2xl font-bold text-text">Understand Your Returns</h1>
        <p className="text-sm text-muted">AI-powered portfolio and returns explanation.</p>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-3">Evaluated Portfolio</h3>
            <Badge variant="teal" className="text-[10px]">{SIMULATED_BADGE}</Badge>
            <div className="h-40 bg-[#f8fafc] rounded-xl border border-border flex items-center justify-center mb-4">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">Line chart — portfolio vs benchmark</p>
                <p className="text-xs text-muted">Month 1 · Month 6 · Month 12 · Today</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Portfolio Value</div>
                <div className="font-medium text-text">₹1,42,500</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Variance</div>
                <div className="font-medium text-text text-red-600">-5.0%</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-3">What does this variance mean?</h3>
            <div className="space-y-2 mb-4">
              {SAMPLE_QUESTIONS.map((q) => (
                <Button key={q} onClick={() => setQuestion(q)} className="w-full text-left text-sm px-3 py-2.5 border border-border bg-card hover:bg-[#f8fafc]">
                  {q}
                </Button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your returns..."
                className="w-full border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[80px]"
              />
              <Button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="absolute right-2 top-2 px-3 py-1.5 text-sm"
                style={{ padding: '0.375rem 0.75rem' }}
              >
                {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
            {loading && <div className="mt-3 flex items-center gap-2 text-sm text-muted">Generating explanation...</div>}
            {answer && (
              <div className="mt-4 p-4 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                  <span className="font-medium text-[#166534]">AI Explanation</span>
                </div>
                <p className="text-sm text-[#166534] leading-relaxed">{answer}</p>
                {sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#bbf7d0]/50">
                    <div className="text-xs font-semibold text-[#166534] mb-1">Sources</div>
                    <ul className="text-xs text-[#166534] space-y-1">
                      {sources.map((s, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-[10px]">•</span>
                          <span>{s.title}</span>{s.url && <span className="text-[10px] ml-1">({s.url})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {fallbackReason && !answer && (
              <div className="mt-4 p-4 rounded-lg bg-[#fef3c7] border border-[#f59e0b]/30">
                <p className="text-sm text-[#92400e] leading-relaxed">
                  I couldn't confidently verify an answer to that question using the available educational sources. You can try rephrasing it or explore the approved resources below.
                </p>
                {fallbackReason && <p className="text-xs text-[#92400e] mt-1">{fallbackReason}</p>}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="p-3 rounded bg-[#fffbeb] border border-[#fcd34d]/30 text-xs text-[#92400e] leading-relaxed">
              <p className="font-semibold">Market volatility</p>
              <p className="mt-1">Short-term returns may differ from expectations. Historical performance is not indicative of future results. Illustrative projections are not guaranteed.</p>
            </div>
          </CardBody>
        </Card>

        <CardFooter className="flex gap-2">
          <Button onClick={() => navigate(ROUTES.GOAL)}>View Goal Progress</Button>
          <OutlineButton onClick={() => navigate('/dashboard')}>Back to SIP Health</OutlineButton>
        </CardFooter>
      </div>
      <Disclaimer />
      <BottomNav activePath="/compass" />
    </div>
  )
}

