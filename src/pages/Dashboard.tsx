import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, AlertCircle, CreditCard, PiggyBank, Bot, ShieldAlert, Home, User, LogOut, Menu } from 'lucide-react'
import { BottomNav, Card, CardBody, CardFooter, Button, OutlineButton, ProgressBar, Badge } from '@/components/Layout'
import { Disclaimer } from '@/components/Disclaimer'
import { INITIAL_PORTFOLIO, INITIAL_SIPS, ROUTES, SIMULATED_BADGE } from '@/constants/index'
import { useAuth } from '@/context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function Dashboard() {
  const navigate = useNavigate()
  const { signOut, hasRole } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const portfolioHistory = [
    { month: 'Jan', value: 135000 },
    { month: 'Feb', value: 138000 },
    { month: 'Mar', value: 142000 },
    { month: 'Apr', value: 140000 },
    { month: 'May', value: 145000 },
    { month: 'Jun', value: 142500 },
  ]

  const goalProgress = [
    { name: 'Achieved', value: 180000 },
    { name: 'Remaining', value: 820000 },
  ]

  const sipAllocation = [
    { name: 'Nifty 50 Index Fund', value: 5000 },
    { name: 'Flexi Cap Fund', value: 3000 },
    { name: 'ELSS Tax Saver', value: 2000 },
  ]

  const COLORS = ['#2563eb', '#10b981', '#f59e0b']

  const handleSignOut = async () => {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

      return (
        <div className="min-h-screen bg-surface pb-20">
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex flex-col lg:hidden">
              <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <div className="relative z-50 w-full max-w-xs bg-card border-l border-border shadow-2xl transform transition-transform duration-300 translate-x-full md:translate-x-0">
                <div className="p-4 flex justify-between items-center border-b border-border">
                  <h2 className="text-lg font-bold text-text flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> SIP Compass
                  </h2>
                  <Button onClick={() => setMobileMenuOpen(false)} className="text-sm p-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </Button>
                </div>
                <nav className="p-4 space-y-1">
                  <Button
                    onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.DASHBOARD); }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left bg-[#e0f2f1] text-primary border border-primary/20"
                  >
                    <Home className="w-5 h-5" /> Explore Dashboard
                  </Button>
                  <OutlineButton onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.DIAGNOSTIC); }} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                    <AlertCircle className="w-5 h-5" /> SIP Health Diagnostic
                  </OutlineButton>
                  <OutlineButton onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.COMPASS); }} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                    <TrendingUp className="w-5 h-5" /> SIP Compass
                  </OutlineButton>
                  <OutlineButton onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.GOAL); }} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                    <PiggyBank className="w-5 h-5" /> Goal Progress
                  </OutlineButton>
                  <OutlineButton onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.FLEX); }} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                    <CreditCard className="w-5 h-5" /> SIP Flex
                  </OutlineButton>
                  {(hasRole('mentor') || hasRole('admin')) && (
                    <OutlineButton onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.EVALUATIONS); }} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                      <Bot className="w-5 h-5" /> Evaluation Centre
                    </OutlineButton>
                  )}
                  {hasRole('admin') && (
                    <OutlineButton onClick={() => { setMobileMenuOpen(false); navigate(ROUTES.EVIDENCE); }} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                      <ShieldAlert className="w-5 h-5" /> Evidence Log
                    </OutlineButton>
                  )}
                </nav>
                <div className="p-4 border-t border-border mt-auto">
                  <Button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} className="w-full text-sm">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
          <header className="md:pl-64 md:fixed top-0 left-0 h-screen border-r border-border w-64 bg-card z-30 transform transition-transform duration-300 md:translate-x-0 -translate-x-full">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> SIP Compass
          </h2>
          <p className="text-xs text-muted mt-1">AI-native SIP discovery & education</p>
        </div>
        <nav className="p-4 space-y-1">
          <Button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full flex items-center gap-3 px-3 py-3 text-left bg-[#e0f2f1] text-primary border border-primary/20"
          >
            <Home className="w-5 h-5" /> Explore Dashboard
          </Button>
          <OutlineButton onClick={() => navigate(ROUTES.DIAGNOSTIC)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
            <AlertCircle className="w-5 h-5" /> SIP Health Diagnostic
          </OutlineButton>
          <OutlineButton onClick={() => navigate(ROUTES.COMPASS)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
            <TrendingUp className="w-5 h-5" /> SIP Compass
          </OutlineButton>
          <OutlineButton onClick={() => navigate(ROUTES.GOAL)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
            <PiggyBank className="w-5 h-5" /> Goal Progress
          </OutlineButton>
          <OutlineButton onClick={() => navigate(ROUTES.FLEX)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
            <CreditCard className="w-5 h-5" /> SIP Flex
          </OutlineButton>
          {(hasRole('mentor') || hasRole('admin')) && (
            <OutlineButton onClick={() => navigate(ROUTES.EVALUATIONS)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
              <Bot className="w-5 h-5" /> Evaluation Centre
            </OutlineButton>
          )}
          {hasRole('admin') && (
            <OutlineButton onClick={() => navigate(ROUTES.EVIDENCE)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
              <ShieldAlert className="w-5 h-5" /> Evidence Log
            </OutlineButton>
          )}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <Button onClick={handleSignOut} className="w-full text-sm">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="md:pl-64 px-4 py-6">
        <div className="md:flex md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text">Explore</h1>
            <p className="text-muted">Your SIP discovery and education centre</p>
          </div>
          <div className="flex gap-2">
            <Button className="text-sm px-3 py-2" onClick={() => navigate(ROUTES.PROFILE)}>
              <User className="w-4 h-4 mr-2" /> Profile
            </Button>
            <Button className="text-sm px-3 py-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardBody className="p-5">
            <div className="flex items-end gap-4 mb-4">
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Mutual Fund Portfolio</div>
                <Badge variant="teal" className="text-[10px]">{SIMULATED_BADGE}</Badge>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-xs text-muted uppercase tracking-wider">Today</div>
                <div className="text-sm font-medium text-text">₹{INITIAL_PORTFOLIO.oneDayReturns.toLocaleString()}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-border">
                <div className="text-xs text-muted uppercase tracking-wider">Current Value</div>
                <div className="text-xl font-bold text-text">₹{INITIAL_PORTFOLIO.portfolioValue.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-border">
                <div className="text-xs text-muted uppercase tracking-wider">Total Invested</div>
                <div className="text-xl font-bold text-text">₹{INITIAL_PORTFOLIO.totalInvested.toLocaleString()}</div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-3 text-sm mt-4">
              <span className={`font-medium ${INITIAL_PORTFOLIO.oneDayReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {INITIAL_PORTFOLIO.oneDayReturns >= 0 ? '+' : ''}₹{Math.abs(INITIAL_PORTFOLIO.oneDayReturns).toLocaleString()} today
              </span>
              <span className="text-muted">·</span>
              <span className="font-medium text-text">{INITIAL_PORTFOLIO.activeSIPCount} active SIPs</span>
            </div>
          </CardBody>
        </Card>

        <Card className="mb-6">
          <CardBody className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-text">First Home Down Payment</h3>
                <p className="text-xs text-muted">Target: ₹10,00,000 · by 2032</p>
              </div>
              <Badge variant="teal" className="text-[10px]">{SIMULATED_BADGE}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <ProgressBar value={18} label="Goal completion" />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted">Amount achieved</span>
                  <span className="font-medium text-text">₹1,80,000</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted">Monthly contribution</span>
                  <span className="font-medium text-text">₹5,000 / month</span>
                </div>
              </div>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={goalProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {goalProgress.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="mb-6">
          <CardBody className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-[#e0f2f1] text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text">Need help understanding your SIP?</h3>
                <p className="text-sm text-muted mt-1">
                  Get clarity on returns projection, goal milestone gaps, and quick fixes for missed instalment payments.
                </p>
              </div>
            </div>
            <CardFooter>
              <Button onClick={() => navigate(ROUTES.DIAGNOSTIC)} className="w-full">
                Explore SIP Health <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Button>
            </CardFooter>
          </CardBody>
        </Card>

        <Card className="mb-6">
          <CardBody className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-text">My SIPs</h3>
              <Badge variant="teal" className="text-[10px]">{SIMULATED_BADGE}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sipAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {sipAllocation.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Allocation</h4>
                {sipAllocation.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-text">{item.name}</span>
                    </div>
                    <span className="font-medium text-text">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {INITIAL_SIPS.map((sip) => (
                <div key={sip.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-border">
                  <div className="flex-1">
                    <div className="font-medium text-text">{sip.schemeName}</div>
                    <div className="text-xs text-muted">₹{sip.monthlyContribution.toLocaleString()} / month</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${sip.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {sip.status === 'active' ? 'Active' : 'Failed'}
                    </span>
                    {sip.status === 'failed' ? (
                      <Button onClick={() => navigate(ROUTES.FLEX)} className="text-xs px-2 py-1.5 gap-1" style={{ padding: '0.25rem 0.75rem' }}>
                        <CreditCard className="w-3 h-3" /> Fix with SIP Flex
                      </Button>
                    ) : (
                      <OutlineButton onClick={() => {}} className="text-xs px-2 py-1.5 gap-1" style={{ padding: '0.25rem 0.75rem' }} disabled>
                        Manage
                      </OutlineButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Disclaimer />
          </CardBody>
        </Card>
      </div>

      <BottomNav activePath="/dashboard" />
    </div>
  )
}
