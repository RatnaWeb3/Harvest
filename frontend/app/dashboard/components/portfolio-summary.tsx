'use client'

/**
 * PortfolioSummary Component
 * Hero card showing total portfolio value, pending rewards, and 24h change
 */

import { ArrowUpRight, ArrowDownRight, Wallet, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/skeleton'
import type { PortfolioStats } from '../types'

interface PortfolioSummaryProps {
  stats: PortfolioStats
  claimableTotal: number
  isLoading: boolean
  onClaimAll: () => void
  isClaiming: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function AnimatedValue({ value, className }: { value: string; className?: string }) {
  return (
    <span className={`tabular-nums transition-all duration-500 ${className}`}>
      {value}
    </span>
  )
}

export function PortfolioSummary({
  stats,
  claimableTotal,
  isLoading,
  onClaimAll,
  isClaiming,
}: PortfolioSummaryProps) {
  const isPositiveChange = stats.change24hPercent >= 0

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-9 w-full mt-2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Total Value */}
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-3xl font-bold mt-1">
              <AnimatedValue value={formatCurrency(stats.totalValue)} />
            </p>
            <div
              className={`flex items-center gap-1 mt-1 text-sm ${
                isPositiveChange ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositiveChange ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{formatCurrency(Math.abs(stats.change24h))}</span>
              <span>({Math.abs(stats.change24hPercent).toFixed(2)}%)</span>
              <span className="text-muted-foreground ml-1">24h</span>
            </div>
          </div>

          {/* Pending Rewards */}
          <div>
            <p className="text-sm text-muted-foreground">Pending Rewards</p>
            <p className="text-3xl font-bold mt-1 text-primary">
              <AnimatedValue value={formatCurrency(stats.totalRewards)} />
            </p>
            <Button
              className="mt-2 w-full gap-2"
              size="sm"
              onClick={onClaimAll}
              disabled={claimableTotal === 0 || isClaiming}
            >
              <Sparkles className="h-4 w-4" />
              {isClaiming ? 'Claiming...' : `Claim All (${formatCurrency(claimableTotal)})`}
            </Button>
          </div>

          {/* 24h Earnings */}
          <div>
            <p className="text-sm text-muted-foreground">24h Earnings</p>
            <p className="text-3xl font-bold mt-1">
              <AnimatedValue
                value={formatCurrency(stats.change24h)}
                className={isPositiveChange ? 'text-green-400' : 'text-red-400'}
              />
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Across {stats.protocolCount} protocol{stats.protocolCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
