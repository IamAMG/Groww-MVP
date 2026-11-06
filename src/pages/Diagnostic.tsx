import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BottomNav, CardFooter, Button } from '@/components/Layout'
import { Badge } from '@/components/Badge'
import { Disclaimer } from '@/components/Disclaimer'
import { ROUTES } from '@/constants/index'
import { storage } from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'

const OPTIONS = [
  { id: 'returns', title: 'Returns Variance', description: 'Why are my current portfolio returns lower or higher than expected?', module: 'SIP Compass' },
  { id: 'payment', title: 'Payment and Debit Issues', description: 'AutoPay failed, bank account changed, or I need to understand payment issues.', module: 'SIP Flex' },
  { id: 'goal', title: 'Goal Milestones Check', description: 'Am I accumulating enough for my future targets like home or retirement?', module: 'Goal Tracker' },
  { id: 'fund', title: 'Scheme and Asset Allocation', description: 'Understanding fund allocation, expense ratios and fund managers.', module: 'Fund Health' },
]

export function Diagnostic() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const option = OPTIONS.find((o) => o.id === selected)
      if (profile?.id) {
        const record = storage.diagnosticSessions.create({
          user_id: profile.id,
          concern: option?.title || selected,
          status: 'pending',
        })
        if (record) {
          localStorage.setItem('diagnostic_session_id', record.id)
        }
      }
    } catch {
      // Supabase not configured or write failed — continue without persistence
    } finally {
      setSaving(false)
    }

    if (selected === 'returns') navigate(ROUTES.COMPASS)
    else if (selected === 'payment') navigate(ROUTES.FLEX)
    else if (selected === 'goal') navigate(ROUTES.GOAL)
    else navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <Badge variant="teal" className="text-[10px]">SIP Discovery Diagnostic</Badge>
          <h1 className="text-2xl font-bold text-text mt-2">SIP Health Diagnostic</h1>
          <p className="text-sm text-muted mt-1">Let's make your SIP easier to understand.</p>
          <p className="text-sm text-muted mt-1">What would you like clarity on today? Pick the topic that best matches your concern.</p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full card p-4 rounded-card border-2 transition-all ${selected === option.id ? 'border-primary bg-[#e0f2f1]' : 'border-border hover:border-[#cbd5e1] hover:bg-[#f8fafc]'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${selected === option.id ? 'bg-primary text-white' : 'bg-[#f1f5f9] text-muted'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="slate">{option.module}</Badge>
                  </div>
                  <h3 className="font-semibold text-text">{option.title}</h3>
                  <p className="text-sm text-muted mt-1">{option.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border ${selected === option.id ? 'border-primary bg-primary' : 'border-border bg-card'}`}>
                  {selected === option.id && <div className="w-3 h-3 bg-white rounded-full mx-auto" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        <CardFooter>
          <Button onClick={handleContinue} disabled={!selected || saving} className="w-full">
            Continue {selected ? <ArrowRight className="w-4 h-4 ml-2" /> : null}
            {saving && <span className="ml-2 text-xs">saving…</span>}
          </Button>
          <p className="text-xs text-muted text-center mt-3">Select a concern to continue</p>
        </CardFooter>
      </div>
      <BottomNav activePath="/diagnostic" />
      <Disclaimer />
    </div>
  )
}
