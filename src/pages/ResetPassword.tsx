import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowRight } from 'lucide-react'
import { Card, CardBody, CardFooter, Button, OutlineButton } from '@/components/Layout'
import { ROUTES } from '@/constants/index'
import { storage } from '@/lib/storage'

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const isValidToken = token && storage.passwordResetTokens.findByToken(token)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isValidToken) {
        setError('Invalid or expired reset link.')
        setLoading(false)
        return
      }
      if (!newPassword || !confirmPassword) {
        setError('Please fill in both password fields.')
        setLoading(false)
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.')
        setLoading(false)
        return
      }
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters.')
        setLoading(false)
        return
      }

      const resetRecord = storage.passwordResetTokens.findByToken(token!)
      if (!resetRecord) {
        setError('Invalid or expired reset link.')
        setLoading(false)
        return
      }

      const user = storage.profiles.findByEmail(resetRecord.email)
      if (!user) {
        setError('Account not found.')
        setLoading(false)
        return
      }

      storage.passwordResetTokens.markUsed(token!)
      storage.profiles.updateById(user.id, { ...user, token: newPassword })
      setResetDone(true)
      setLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (resetDone) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text">Password Reset</h2>
              <p className="text-sm text-muted mt-2">Your password has been reset successfully.</p>
            </div>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate(ROUTES.LOGIN)} className="w-full">Sign In</Button>
            </CardFooter>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <Lock className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text">Invalid Reset Link</h2>
              <p className="text-sm text-muted mt-2">This reset link is invalid or has expired.</p>
            </div>
            <CardFooter className="flex justify-center">
              <OutlineButton onClick={() => navigate(ROUTES.FORGOT_PASSWORD)} className="w-full">
                Request New Link <ArrowRight className="w-4 h-4 ml-2" />
              </OutlineButton>
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
            <h1 className="text-2xl font-bold text-text">Reset Password</h1>
            <p className="text-sm text-muted mt-2">Enter your new password below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
                placeholder="••••••••"
              />
            </div>
            {error && <div className="p-2 rounded bg-[#fee2e2] border border-[#fecaca] text-xs text-[#991b1b]">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
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
