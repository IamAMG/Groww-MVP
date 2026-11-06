import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardFooter, Button, OutlineButton } from '@/components/Layout'
import { ROUTES } from '@/constants/index'
import { useAuth } from '@/context/AuthContext'

export function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await signUp(email, password, fullName)
      if (err) setError(err)
      else navigate(ROUTES.DASHBOARD)
    } catch {
      setError('Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text">Create account</h1>
            <p className="text-sm text-muted">Join SIP Compass</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Full name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
            </div>
            {error && <div className="p-2 rounded bg-[#fee2e2] border border-[#fecaca] text-xs text-[#991b1b]">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <CardFooter className="pt-4">
            <p className="text-sm text-center text-muted">Already have an account?</p>
            <OutlineButton onClick={() => navigate(ROUTES.LOGIN)} className="w-full">Sign in</OutlineButton>
          </CardFooter>
        </CardBody>
      </Card>
    </div>
  )
}
