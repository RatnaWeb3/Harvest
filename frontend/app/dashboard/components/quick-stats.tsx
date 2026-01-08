'use client'

/**
 * QuickStats Component
 * Displays 4 key metrics in a grid layout with cartoon styling
 */

import { DollarSign, Gift, TrendingUp, Layers } from 'lucide-react'
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
  isPositive?: boolean
}

function StatCard({ label, value, icon, subValue, isPositive }: StatCardProps) {
  return (
    <div className="cartoon-card p-5 hover-lift">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-bold uppercase tracking-wide">{label}</span>
        <div className="cartoon-icon-primary p-2">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold stat-number">{value}</p>
      {subValue && (
        <p className={`text-sm font-bold mt-1 ${isPositive ? 'text-primary' : 'text-destructive'}`}>
          {subValue}
        </p>
      )}
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="cartoon-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="cartoon-icon-primary p-2">
          <div className="h-5 w-5 bg-muted rounded" />
        </div>
      </div>
      <div className="h-8 w-32 bg-muted rounded mb-1" />
      <div className="h-4 w-20 bg-muted rounded" />
    </div>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        label="Total Value"
        value={formatCurrency(stats.totalValue)}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        subValue={formatPercent(stats.change24hPercent)}
        isPositive={stats.change24hPercent >= 0}
      />
      <StatCard
        label="Pending Rewards"
        value={formatCurrency(stats.totalRewards)}
        icon={<Gift className="h-5 w-5 text-primary" />}
      />
      <StatCard
        label="Avg APY"
        value={`${stats.avgApy.toFixed(1)}%`}
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />
      <StatCard
        label="Protocols Active"
        value={stats.protocolCount.toString()}
        icon={<Layers className="h-5 w-5 text-primary" />}
      />
    </div>
  )
}
