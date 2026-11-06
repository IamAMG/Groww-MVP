import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { BottomNav, Card, CardBody, Button, OutlineButton, Badge } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'
import { storage } from '@/lib/storage'
import { useAuth } from '@/context/AuthContext'

type EvidenceRecord = {
  id: string
  type: string
  platform: string
  theme: string
  feature: string
  severity: string
  verification: string
  quote: string
  date: string
  linkedCase: string | null
}

const MOCK_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'ev-1', type: 'User interview', platform: 'User interview', theme: 'Returns confusion',
    feature: 'SIP Compass', severity: 'High', verification: 'Verified',
    quote: "I don't understand why my portfolio value is less than what I invested.", date: '2024-10-01', linkedCase: 'gs-01',
  },
  {
    id: 'ev-2', type: 'Reddit discussion', platform: 'Reddit', theme: 'Payment failure',
    feature: 'SIP Flex', severity: 'Medium', verification: 'Verified',
    quote: 'My AutoPay failed and I did not know why.', date: '2024-09-20', linkedCase: 'gs-04',
  },
]

const TYPES = ['all', 'User interview', 'App Store/Play Store review', 'Reddit discussion', 'AI failure', 'Golden Set evaluation', 'Resolution feedback', 'Product observation', 'Knowledge source']
const THEMES = ['all', 'Returns confusion', 'Payment failure', 'Goal progress', 'Safety boundaries', 'Other']

function mapDbToEvidence(row: any): EvidenceRecord {
  return {
    id: row.id,
    type: row.evidence_type,
    platform: row.source_platform || 'Unknown',
    theme: row.theme || 'Other',
    feature: row.linked_feature || 'General',
    severity: row.severity || 'Medium',
    verification: row.verification_status,
    quote: row.user_quote || '',
    date: row.date_collected ? new Date(row.date_collected).toISOString().slice(0, 10) : '',
    linkedCase: row.related_golden_set_case_id ?? null,
  }
}

export function EvidenceLog() {
  const { profile } = useAuth()
  const [evidence, setEvidence] = useState<EvidenceRecord[]>(MOCK_EVIDENCE)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterTheme, setFilterTheme] = useState('all')
  const [newType, setNewType] = useState('')
  const [newTheme, setNewTheme] = useState('')
  const [newQuote, setNewQuote] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    loadEvidence()
  }, [])

  async function loadEvidence() {
    setLoading(true)
    try {
      const records = storage.evidenceRecords.list()
      if (records) {
        setEvidence(records.map(mapDbToEvidence))
      }
    } catch {
      // localStorage unavailable — keep mock data
    } finally {
      setLoading(false)
    }
  }

  function handleExportCSV() {
    if (filtered.length === 0) return
    const headers = ['ID', 'Type', 'Theme', 'Feature', 'Severity', 'Verification', 'Quote', 'Date', 'Linked Case']
    const rows = filtered.map((e) => [
      e.id,
      e.type,
      e.theme,
      e.feature,
      e.severity,
      e.verification,
      `"${(e.quote || '').replace(/"/g, '""')}"`,
      e.date,
      e.linkedCase || '',
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `sip-compass-evidence-log-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = evidence.filter(
    (e) =>
      (filterType === 'all' || e.type === filterType) &&
      (filterTheme === 'all' || e.theme === filterTheme) &&
      (e.quote.toLowerCase().includes(search.toLowerCase()) || e.feature.toLowerCase().includes(search.toLowerCase()))
  )

  async function handleAdd() {
    if (!newType || !newTheme || !newQuote) return
    if (!profile?.id) return
    setAdding(true)
    try {
      storage.evidenceRecords.create({
        evidence_type: newType,
        theme: newTheme,
        user_quote: newQuote,
        verification_status: 'unverified',
        researcher_notes: 'Added via Evidence Log UI',
      })
      setNewType('')
      setNewTheme('')
      setNewQuote('')
      await loadEvidence()
    } catch {
      // write failed
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-20 px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-text">Evidence Log</h1>
            <p className="text-sm text-muted">Central research and product-learning repository.</p>
          </div>
          {profile && (
            <div className="flex items-center gap-2">
              <Button onClick={handleExportCSV} className="text-sm px-3 py-2 flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </Button>
              <Button onClick={() => window.print()} className="text-sm px-3 py-2 flex items-center gap-2">
                Print
              </Button>
              <Button onClick={() => setAdding(!adding)} className="text-sm px-3 py-2">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                {adding ? 'Cancel' : 'Add Evidence'}
              </Button>
            </div>
          )}
        </div>

        {adding && profile && (
          <Card>
            <CardBody className="p-5">
              <h3 className="font-semibold text-text mb-4">Add Evidence Record</h3>
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Type</label>
                  <select value={newType} onChange={(e) => setNewType(e.target.value)} className="input">
                    <option value="">Select type</option>
                    {TYPES.slice(1).map((t) => ( <option key={t} value={t}>{t}</option> ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Theme</label>
                  <select value={newTheme} onChange={(e) => setNewTheme(e.target.value)} className="input">
                    <option value="">Select theme</option>
                    {THEMES.slice(1).map((t) => ( <option key={t} value={t}>{t}</option> ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-text">Quote / Observation</label>
                  <textarea value={newQuote} onChange={(e) => setNewQuote(e.target.value)} className="input min-h-[80px]" placeholder="Enter user quote or observation..." />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} disabled={adding} className="w-auto">
                    {adding ? 'Adding…' : 'Save'}
                  </Button>
                  <OutlineButton onClick={() => setAdding(false)} className="w-auto">Cancel</OutlineButton>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text">Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input" placeholder="Search quotes, features..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text">Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="input">
              {TYPES.map((t) => ( <option key={t} value={t}>{t}</option> ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text">Theme</label>
            <select value={filterTheme} onChange={(e) => setFilterTheme(e.target.value as any)} className="input">
              {THEMES.map((t) => ( <option key={t} value={t}>{t}</option> ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-muted uppercase tracking-wider">
                <th className="pb-3 font-medium text-text">ID</th>
                <th className="pb-3 font-medium text-text">Type</th>
                <th className="pb-3 font-medium text-text">Theme</th>
                <th className="pb-3 font-medium text-text">Feature</th>
                <th className="pb-3 font-medium text-text">Severity</th>
                <th className="pb-3 font-medium text-text">Verification</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-muted">Loading evidence…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-muted">No evidence records found.</td></tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b border-border hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 text-sm font-medium text-text">{e.id}</td>
                    <td className="p-3 text-sm text-muted">{e.type}</td>
                    <td className="p-3 text-sm text-muted">{e.theme}</td>
                    <td className="p-3 text-sm text-muted">{e.feature}</td>
                    <td className="p-3 text-sm"><Badge variant="slate" className="text-[10px]">{e.severity}</Badge></td>
                    <td className="p-3 text-sm"><Badge variant="teal" className="text-[10px]">{e.verification}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-text mb-3">Sample detail</h3>
            <Card>
              <CardBody className="p-5">
                <p className="text-sm italic text-muted">{`"${filtered[0].quote}"`}</p>
                <p className="text-sm text-muted mt-2">{filtered[0].platform} · {filtered[0].date}</p>
                <p className="text-sm text-muted mt-1">Linked Golden Set case: {filtered[0].linkedCase || 'None'}</p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
      <Disclaimer variant="evidence" />
      <BottomNav activePath="/evidence" />
    </div>
  )
}
