export { Button } from './Button'
export { OutlineButton } from './Button'
export { Badge } from './Badge'
export { Card, CardHeader, CardBody, CardFooter } from './Card'
export { ProgressBar } from './ProgressBar'
export { DiagnosticCard, SimulatedBadge } from './DiagnosticCard'
export { Disclaimer } from './Disclaimer'

import { Bell, Search, User, ArrowLeft, Home, RefreshCw, LogOut, Menu, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button as Btn } from './Button'
import { ROUTES } from '@/constants/index'

const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Explore', icon: Home },
  { path: '/investments', label: 'Investments', icon: RefreshCw },
  { path: '/pay', label: 'Pay', icon: RefreshCw },
  { path: ROUTES.DASHBOARD, label: 'Account', icon: User },
]

export function Header({ title, showBack = false, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) {
  const location = useLocation()
  const hideHeader = location.pathname === ROUTES.DASHBOARD || location.pathname === '/'
  if (hideHeader) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      {showBack && onBack ? (
        <Btn onClick={onBack} className="px-2 py-1.5 text-sm gap-2" style={{ padding: '0.375rem 0.5rem' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Btn>
      ) : null}
      <h1 className="text-lg font-semibold text-text">{title}</h1>
      <div className="flex items-center gap-3">
        <Btn className="px-2 py-1.5 gap-1 text-sm" style={{ padding: '0.375rem 0.5rem' }}>
          <Search className="w-4 h-4" /> Search
        </Btn>
        <Btn className="px-2 py-1.5 gap-1 text-sm" style={{ padding: '0.375rem 0.5rem' }}>
          <Bell className="w-4 h-4" /> Notify
        </Btn>
        <Btn className="px-2 py-1.5 gap-1 text-sm" style={{ padding: '0.375rem 0.5rem' }}>
          <User className="w-4 h-4" /> Profile
        </Btn>
      </div>
    </div>
  )
}

export function BottomNav({ activePath }: { activePath: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border flex items-center justify-around px-4 z-50">
      {NAV_ITEMS.map((item) => {
        const active = activePath === item.path || activePath.startsWith(item.path + '/')
        const Icon = item.icon
        return (
          <Link key={item.label} to={item.path} className="flex flex-col items-center justify-center gap-1 min-w-[60px]">
            <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted'}`} />
            <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-muted'}`}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" /> SIP Compass
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {[
          { path: ROUTES.DASHBOARD, label: 'Explore Dashboard', icon: Home },
          { path: ROUTES.DIAGNOSTIC, label: 'SIP Health Diagnostic', icon: RefreshCw },
          { path: ROUTES.COMPASS, label: 'SIP Compass', icon: Home },
          { path: ROUTES.GOAL, label: 'Goal Progress', icon: RefreshCw },
          { path: ROUTES.FLEX, label: 'SIP Flex', icon: User },
          { path: ROUTES.RESOLUTION, label: 'Resolution Check', icon: Bell },
          { path: ROUTES.EVIDENCE, label: 'Evidence Log', icon: User },
          { path: ROUTES.EVALUATIONS, label: 'Evaluation Centre', icon: ChevronRight },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-[#f1f5f9] hover:text-text transition-colors"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Btn onClick={() => {}} className="w-full text-sm" style={{ padding: '0.5rem 1rem' }}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Btn>
      </div>
    </aside>
  )
}

export function MobileMenuToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <Btn className="px-2 py-1.5" style={{ padding: '0.375rem 0.5rem' }} onClick={onToggle}>
      <Menu className="w-5 h-5" />
    </Btn>
  )
}
