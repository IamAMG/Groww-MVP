import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CreditCard } from 'lucide-react'
import { BottomNav, Card, CardBody, Button } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'


const MOCK_FLEX_ANSWERS: Record<string, string> = {
  'Why did my SIP instalment fail?': 'A SIP instalment can fail due to insufficient bank balance, an expired or cancelled mandate, a changed bank account, or a technical issue with the payment gateway. Check your bank statement and confirm the AutoPay mandate is active.',
  'What happens after a failed AutoPay?': 'After a failed AutoPay, the mutual fund house typically retries the debit or notifies you. The missed instalment is not auto-recovered; you may need to make a manual payment or wait for the next cycle. Persistent failures can lead to SIP cancellation.',
  'What does a mandate failure mean?': 'A mandate failure means the standing instruction you gave your bank to debit a fixed SIP amount was not honoured. This can happen if the mandate expired, bank details changed, or the bank rejected the transaction.',
  'What happens if my bank account changes?': 'If your bank account changes, you must update the SIP mandate with the new account details through your mutual fund house or registrar. Until updated, future debits may fail.',
  'How can I understand a payment debit issue?': 'Payment debit issues are usually due to insufficient funds, expired mandates, incorrect bank details, or bank-side transaction limits. Review the error message from your bank or mutual fund house for the specific reason.',
}

function getMockFlexAnswer(question: string): string {
  const q = question.toLowerCase()
  for (const [key, value] of Object.entries(MOCK_FLEX_ANSWERS)) {
    if (q.includes(key.toLowerCase().split('?')[0])) {
      return value
    }
  }
  return 'I could not find a verified answer in the approved educational sources. Try rephrasing your question about SIP payment failures, mandates, or bank debits.'
}

export function Flex() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [commitments, setCommitments] = useState('')
  const [sipAmt, setSipAmt] = useState('')

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer(null)
    try {
      const ans = getMockFlexAnswer(question)
      setAnswer(ans)
    } catch {
      setAnswer("I'm unable to connect to the AI service right now. Please check your configuration.")
    } finally {
      setLoading(false)
    }
  }

  const inc = Number(income) || 0
  const exp = Number(expenses) || 0
  const comm = Number(commitments) || 0
  const sip = Number(sipAmt) || 0
  const showBreakdown = income && expenses && commitments && sipAmt
  const remainingAfterExp = Math.max(0, inc - exp)
  const availableForSip = Math.max(0, remainingAfterExp - comm)

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4" />
          <button onClick={() => navigate('/dashboard')} className="text-sm text-muted hover:text-text">Back to Dashboard</button>
        </div>

        <h1 className="text-2xl font-bold text-text">SIP Flex</h1>
        <p className="text-sm text-muted">Payment failure education and affordability exploration.</p>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-1">Payment failure explainer</h3>
            <p className="text-sm text-muted mb-4">Why did my SIP instalment fail? What happens after a failed AutoPay?</p>
            <div className="space-y-2 mb-4">
              {[
                'Why did my SIP instalment fail?',
                'What happens after a failed AutoPay?',
                'What does a mandate failure mean?',
                'What happens if my bank account changes?',
                'How can I understand a payment debit issue?',
              ].map((q) => (
                <Button key={q} onClick={() => setQuestion(q)} className="w-full text-left text-sm px-3 py-2.5 border border-border bg-card hover:bg-[#f8fafc]">
                  {q}
                </Button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your payment issue..."
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
                  <CreditCard className="w-4 h-4 text-primary mt-0.5" />
                  <span className="font-medium text-[#166534]">SIP Flex Explanation</span>
                </div>
                <p className="text-sm text-[#166534] leading-relaxed">{answer}</p>
                <p className="text-xs text-[#166534] mt-2">
                  This is educational guidance based on approved sources. It does not identify your specific failure reason unless verified data is available.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-3">SIP affordability explorer</h3>
            <p className="text-sm text-muted mb-4">Educational budgeting aid — not financial advice.</p>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text">Monthly income (₹)</label>
                <input value={income} onChange={(e) => setIncome(e.target.value)} className="input" placeholder="e.g. 50000" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text">Essential monthly expenses (₹)</label>
                <input value={expenses} onChange={(e) => setExpenses(e.target.value)} className="input" placeholder="e.g. 30000" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text">Other commitments (₹)</label>
                <input value={commitments} onChange={(e) => setCommitments(e.target.value)} className="input" placeholder="e.g. 5000" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-text">Monthly SIP contribution (₹)</label>
                <input value={sipAmt} onChange={(e) => setSipAmt(e.target.value)} className="input" placeholder="e.g. 5000" />
              </div>
              {showBreakdown && (
                <div className="mt-4 p-4 rounded bg-[#f8fafc] border border-border">
                  <h4 className="text-sm font-semibold text-text mb-2">Breakdown</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">Remaining after expenses: ₹{remainingAfterExp.toLocaleString()}</div>
                    <div className="flex justify-between">Available for SIP: ₹{availableForSip.toLocaleString()}</div>
                    <div className="flex justify-between text-red-600">
                      {sip <= availableForSip ? 'Within available amount' : `Exceeds available by ₹${(sip - availableForSip).toLocaleString()}`}
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-3">
                    This tool is an educational budgeting aid. It does not tell you to increase, decrease, pause or stop your SIP.
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-3">SIP pause, modification & cancellation</h3>
            <p className="text-sm text-muted mb-4">General process education using verified approved sources.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted">Explains general processes and concepts. Does not perform actual transactions or modify real SIP mandates.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted">Does not instruct users whether to pause, stop or continue investing.</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Disclaimer />
      </div>
      <BottomNav activePath="/flex" />
    </div>
  )
}

