type StoredUser = {
  id: string
  email: string
  role: string
  full_name: string | null
  token: string
}

export type { StoredUser }

const STORAGE_KEYS = {
  AUTH_USER: 'sip_compass_auth_user',
  PROFILES: 'sip_compass_profiles',
  DIAGNOSTIC_SESSIONS: 'sip_compass_diagnostic_sessions',
  RESOLUTION_FEEDBACK: 'sip_compass_resolution_feedback',
  EVIDENCE_RECORDS: 'sip_compass_evidence_records',
  PASSWORD_RESET_TOKENS: 'sip_compass_password_reset_tokens',
}

function generateId() {
  return crypto.randomUUID()
}

export function getAuthUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuthUser(user: StoredUser) {
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
}

export function clearAuthUser() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
}

function getCollection<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setCollection<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

export const storage = {
  profiles: {
    list: () => getCollection<StoredUser>(STORAGE_KEYS.PROFILES),
    findById: (id: string) => getCollection<StoredUser>(STORAGE_KEYS.PROFILES).find((p) => p.id === id) ?? null,
    findByEmail: (email: string) => getCollection<StoredUser>(STORAGE_KEYS.PROFILES).find((p) => p.email === email) ?? null,
    create: (user: Omit<StoredUser, 'token'>) => {
      const list = getCollection<StoredUser>(STORAGE_KEYS.PROFILES)
      const record = { ...user, id: generateId() }
      setCollection(STORAGE_KEYS.PROFILES, [...list, record])
      return record
    },
    updateById: (id: string, updates: Partial<StoredUser>) => {
      const list = getCollection<StoredUser>(STORAGE_KEYS.PROFILES)
      const updated = list.map((p) => (p.id === id ? { ...p, ...updates } : p))
      setCollection(STORAGE_KEYS.PROFILES, updated)
      return updated.find((p) => p.id === id) ?? null
    },
  },
  diagnosticSessions: {
    list: () => getCollection<any>(STORAGE_KEYS.DIAGNOSTIC_SESSIONS),
    create: (record: any) => {
      const list = getCollection<any>(STORAGE_KEYS.DIAGNOSTIC_SESSIONS)
      const item = { ...record, id: generateId(), created: new Date().toISOString(), updated: new Date().toISOString() }
      setCollection(STORAGE_KEYS.DIAGNOSTIC_SESSIONS, [...list, item])
      return item
    },
  },
  resolutionFeedback: {
    create: (record: any) => {
      const list = getCollection<any>(STORAGE_KEYS.RESOLUTION_FEEDBACK)
      const item = { ...record, id: generateId(), created: new Date().toISOString() }
      setCollection(STORAGE_KEYS.RESOLUTION_FEEDBACK, [...list, item])
      return item
    },
  },
  evidenceRecords: {
    list: () => getCollection<any>(STORAGE_KEYS.EVIDENCE_RECORDS),
    create: (record: any) => {
      const list = getCollection<any>(STORAGE_KEYS.EVIDENCE_RECORDS)
      const item = {
        ...record,
        id: generateId(),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      }
      setCollection(STORAGE_KEYS.EVIDENCE_RECORDS, [...list, item])
      return item
    },
  },
  passwordResetTokens: {
    list: () => getCollection<any>(STORAGE_KEYS.PASSWORD_RESET_TOKENS),
    create: (email: string) => {
      const list = getCollection<any>(STORAGE_KEYS.PASSWORD_RESET_TOKENS)
      // Remove any existing tokens for this email
      const filtered = list.filter((t: any) => t.email !== email)
      const token = crypto.randomUUID()
      const item = {
        id: generateId(),
        email,
        token,
        created: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
        used: false,
      }
      setCollection(STORAGE_KEYS.PASSWORD_RESET_TOKENS, [...filtered, item])
      return item
    },
    findByToken: (token: string) => {
      const list = getCollection<any>(STORAGE_KEYS.PASSWORD_RESET_TOKENS)
      return list.find((t: any) => t.token === token && !t.used && new Date(t.expiresAt) > new Date()) ?? null
    },
    markUsed: (token: string) => {
      const list = getCollection<any>(STORAGE_KEYS.PASSWORD_RESET_TOKENS)
      const updated = list.map((t: any) => (t.token === token ? { ...t, used: true } : t))
      setCollection(STORAGE_KEYS.PASSWORD_RESET_TOKENS, updated)
    },
  },
}
