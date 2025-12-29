/**
 * Leaderboard Service
 * Manages leaderboard data and rankings
 */

import type {
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardStats,
  UserRankInfo,
} from '@/app/leaderboard/types'

// Mock addresses for demo
const MOCK_ADDRESSES = [
  '0x1234567890abcdef1234567890abcdef12345678',
  '0xabcdef1234567890abcdef1234567890abcdef12',
  '0x9876543210fedcba9876543210fedcba98765432',
  '0xfedcba9876543210fedcba9876543210fedcba98',
  '0x1111222233334444555566667777888899990000',
  '0x2222333344445555666677778888999900001111',
  '0x3333444455556666777788889999000011112222',
  '0x4444555566667777888899990000111122223333',
  '0x5555666677778888999900001111222233334444',
  '0x6666777788889999000011112222333344445555',
]

const DISPLAY_NAMES: Record<string, string> = {
  '0x1234567890abcdef1234567890abcdef12345678': 'CryptoWhale.move',
  '0xabcdef1234567890abcdef1234567890abcdef12': 'DeFiMaster',
  '0x9876543210fedcba9876543210fedcba98765432': 'YieldFarmer.apt',
}

function generateMockEntry(rank: number, period: LeaderboardPeriod): LeaderboardEntry {
  const address = MOCK_ADDRESSES[(rank - 1) % MOCK_ADDRESSES.length]
  const multiplier = period === 'all-time' ? 10 : period === 'monthly' ? 3 : period === 'weekly' ? 1.5 : 1
  const baseValue = (100 - rank * 5) * multiplier * (1 + Math.random() * 0.3)

  return {
    rank,
    address,
    displayName: DISPLAY_NAMES[address],
    totalHarvested: Math.max(baseValue * 100, 50),
    totalHarvestedMOVE: (baseValue * 10).toFixed(2),
    positionsCount: Math.floor(Math.random() * 10) + 1,
    claimStreak: Math.floor(Math.random() * 30) + 1,
    lastClaimDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }
}

function generateMockLeaderboard(period: LeaderboardPeriod, count = 20): LeaderboardEntry[] {
  return Array.from({ length: count }, (_, i) => generateMockEntry(i + 1, period))
}

class LeaderboardService {
  private cache = new Map<LeaderboardPeriod, LeaderboardEntry[]>()

  async getLeaderboard(period: LeaderboardPeriod): Promise<LeaderboardEntry[]> {
    // Return cached data if available
    if (this.cache.has(period)) {
      return this.cache.get(period)!
    }

    // Generate mock data
    const data = generateMockLeaderboard(period)
    this.cache.set(period, data)
    return data
  }

  async getStats(period: LeaderboardPeriod): Promise<LeaderboardStats> {
    const leaderboard = await this.getLeaderboard(period)
    const totalHarvested = leaderboard.reduce((sum, e) => sum + e.totalHarvested, 0)

    return {
      totalHarvestedByAll: totalHarvested,
      activeFarmersCount: leaderboard.length + Math.floor(Math.random() * 100),
      averageClaimValue: totalHarvested / leaderboard.length,
    }
  }

  async getUserRank(address: string, period: LeaderboardPeriod): Promise<UserRankInfo | null> {
    const leaderboard = await this.getLeaderboard(period)
    const entry = leaderboard.find(
      (e) => e.address.toLowerCase() === address.toLowerCase()
    )

    if (!entry) {
      // User not on leaderboard - return estimated rank
      const estimatedRank = leaderboard.length + Math.floor(Math.random() * 50) + 1
      return {
        rank: estimatedRank,
        entry: {
          rank: estimatedRank,
          address,
          totalHarvested: Math.random() * 100,
          totalHarvestedMOVE: (Math.random() * 10).toFixed(2),
          positionsCount: Math.floor(Math.random() * 3) + 1,
          claimStreak: Math.floor(Math.random() * 5),
          lastClaimDate: new Date(),
        },
        distanceToNext: Math.random() * 500,
        percentile: Math.floor(50 + Math.random() * 40),
      }
    }

    const nextEntry = leaderboard.find((e) => e.rank === entry.rank - 1)
    const distanceToNext = nextEntry ? nextEntry.totalHarvested - entry.totalHarvested : 0

    return {
      rank: entry.rank,
      entry,
      distanceToNext,
      percentile: Math.floor((1 - entry.rank / leaderboard.length) * 100),
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const leaderboardService = new LeaderboardService()
