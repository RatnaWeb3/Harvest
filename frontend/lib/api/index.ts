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

export interface SponsorRequest {
  rawTransaction: string
  senderSignature: string
}

export interface SponsorResponse {
  txHash: string
  sponsored: boolean
}

export interface SponsorErrorResponse {
  error: string
  fallback: boolean
  details?: string
}

export interface SponsorStatus {
  available: boolean
  fund?: {
    balance: string
    inFlight: string
  }
  reason?: string
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

  // Sponsorship (Gasless Transactions)
  sponsorTransaction: async (data: SponsorRequest): Promise<SponsorResponse> => {
    try {
      return await apiClient.post('/sponsor', data)
    } catch (error) {
      // Re-throw with fallback flag for caller to handle
      const err = error as Error & { fallback?: boolean }
      err.fallback = true
      throw err
    }
  },

  getSponsorStatus: (): Promise<SponsorStatus> =>
    apiClient.get('/sponsor/status'),
}

export { apiClient } from './client'
