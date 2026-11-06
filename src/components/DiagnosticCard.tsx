import { TrendingUp, Wallet, Target, ShieldAlert, Bot } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  returns: TrendingUp,
  payment: Wallet,
  goal: Target,
  fund: ShieldAlert,
}

export function DiagnosticCard({ option, selected, onSelect }: { option: any; selected: string | null; onSelect: (id: string) => void }) {
  const Icon = ICON_MAP[option.id] || Bot
  const isSelected = selected === option.id
  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`w-full card p-4 rounded-card border-2 transition-all ${
        isSelected ? 'border-primary bg-[#e0f2f1]' : 'border-border hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-[#f1f5f9] text-muted'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BadgeEl variant="slate">{option.module}</BadgeEl>
          </div>
          <h3 className="font-semibold text-text">{option.title}</h3>
          <p className="text-sm text-muted mt-1">{option.description}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-border bg-card'}`}>
          {isSelected && <div className="w-3 h-3 bg-white rounded-full mx-auto" />}
        </div>
      </div>
    </button>
  )
}

export function SimulatedBadge() {
  return (
    <BadgeEl variant="teal" className="text-[10px] uppercase tracking-wider">
      Simulated Data
    </BadgeEl>
  )
}

import { Badge as BadgeEl } from './Badge'
