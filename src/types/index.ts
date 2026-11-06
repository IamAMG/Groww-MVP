export type UserRole = 'learner' | 'mentor' | 'admin'

export type SIPData = {
  portfolioValue: number
  totalInvested: number
  oneDayReturns: number
  activeSIPCount: number
}

export type GoalData = {
  id: string
  name: string
  targetAmount: number
  targetYear: number
  amountAchieved: number
  monthlyContribution: number
  assumedReturn: number
}

export type SIPSummary = {
  id: string
  schemeName: string
  monthlyContribution: number
  status: 'active' | 'failed' | 'paused'
  startDate: string
}

export type DiagnosticOption = {
  id: string
  title: string
  description: string
  module: 'SIP Compass' | 'SIP Flex' | 'Goal Tracker' | 'Fund Health'
  icon: React.ComponentType<{ className?: string }>
}

export type KnowledgeChunk = {
  id: string
  content: string
  sourceTitle: string
  sourceUrl: string | null
  category: string
  similarity: number
}

export type AIResponse = {
  answer: string
  sources: KnowledgeChunk[]
  gatePassed: boolean
  fallbackReason: string | null
}
