import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BottomNav, Card, CardBody, CardFooter, Button, OutlineButton, ProgressBar, Badge } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'
import { ROUTES, SIMULATED_BADGE } from '@/constants/index'

export function GoalTracker() {
  const navigate = useNavigate()
  const [relevant, setRelevant] = useState<'yes' | 'modify' | null>(null)

  const target = 1000000
  const achieved = 180000
  const pct = Math.round((achieved / target) * 100)

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4" />
          <button onClick={() => navigate('/compass')} className="text-sm text-muted hover:text-text">Back to SIP Compass</button>
        </div>

        <h1 className="text-2xl font-bold text-text">Goal Progress Tracker</h1>
        <p className="text-sm text-muted">Deterministic goal progress and hypothetical projections.</p>

        <Card>
          <CardBody className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-text">First Home Down Payment</h3>
                <p className="text-xs text-muted">Target ₹10,00,000 · by 2032</p>
              </div>
              <Badge variant="teal" className="text-[10px]">{SIMULATED_BADGE}</Badge>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">Accumulated towards target</span>
                <span className="font-medium text-text">₹1,80,000</span>
              </div>
              <ProgressBar value={18} label={`${pct}% completed`} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Target Amount</div>
                <div className="font-medium text-text">₹10,00,000</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Remaining</div>
                <div className="font-medium text-text text-red-600">₹8,20,000</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Monthly contribution</span>
                <span className="font-medium text-text">₹5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Assumed annual return (hypothetical)</span>
                <span className="font-medium text-text text-red-600">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Estimated future corpus</span>
                <span className="font-medium text-text">₹~12,50,000 (illustrative)</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded bg-[#fef3c7] border border-[#f59e0b]/30 text-xs text-[#92400e] leading-relaxed">
              <p className="font-semibold">Assumptions & disclaimer</p>
              <p className="mt-1">The 12% assumption is illustrative only, not an expected or recommended return. Future corpus is a hypothetical projection. Actual returns are uncertain and may differ.</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-3">Goal allocation by SIP</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Nifty 50 Index Fund</span>
                <span className="font-medium text-text">₹5,000 / month</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">Flexi Cap Fund</span>
                <span className="font-medium text-text">₹3,000 / month</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">ELSS Tax Saver</span>
                <span className="font-medium text-text">₹2,000 / month</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5">
            <h3 className="font-semibold text-text mb-3">Is this goal still relevant to your plans?</h3>
            <div className="space-y-3">
              <Button
                onClick={() => setRelevant('yes')}
                disabled={relevant === 'yes'}
                className={`w-full text-left py-3 border-2 rounded-lg ${relevant === 'yes' ? 'border-primary bg-[#e0f2f1] text-primary' : 'border-border text-text hover:border-[#cbd5e1]'}`}
              >
                Yes, on track
              </Button>
              <Button
                onClick={() => setRelevant('modify')}
                disabled={relevant === 'modify'}
                className={`w-full text-left py-3 border-2 rounded-lg ${relevant === 'modify' ? 'border-primary bg-[#e0f2f1] text-primary' : 'border-border text-text hover:border-[#cbd5e1]'}`}
              >
                Want to modify
              </Button>
            </div>
            {relevant === 'modify' && (
              <div className="mt-4 p-4 rounded bg-[#f8fafc] border border-border">
                <p className="text-sm text-muted">Explore changes to hypothetical inputs (monthly contribution, assumed return, target year).</p>
                <Button onClick={() => navigate('/compass')} className="mt-3 w-full text-sm">
                  Back to SIP Compass
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        <CardFooter className="flex gap-2">
          <Button onClick={() => navigate(ROUTES.RESOLUTION)}>Continue to Resolution Check</Button>
          <OutlineButton onClick={() => navigate('/compass')}>Back to SIP Compass</OutlineButton>
        </CardFooter>
      </div>
      <Disclaimer />
      <BottomNav activePath="/goal" />
    </div>
  )
}

