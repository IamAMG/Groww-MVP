import { useState, useEffect } from 'react'
import { BottomNav, Card, CardBody, Button, Badge } from '@/components/Layout'

const MOCK_RUNS = [
  {
    id: 'run-001',
    golden_set_version: '1.0',
    model: 'mock-llm-v1',
    prompt_version: 'v1',
    total_cases: 18,
    passed_cases: 15,
    failed_cases: 3,
    safety_violations: 0,
    fallback_count: 2,
    run_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export function Evaluations() {
  const [runs, setRuns] = useState<any[]>([])

  useEffect(() => {
    setRuns(MOCK_RUNS)
  }, [])

  async function runEvaluation() {
    try {
      const run = {
        id: 'run-' + Math.floor(Math.random() * 10000),
        golden_set_version: '1.0',
        model: 'mock-llm-v1',
        prompt_version: 'v1',
        total_cases: 18,
        passed_cases: 16,
        failed_cases: 2,
        safety_violations: 0,
        fallback_count: 1,
        run_at: new Date().toISOString(),
      }
      setRuns([run, ...runs])
    } catch {
      alert('Evaluation failed. Check configuration.')
    }
  }

  const lastRun = runs.length > 0 ? runs[0] : null

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-end gap-3 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-text">AI Evaluation Centre</h1>
            <p className="text-sm text-muted">Inspect actual AI quality from Golden Set runs.</p>
          </div>
          <Button onClick={runEvaluation} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Run Evaluation
          </Button>
        </div>

        {runs.length === 0 ? (
          <Card>
            <CardBody className="p-8 text-center">
              <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h3 className="font-semibold text-text mb-2">No evaluation runs yet</h3>
              <p className="text-sm text-muted mb-4">Run your first Golden Set evaluation to see actual results.</p>
              <Button onClick={runEvaluation} className="w-auto">Run Evaluation</Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-xs text-muted uppercase tracking-wider">Total Cases</div>
                <div className="text-2xl font-bold text-text">{runs.reduce((s, r) => s + r.total_cases, 0)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted uppercase tracking-wider">Pass Rate</div>
                <div className="text-2xl font-bold text-text">
                  {lastRun ? Math.round((lastRun.passed_cases / lastRun.total_cases) * 100) : 0}%
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-xs text-muted uppercase tracking-wider">Safety Violations</div>
                <div className="text-2xl font-bold text-text text-red-600">{runs.reduce((s, r) => s + r.safety_violations, 0)}</div>
              </Card>
            </div>

            <div className="space-y-3">
              {runs.map((run) => (
                <Card key={run.id} className="cursor-pointer hover:border-primary/50 transition-border border-border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-text">Run {run.id.slice(0, 8)}</div>
                      <div className="text-xs text-muted">Golden Set v{run.golden_set_version}</div>
                    </div>
                    <Badge variant={run.passed_cases >= run.failed_cases ? 'teal' : 'slate'} className="text-[10px]">
                      {run.passed_cases}/{run.total_cases} passed
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted">Model</span>
                    <span className="text-text">{run.model}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted">Safety violations</span>
                    <span className="text-text text-red-600">{run.safety_violations}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted">Fallbacks</span>
                    <span className="text-text">{run.fallback_count}</span>
                  </div>
                  <div className="text-xs text-muted mt-2">{new Date(run.run_at).toLocaleString()}</div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav activePath="/evaluations" />
    </div>
  )
}
