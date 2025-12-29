'use client'

/**
 * Leaderboard Stats Component
 * Shows aggregate stats for the leaderboard
 */

import { Users, TrendingUp, Coins } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'
import type { LeaderboardStats as StatsType } from '../types'

interface LeaderboardStatsProps {
  stats: StatsType | null
  isLoading: boolean
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

export function LeaderboardStats({ stats, isLoading }: LeaderboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statItems = [
    {
      label: 'Total Harvested',
      value: formatUsd(stats.totalHarvestedByAll),
      icon: Coins,
    },
    {
      label: 'Active Farmers',
      value: stats.activeFarmersCount.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Avg. Claim Value',
      value: formatUsd(stats.averageClaimValue),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
            <div className="text-2xl font-bold mt-1">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
