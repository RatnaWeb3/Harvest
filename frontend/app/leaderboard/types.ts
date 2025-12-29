/**
 * Leaderboard Types
 * Type definitions for leaderboard entries and periods
 */

export interface LeaderboardEntry {
  rank: number
  address: string
  displayName?: string
  totalHarvested: number // USD value
  totalHarvestedMOVE: string
  positionsCount: number
  claimStreak: number // consecutive days
  lastClaimDate: Date
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time'

export interface LeaderboardStats {
  totalHarvestedByAll: number // USD
  activeFarmersCount: number
  averageClaimValue: number // USD
}

export interface UserRankInfo {
  rank: number
  entry: LeaderboardEntry
  distanceToNext: number // USD needed to reach next rank
  percentile: number
}
