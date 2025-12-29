/**
 * Dashboard Types
 * Type definitions for portfolio and rewards data structures
 */

// Protocol identifiers for the Movement ecosystem
export type ProtocolId = 'yuzu' | 'joule' | 'meridian' | 'thunderhead' | 'canopy'

// Position type enum
export type PositionType = 'lp' | 'lending' | 'staking' | 'vault'

// Individual reward item
export interface RewardItem {
  protocol: ProtocolId
  token: string
  tokenSymbol: string
  amount: string
  usdValue: number
  claimable: boolean
  iconUrl?: string
}

// User position across protocols
export interface Position {
  id: string
  protocol: ProtocolId
  type: PositionType
  asset: string
  assetSymbol: string
  balance: string
  usdValue: number
  apy: number
  pendingRewards: RewardItem[]
  iconUrl?: string
}

// Aggregated portfolio stats
export interface PortfolioStats {
  totalValue: number
  totalRewards: number
  avgApy: number
  protocolCount: number
  change24h: number
  change24hPercent: number
}

// Props for position row expansion
export interface PositionDetails {
  position: Position
  isExpanded: boolean
  onToggle: () => void
  onClaim: (position: Position) => void
}

// Rewards grouped by protocol
export interface ProtocolRewards {
  protocol: ProtocolId
  protocolName: string
  rewards: RewardItem[]
  totalUsdValue: number
}

// Dashboard state
export interface DashboardState {
  isLoading: boolean
  error: string | null
  positions: Position[]
  rewards: RewardItem[]
  stats: PortfolioStats
}
