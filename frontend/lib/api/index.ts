/**
 * API Service
 * Exports for backend API interactions
 */

import { apiClient } from './client'

// ============ Types ============

export interface ClaimRecord {
  id: number
  user_address: string
  protocol: string
  tx_hash: string
  amount: string
  token_symbol: string
  value_usd: number
  claimed_at: string
}

export interface ApiLeaderboardEntry {
  user_address: string
  total_claimed_usd: number
  claim_count: number
  rank: number
}

export interface RecordClaimData {
  address: string
  protocol: string
  txHash: string
  amount: string
  tokenSymbol: string
  valueUsd: number
}

// ============ API Methods ============

export const api = {
  // Claims
  recordClaim: (data: RecordClaimData): Promise<ClaimRecord> =>
    apiClient.post('/claims', data),

  getClaimHistory: (address: string, limit = 50): Promise<ClaimRecord[]> =>
    apiClient.get(`/claims/${address}?limit=${limit}`),

  // Leaderboard
  getLeaderboard: (period = 'weekly', limit = 100): Promise<ApiLeaderboardEntry[]> =>
    apiClient.get(`/leaderboard?period=${period}&limit=${limit}`),

  getUserRank: (address: string, period = 'weekly'): Promise<ApiLeaderboardEntry | null> =>
    apiClient.get(`/leaderboard/${address}?period=${period}`),
}

export { apiClient } from './client'
