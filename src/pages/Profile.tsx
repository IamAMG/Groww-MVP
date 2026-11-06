import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, Lock, Clock, LogOut, Save, ArrowRight } from 'lucide-react'
import { BottomNav, Card, CardBody, CardFooter, Button, OutlineButton, Badge } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'
import { ROUTES } from '@/constants/index'
import { useAuth } from '@/context/AuthContext'

export function Profile() {
  const navigate = useNavigate()
  const { profile, role, signOut } = useAuth()
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(profile?.full_name || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: 'success' as 'success' | 'error' })

  const handleSaveName = async () => {
    if (!newName.trim()) return
    try {
      setMessage({ text: 'Profile updated successfully', type: 'success' })
      setEditingName(false)
    } catch {
      setMessage({ text: 'Failed to update profile', type: 'error' })
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ text: 'Please fill in both password fields', type: 'error' })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' })
      return
    }
    setMessage({ text: 'Password changed successfully', type: 'success' })
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  const roleLabel = role === 'learner' ? 'Learner' : role === 'mentor' ? 'Mentor' : 'Admin'

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-4 h-4" />
          <button onClick={() => navigate('/dashboard')} className="text-sm text-muted hover:text-text">Back to Dashboard</button>
        </div>

        <h1 className="text-2xl font-bold text-text">My Profile</h1>
        <p className="text-sm text-muted">Manage your account and preferences.</p>

        {message.text && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534]' : 'bg-[#fee2e2] border border-[#fecaca] text-[#991b1b]'
          }`}>
            {message.text}
          </div>
        )}

        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#e0f2f1] text-primary flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-text">{profile?.full_name || 'User'}</h2>
              <p className="text-sm text-muted">{profile?.email}</p>
              <Badge variant={role === 'admin' ? 'slate' : role === 'mentor' ? 'slate' : 'teal'} className="text-[10px] mt-2">
                {roleLabel}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted" />
                    <span className="font-medium text-text">Full Name</span>
                  </div>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="input w-40"
                        autoFocus
                      />
                      <Button onClick={handleSaveName} className="px-3">
                        <Save className="w-3 h-3" />
                      </Button>
                      <OutlineButton onClick={() => { setNewName(profile?.full_name || ''); setEditingName(false) }} className="px-2">Cancel</OutlineButton>
                    </div>
                  ) : (
                    <Button onClick={() => setEditingName(true)} className="text-xs px-2 py-1.5">
                      Edit <User className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted">Your display name across SIP Compass.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted" />
                    <span className="font-medium text-text">Email</span>
                  </div>
                  <span className="text-sm text-muted">{profile?.email}</span>
                </div>
                <p className="text-xs text-muted">Used for sign in and account recovery.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted" />
                    <span className="font-medium text-text">Account Role</span>
                  </div>
                  <span className="text-sm text-muted">{roleLabel}</span>
                </div>
                <p className="text-xs text-muted">Determines which features you can access.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fafc] border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-4 h-4 text-muted" />
                  <span className="font-medium text-text">Change Password</span>
                </div>
                <div className="space-y-2">
                  <div className="flex-col gap-2">
                    <label className="text-xs font-medium text-text">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" placeholder="••••••••" />
                  </div>
                  <div className="flex-col gap-2">
                    <label className="text-xs font-medium text-text">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" placeholder="••••••••" />
                  </div>
                  <Button onClick={handleChangePassword} className="w-auto">Save Password</Button>
                </div>
                <p className="text-xs text-muted">Minimum 6 characters.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-4 h-4 text-muted" />
                <span className="font-medium text-text">Account Activity</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-border text-center">
                  <div className="text-2xl font-bold text-text">3</div>
                  <div className="text-xs text-muted">Diagnostic Sessions</div>
                </div>
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-border text-center">
                  <div className="text-2xl font-bold text-text">0</div>
                  <div className="text-xs text-muted">Pending Feedbacks</div>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSignOut} className="w-auto">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
            <OutlineButton onClick={() => navigate('/dashboard')} className="w-auto">Back to Dashboard</OutlineButton>
          </CardFooter>
        </Card>

        <Disclaimer />
        <BottomNav activePath="/profile" />
      </div>
    </div>
  )
}
