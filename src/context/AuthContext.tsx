import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  setAuthUser,
  clearAuthUser,
  getAuthUser,
  storage,
} from '@/lib/storage'
import type { StoredUser } from '@/lib/storage'

type UserRole = 'learner' | 'mentor' | 'admin'

type Profile = {
  id: string
  email: string
  role: string
  full_name: string | null
}

type AuthContextType = {
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAuthenticated: () => boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getAuthUser()
    if (user) {
      const prof = storage.profiles.findById(user.id)
      setProfile(prof ? { id: prof.id, email: prof.email, role: prof.role, full_name: prof.full_name } : null)
    }
    setLoading(false)
  }, [])

  async function signIn(email: string, _password: string) {
    try {
      const user = storage.profiles.findByEmail(email)
      if (!user) {
        return { error: 'Invalid email or password' }
      }
      const authUser: StoredUser = { ...user, token: 'local-token' }
      setAuthUser(authUser)
      setProfile({ id: user.id, email: user.email, role: user.role, full_name: user.full_name })
      return { error: null }
    } catch {
      return { error: 'Sign in failed' }
    }
  }

  async function signUp(email: string, _password: string, fullName?: string) {
    try {
      if (storage.profiles.findByEmail(email)) {
        return { error: 'Email already registered' }
      }
      const user = storage.profiles.create({
        id: crypto.randomUUID(),
        email,
        role: 'learner',
        full_name: fullName ?? null,
      })
      const authUser: StoredUser = { ...user, token: 'local-token' }
      setAuthUser(authUser)
      setProfile({ id: user.id, email: user.email, role: user.role, full_name: user.full_name })
      return { error: null }
    } catch {
      return { error: 'Sign up failed' }
    }
  }

  async function signOut() {
    clearAuthUser()
    setProfile(null)
  }

  function isAuthenticated() {
    return !!getAuthUser() && !!profile
  }

  function hasRole(role: UserRole) {
    return profile?.role === role
  }

  const value: AuthContextType = {
    profile,
    role: (profile?.role as UserRole) || null,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
