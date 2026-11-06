import { GoalData, SIPData, SIPSummary } from '@/types/index'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  DIAGNOSTIC: '/diagnostic',
  COMPASS: '/compass',
  GOAL: '/goal',
  FLEX: '/flex',
  RESOLUTION: '/resolution',
  EVIDENCE: '/evidence',
  EVALUATIONS: '/admin/evaluations',
  KB: '/admin/knowledge-base',
} as const

export const DISCLAIMER =
  'SIP Compass is an educational tool. It does not provide investment advice or recommend specific securities or mutual funds. All simulations and projections are hypothetical, market returns are uncertain, and actual outcomes may differ. Consult a SEBI-registered investment adviser for personalised financial advice.'

export const SIMULATED_BADGE = 'Simulated Data'

export const INITIAL_GOALS: GoalData[] = [
  {
    id: 'goal-1',
    name: 'First Home Down Payment',
    targetAmount: 1000000,
    targetYear: 2032,
    amountAchieved: 180000,
    monthlyContribution: 5000,
    assumedReturn: 12,
  },
]

export const INITIAL_PORTFOLIO: SIPData = {
  portfolioValue: 142500,
  totalInvested: 150000,
  oneDayReturns: -1250,
  activeSIPCount: 3,
}

export const INITIAL_SIPS: SIPSummary[] = [
  { id: 'sip-1', schemeName: 'Nifty 50 Index Fund – Direct Growth', monthlyContribution: 5000, status: 'active', startDate: '2024-01-10' },
  { id: 'sip-2', schemeName: 'Flexi Cap Fund – Direct Growth', monthlyContribution: 3000, status: 'failed', startDate: '2024-02-05' },
  { id: 'sip-3', schemeName: 'ELSS Tax Saver Fund – Direct Growth', monthlyContribution: 2000, status: 'active', startDate: '2024-03-15' },
]
