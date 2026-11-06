import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { BottomNav, Card, CardBody, CardFooter, Button, OutlineButton } from '@/components/Layout'
import { storage } from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'

export function Resolution() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [step, setStep] = useState<'q1' | 'q2' | 'feedback' | 'done'>('q1')
  const [rating, setRating] = useState<number | null>(null)
  const [resolved, setResolved] = useState<'yes' | 'no' | null>(null)
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const sessionId = localStorage.getItem('diagnostic_session_id')
      if (profile?.id && sessionId) {
        storage.resolutionFeedback.create({
          user_id: profile.id,
          diagnostic_session_id: sessionId,
          rating,
          resolved: resolved === 'yes',
          feedback: feedback || null,
        })
      }
    } catch {
      // Supabase not configured or write failed — continue without persistence
    } finally {
      setSaving(false)
    }
    setStep('done')
  }

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4" />
          <button onClick={() => navigate('/goal')} className="text-sm text-muted hover:text-text">Back to Goal</button>
        </div>

        <h1 className="text-2xl font-bold text-text">Resolution Check</h1>
        <p className="text-sm text-muted">Did we help resolve your concern?</p>

        {step === 'q1' && (
          <Card>
            <CardBody className="p-5">
              <h3 className="font-semibold text-text mb-4">Question 1 of 2</h3>
              <p className="text-sm text-muted mb-6">How clear was the diagnostic guidance?</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    onClick={() => setRating(star)}
                    disabled={rating === star}
                    className={`w-full py-3 rounded-lg border text-sm font-medium transition-colors ${
                      rating === star ? 'border-primary bg-[#e0f2f1] text-primary' : 'border-border text-text hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    }`}
                  >
                    {star}
                  </Button>
                ))}
              </div>
              {rating && <p className="mt-3 text-sm text-muted">You rated {rating}/5</p>}
            </CardBody>
            <CardFooter className="flex justify-between">
              <OutlineButton onClick={() => navigate('/goal')}>Back</OutlineButton>
              <Button onClick={() => (rating ? setStep('q2') : null)} disabled={!rating || saving}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'q2' && (
          <Card>
            <CardBody className="p-5">
              <h3 className="font-semibold text-text mb-4">Question 2 of 2</h3>
              <p className="text-sm text-muted mb-6">Is your concern fully resolved?</p>
              <div className="space-y-3">
                <Button
                  onClick={() => setResolved('yes')}
                  disabled={resolved === 'yes'}
                  className={`w-full text-left py-3 rounded-lg border-2 ${resolved === 'yes' ? 'border-primary bg-[#e0f2f1] text-primary' : 'border-border text-text hover:border-[#cbd5e1]'}`}
                >
                  <CheckCircle className="w-5 h-5 mr-3" /> Yes, all set.
                </Button>
                <Button
                  onClick={() => setResolved('no')}
                  disabled={resolved === 'no'}
                  className={`w-full text-left py-3 rounded-lg border-2 ${resolved === 'no' ? 'border-primary bg-[#e0f2f1] text-primary' : 'border-border text-text hover:border-[#cbd5e1]'}`}
                >
                  <AlertCircle className="w-5 h-5 mr-3" /> Not yet – need help.
                </Button>
              </div>
            </CardBody>
            <CardFooter className="flex justify-between">
              <OutlineButton onClick={() => setStep('q1')}>Back</OutlineButton>
              <Button onClick={() => (resolved ? setStep('feedback') : null)} disabled={!resolved || saving}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'feedback' && (
          <Card>
            <CardBody className="p-5">
              <h3 className="font-semibold text-text mb-4">Feedback</h3>
              {resolved === 'yes' ? (
                <>
                  <div className="flex items-start gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-green-700 font-medium">Thank you! We're glad we could help.</span>
                  </div>
                  <p className="text-sm text-muted mb-4">Optional: what did you like or what could be simplified?</p>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <span className="text-amber-700 font-medium">We're sorry we couldn't fully resolve your concern.</span>
                  </div>
                  <p className="text-sm text-muted mb-4">Please tell us what remains unclear so we can improve.</p>
                </>
              )}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your feedback..."
                className="w-full border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              />
            </CardBody>
            <CardFooter className="flex justify-between">
              <OutlineButton onClick={() => setStep('q2')}>Back</OutlineButton>
              <Button onClick={handleSubmit} disabled={saving} className="w-auto">
                Submit {saving && <span className="ml-2 text-xs">saving…</span>} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'done' && (
          <Card>
            <CardBody className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#e0f2f1] text-primary flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-text mb-2">Thank you for your feedback</h2>
              <p className="text-sm text-muted mb-6">Your response has been recorded and will help us improve SIP Compass.</p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Return to SIP Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
      <BottomNav activePath="/resolution" />
    </div>
  )
}
