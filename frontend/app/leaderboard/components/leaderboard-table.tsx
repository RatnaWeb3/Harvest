'use client'

/**
 * Leaderboard Table Component
 * Displays ranked list of top farmers
 */

import { Trophy, Medal, Award, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'
import type { LeaderboardEntry } from '../types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserAddress?: string
  isLoading: boolean
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Trophy className="h-5 w-5 text-yellow-500" />
  }
  if (rank === 2) {
    return <Medal className="h-5 w-5 text-gray-400" />
  }
  if (rank === 3) {
    return <Award className="h-5 w-5 text-amber-600" />
  }
  return <span className="text-muted-foreground font-medium w-5 text-center">{rank}</span>
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  )
}

export function LeaderboardTable({
  entries,
  currentUserAddress,
  isLoading,
}: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Farmers</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Farmers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No farmers on the leaderboard yet. Be the first!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Farmers</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Header */}
        <div className="hidden md:grid grid-cols-[40px_1fr_100px_80px_80px] gap-4 px-3 py-2 text-sm text-muted-foreground border-b">
          <span>Rank</span>
          <span>Farmer</span>
          <span className="text-right">Harvested</span>
          <span className="text-center">Positions</span>
          <span className="text-center">Streak</span>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {entries.map((entry) => {
            const isCurrentUser =
              currentUserAddress?.toLowerCase() === entry.address.toLowerCase()

            return (
              <div
                key={entry.address}
                className={`grid grid-cols-2 md:grid-cols-[40px_1fr_100px_80px_80px] gap-2 md:gap-4 p-3 items-center transition-colors ${
                  isCurrentUser ? 'bg-primary/10 rounded-lg' : 'hover:bg-muted/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center md:justify-start">
                  <RankBadge rank={entry.rank} />
                </div>

                {/* Address/Name */}
                <div className="flex flex-col md:flex-row md:items-center gap-1">
                  <span className="font-medium">
                    {entry.displayName || truncateAddress(entry.address)}
                  </span>
                  {entry.displayName && (
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      {truncateAddress(entry.address)}
                    </span>
                  )}
                  {isCurrentUser && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full w-fit">
                      You
                    </span>
                  )}
                </div>

                {/* Harvested - Mobile shows on second row */}
                <div className="text-right col-span-2 md:col-span-1 mt-2 md:mt-0">
                  <span className="font-semibold">{formatUsd(entry.totalHarvested)}</span>
                  <span className="text-xs text-muted-foreground block md:hidden">
                    {entry.totalHarvestedMOVE} MOVE
                  </span>
                </div>

                {/* Positions - Hidden on mobile */}
                <div className="hidden md:block text-center">
                  <span className="text-sm">{entry.positionsCount}</span>
                </div>

                {/* Streak - Hidden on mobile */}
                <div className="hidden md:flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{entry.claimStreak}d</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
