/**
 * Leaderboard Service
 * Manages leaderboard data and rankings via backend API
 */

import { api, ApiLeaderboardEntry } from '@/lib/api'
import type {
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardStats,
  UserRankInfo,
} from '@/app/leaderboard/types'

/**
 * Convert API period format to backend format
 */
function mapPeriod(period: LeaderboardPeriod): string {
  const periodMap: Record<LeaderboardPeriod, string> = {
    'daily': 'daily',
    'weekly': 'weekly',
    'monthly': 'monthly',
    'all-time': 'all-time',
  }
  return periodMap[period]
}

/**
 * Convert API leaderboard entry to frontend format
 */
function mapApiEntry(entry: ApiLeaderboardEntry): LeaderboardEntry {
  return {
    rank: entry.rank,
    address: entry.user_address,
    displayName: undefined, // Could be fetched from a separate profile service
    totalHarvested: entry.total_claimed_usd,
    totalHarvestedMOVE: (entry.total_claimed_usd / 10).toFixed(2), // Approximate MOVE conversion
    positionsCount: entry.claim_count,
    claimStreak: 0, // Not tracked in current API
    lastClaimDate: new Date(),
  }
}

class LeaderboardService {
  private cache = new Map<string, { data: LeaderboardEntry[]; timestamp: number }>()
  private cacheTimeout = 30 * 1000 // 30 seconds

  async getLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard-${period}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const apiPeriod = mapPeriod(period)
      const entries = await api.getLeaderboard(apiPeriod, 100)
      const mapped = entries.map(mapApiEntry)

      this.cache.set(cacheKey, { data: mapped, timestamp: Date.now() })
      return mapped
    } catch (error) {
      console.error('[LeaderboardService] Failed to fetch leaderboard:', error)
      // Return cached data if available, even if stale
      return cached?.data ?? []
    }
  }

  async getStats(period: LeaderboardPeriod): Promise<LeaderboardStats> {
    const leaderboard = await this.getLeaderboard(period)
    const totalHarvested = leaderboard.reduce((sum, e) => sum + e.totalHarvested, 0)

    return {
      totalHarvestedByAll: totalHarvested,
      activeFarmersCount: leaderboard.length,
      averageClaimValue: leaderboard.length > 0 ? totalHarvested / leaderboard.length : 0,
    }
  }

  async getUserRank(address: string, period: LeaderboardPeriod): Promise<UserRankInfo | null> {
    try {
      const apiPeriod = mapPeriod(period)
      const apiEntry = await api.getUserRank(address, apiPeriod)

      if (!apiEntry || !apiEntry.rank) {
        // User not on leaderboard
        return null
      }

      const entry = mapApiEntry(apiEntry)
      const leaderboard = await this.getLeaderboard(period)
      const nextEntry = leaderboard.find((e) => e.rank === entry.rank - 1)
      const distanceToNext = nextEntry ? nextEntry.totalHarvested - entry.totalHarvested : 0

      return {
        rank: entry.rank,
        entry,
        distanceToNext,
        percentile: leaderboard.length > 0
          ? Math.floor((1 - entry.rank / leaderboard.length) * 100)
          : 0,
      }
    } catch (error) {
      console.error('[LeaderboardService] Failed to get user rank:', error)
      return null
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const leaderboardService = new LeaderboardService()
