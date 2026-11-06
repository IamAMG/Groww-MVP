import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Card, CardBody, CardFooter, Button, OutlineButton } from '@/components/Layout'
import { ROUTES } from '@/constants/index'
import { storage } from '@/lib/storage'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = storage.profiles.findByEmail(email)
      if (!user) {
        setSent(true)
        setLoading(false)
        return
      }
      storage.passwordResetTokens.create(email)
      setSent(true)
      setLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text">Reset instructions sent</h2>
              <p className="text-sm text-muted mt-2">
                If an account exists for {email}, you will receive a password reset link.
              </p>
            </div>
            <CardFooter className="flex justify-center">
              <OutlineButton onClick={() => navigate(ROUTES.LOGIN)} className="w-full">Back to Sign In</OutlineButton>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <Lock className="w-8 h-8 text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text">Forgot Password</h1>
            <p className="text-sm text-muted mt-2">Enter your email and we’ll send reset instructions.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                placeholder="you@example.com"
              />
            </div>
            {error && <div className="p-2 rounded bg-[#fee2e2] border border-[#fecaca] text-xs text-[#991b1b]">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <CardFooter className="pt-4">
            <p className="text-sm text-center text-muted">Remember your password?</p>
            <OutlineButton onClick={() => navigate(ROUTES.LOGIN)} className="w-full">Back to Sign In</OutlineButton>
          </CardFooter>
        </CardBody>
      </Card>
    </div>
  )
}
