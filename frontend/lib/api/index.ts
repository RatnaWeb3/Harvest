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

  // Sponsorship (Gasless Transactions) - Uses Next.js API route (server-side only)
  sponsorTransaction: async (data: SponsorRequest): Promise<SponsorResponse> => {
    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Sponsorship failed' }))
        const err = new Error(error.error || 'Sponsorship failed') as Error & { fallback?: boolean }
        err.fallback = error.fallback ?? true
        throw err
      }

      return res.json()
    } catch (error) {
      const err = error as Error & { fallback?: boolean }
      err.fallback = true
      throw err
    }
  },

  getSponsorStatus: async (): Promise<SponsorStatus> => {
    const res = await fetch('/api/sponsor')
    return res.json()
  },
}

export { apiClient } from './client'
