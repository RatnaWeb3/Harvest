'use client'

/**
 * QuickStats Component
 * Displays 4 key metrics in a grid layout
 */

import { DollarSign, Gift, TrendingUp, Layers } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'
import type { PortfolioStats } from '../types'

interface QuickStatsProps {
  stats: PortfolioStats
  isLoading: boolean
}

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  subValue?: string
  subValueColor?: string
}

function StatCard({ label, value, icon, subValue, subValueColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        {subValue && (
          <p className={`text-sm ${subValueColor || 'text-muted-foreground'}`}>{subValue}</p>
        )}
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="mt-2 h-8 w-32" />
        <Skeleton className="mt-1 h-4 w-20" />
      </CardContent>
    </Card>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function QuickStats({ stats, isLoading }: QuickStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Value"
        value={formatCurrency(stats.totalValue)}
        icon={<DollarSign className="h-5 w-5" />}
        subValue={formatPercent(stats.change24hPercent)}
        subValueColor={stats.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}
      />
      <StatCard
        label="Pending Rewards"
        value={formatCurrency(stats.totalRewards)}
        icon={<Gift className="h-5 w-5" />}
      />
      <StatCard
        label="Avg APY"
        value={`${stats.avgApy.toFixed(1)}%`}
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <StatCard
        label="Protocols Active"
        value={stats.protocolCount.toString()}
        icon={<Layers className="h-5 w-5" />}
      />
    </div>
  )
}
