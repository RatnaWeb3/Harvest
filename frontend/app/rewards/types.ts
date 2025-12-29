/**
 * Rewards Page Types
 * Type definitions for claim history, rewards management, and compound strategies
 */

import type { ProtocolId, RewardItem } from '../dashboard/types'

// Tab navigation
export type RewardsTab = 'pending' | 'history' | 'compound'

// Claim status
export type ClaimStatus = 'pending' | 'confirmed' | 'failed'

// Single reward in a claim
export interface ClaimReward {
  token: string
  tokenSymbol: string
  amount: string
  usdValue: number
}

// Claim history record
export interface ClaimHistory {
  id: string
  txHash: string
  timestamp: Date
  protocol: ProtocolId
  rewards: ClaimReward[]
  totalUsdValue: number
  status: ClaimStatus
}

// Filter options for history
export interface HistoryFilters {
  protocol?: ProtocolId
  dateFrom?: Date
  dateTo?: Date
  status?: ClaimStatus
}

// Pagination state
export interface PaginationState {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// Compound strategy
export interface CompoundStrategy {
  id: string
  name: string
  description: string
  targetProtocol: ProtocolId
  estimatedApy: number
  minRewardAmount: number
  isAvailable: boolean
}

// Re-export dashboard types used in rewards
export type { ProtocolId, RewardItem }
