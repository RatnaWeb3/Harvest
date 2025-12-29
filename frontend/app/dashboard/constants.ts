/**
 * Dashboard Constants
 * Protocol display configuration and colors
 */

import type { ProtocolId, PositionType } from './types'

// Protocol display names
export const PROTOCOL_NAMES: Record<ProtocolId, string> = {
  yuzu: 'Yuzu',
  joule: 'Joule',
  meridian: 'Meridian',
  thunderhead: 'Thunderhead',
  canopy: 'Canopy',
}

// Protocol brand colors (tailwind classes)
export const PROTOCOL_COLORS: Record<ProtocolId, string> = {
  yuzu: 'text-orange-400',
  joule: 'text-blue-400',
  meridian: 'text-purple-400',
  thunderhead: 'text-yellow-400',
  canopy: 'text-green-400',
}

// Protocol background classes
export const PROTOCOL_BG_COLORS: Record<ProtocolId, string> = {
  yuzu: 'bg-orange-500/10',
  joule: 'bg-blue-500/10',
  meridian: 'bg-purple-500/10',
  thunderhead: 'bg-yellow-500/10',
  canopy: 'bg-green-500/10',
}

// Position type labels
export const POSITION_TYPE_LABELS: Record<PositionType, string> = {
  lp: 'LP Position',
  lending: 'Lending',
  staking: 'Staking',
  vault: 'Vault',
}

// Stat card labels for quick stats
export const STAT_LABELS = {
  totalValue: 'Total Value',
  pendingRewards: 'Pending Rewards',
  avgApy: 'Avg APY',
  protocols: 'Protocols Active',
} as const

// Refresh interval for data fetching (ms)
export const DATA_REFRESH_INTERVAL = 30_000 // 30 seconds

// Default empty stats
export const DEFAULT_STATS = {
  totalValue: 0,
  totalRewards: 0,
  avgApy: 0,
  protocolCount: 0,
  change24h: 0,
  change24hPercent: 0,
}
