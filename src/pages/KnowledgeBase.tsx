import { BottomNav, Card, CardBody } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'

export function KnowledgeBase() {
  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardBody className="p-5">
            <h1 className="text-xl font-bold text-text mb-2">Knowledge Base</h1>
            <p className="text-sm text-muted mb-4">Approved educational sources used for AI retrieval.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded bg-[#f8fafc] border border-border">
                <div className="flex-1">
                  <div className="font-medium text-text">SEBI Investor Education</div>
                  <div className="text-xs text-muted">SIP fundamentals · Approved</div>
                </div>
                <BadgeEl variant="teal" className="text-[10px]">Approved</BadgeEl>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-[#f8fafc] border border-border">
                <div className="flex-1">
                  <div className="font-medium text-text">AMFI Educational Material</div>
                  <div className="text-xs text-muted">Mutual fund basics · Approved</div>
                </div>
                <BadgeEl variant="teal" className="text-[10px]">Approved</BadgeEl>
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Only approved sources can be retrieved for user-facing answers.</p>
          </CardBody>
        </Card>
      </div>
      <Disclaimer />
      <BottomNav activePath="/kb" />
    </div>
  )
}

function BadgeEl({ className = '', variant = 'slate', children }: { className?: string; variant?: 'teal' | 'slate'; children: React.ReactNode }) {
  const base = variant === 'teal' ? 'badge-teal' : 'badge-slate'
  return <span className={`${base} ${className}`}>{children}</span>
}


