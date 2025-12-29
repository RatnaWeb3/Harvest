'use client'

/**
 * User Rank Card Component
 * Shows current user's rank and stats with encouragement
 */

import { TrendingUp, Target, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'
import type { UserRankInfo } from '../types'

interface UserRankCardProps {
  userRank: UserRankInfo | null
  isLoading: boolean
  isConnected: boolean
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

function getEncouragementMessage(rank: number, percentile: number): string {
  if (rank <= 3) return "You're at the top! Keep harvesting!"
  if (rank <= 10) return "Amazing progress! Top 10 farmer!"
  if (percentile >= 75) return "Great work! Keep climbing!"
  return "Every harvest counts! Keep going!"
}

export function UserRankCard({ userRank, isLoading, isConnected }: UserRankCardProps) {
  if (!isConnected) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-muted-foreground">
          Connect your wallet to see your rank
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userRank) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-muted-foreground">
          Start harvesting to appear on the leaderboard!
        </CardContent>
      </Card>
    )
  }

  const { rank, entry, distanceToNext, percentile } = userRank
  const stats = [
    { icon: Target, value: entry.positionsCount, label: 'Positions', color: 'text-muted-foreground' },
    { icon: Flame, value: `${entry.claimStreak}d`, label: 'Streak', color: 'text-orange-500' },
    { icon: TrendingUp, value: formatUsd(distanceToNext), label: 'To Next', color: 'text-green-500' },
  ]

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="pb-2"><CardTitle className="text-lg">Your Rank</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">#{rank}</span>
            <span className="text-muted-foreground">Top {100 - percentile}%</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatUsd(entry.totalHarvested)}</div>
            <div className="text-sm text-muted-foreground">{entry.totalHarvestedMOVE} MOVE</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="text-center p-2 bg-background/50 rounded-lg">
              <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
              <div className="text-sm font-medium">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-center text-muted-foreground">
          {getEncouragementMessage(rank, percentile)}
        </p>
      </CardContent>
    </Card>
  )
}
