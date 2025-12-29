'use client'

/**
 * Leaderboard Page
 * Shows top farmers in the Movement ecosystem
 */

import { useState } from 'react'
import { useAptosWallet } from '@/lib/move'
import { useLeaderboard } from './hooks/use-leaderboard'
import { PeriodSelector } from './components/period-selector'
import { LeaderboardStats } from './components/leaderboard-stats'
import { LeaderboardTable } from './components/leaderboard-table'
import { UserRankCard } from './components/user-rank-card'
import { ShareRank } from './components/share-rank'
import type { LeaderboardPeriod } from './types'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly')
  const { address, connected } = useAptosWallet()
  const { entries, stats, userRank, isLoading, isLoadingUserRank } = useLeaderboard(period)

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top farmers in the Movement ecosystem
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <PeriodSelector value={period} onChange={setPeriod} />
          <ShareRank userRank={userRank} isConnected={connected} />
        </div>
      </div>

      {/* Stats */}
      <LeaderboardStats stats={stats} isLoading={isLoading} />

      {/* Main content - User rank card first on mobile */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:hidden">
          <UserRankCard
            userRank={userRank}
            isLoading={isLoadingUserRank}
            isConnected={connected}
          />
        </div>
        <div className="lg:col-span-2">
          <LeaderboardTable
            entries={entries}
            currentUserAddress={address ?? undefined}
            isLoading={isLoading}
          />
        </div>
        <div className="hidden lg:block">
          <UserRankCard
            userRank={userRank}
            isLoading={isLoadingUserRank}
            isConnected={connected}
          />
        </div>
      </div>
    </div>
  )
}
