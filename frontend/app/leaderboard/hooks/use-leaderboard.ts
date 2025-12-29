'use client'

/**
 * useLeaderboard Hook
 * Fetches and manages leaderboard data by period
 */

import { useQuery } from '@tanstack/react-query'
import { useAptosWallet } from '@/lib/move'
import { leaderboardService } from '@/lib/services/leaderboard-service'
import type { LeaderboardPeriod } from '../types'

const STALE_TIME = 30 * 1000 // 30 seconds

export function useLeaderboard(period: LeaderboardPeriod) {
  const { address, connected } = useAptosWallet()

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => leaderboardService.getLeaderboard(period),
    staleTime: STALE_TIME,
  })

  const statsQuery = useQuery({
    queryKey: ['leaderboard-stats', period],
    queryFn: () => leaderboardService.getStats(period),
    staleTime: STALE_TIME,
  })

  const userRankQuery = useQuery({
    queryKey: ['user-rank', period, address],
    queryFn: () => leaderboardService.getUserRank(address!, period),
    enabled: connected && !!address,
    staleTime: STALE_TIME,
  })

  const isLoading = leaderboardQuery.isLoading || statsQuery.isLoading
  const error = leaderboardQuery.error || statsQuery.error

  return {
    entries: leaderboardQuery.data ?? [],
    stats: statsQuery.data ?? null,
    userRank: userRankQuery.data ?? null,
    isLoading,
    isLoadingUserRank: userRankQuery.isLoading,
    error: error ? (error as Error).message : null,
    refetch: () => {
      leaderboardQuery.refetch()
      statsQuery.refetch()
      userRankQuery.refetch()
    },
  }
}
