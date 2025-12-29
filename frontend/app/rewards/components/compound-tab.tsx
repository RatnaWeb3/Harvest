'use client'

/**
 * Compound Tab
 * Shows compound strategies with estimated APY and educational content
 */

import { Sparkles, TrendingUp, Clock, Info, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import { PROTOCOL_NAMES } from '@/app/dashboard/constants'
import type { CompoundStrategy } from '../types'

interface CompoundTabProps {
  availableStrategies: CompoundStrategy[]
  comingSoonStrategies: CompoundStrategy[]
  bestApy: number
  isLoading: boolean
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function StrategyCard({
  strategy,
  isAvailable,
}: {
  strategy: CompoundStrategy
  isAvailable: boolean
}) {
  return (
    <Card className={`transition-all ${isAvailable ? 'hover:border-primary' : 'opacity-75'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <ProtocolBadge name={PROTOCOL_NAMES[strategy.targetProtocol]} />
          {!isAvailable && (
            <Badge variant="outline" className="bg-muted">
              <Clock className="h-3 w-3 mr-1" /> Coming Soon
            </Badge>
          )}
        </div>
        <CardTitle className="text-base mt-2">{strategy.name}</CardTitle>
        <CardDescription className="text-sm">{strategy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Est. APY</span>
          </div>
          <span className="text-xl font-bold text-green-500">
            {formatPercent(strategy.estimatedApy)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Min. Reward Amount</span>
          <span>${strategy.minRewardAmount}</span>
        </div>
        <Button className="w-full" disabled={!isAvailable}>
          {isAvailable ? (
            <>
              Enable Auto-Compound <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            'Coming Soon'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

function CompoundTabSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CompoundTab({
  availableStrategies,
  comingSoonStrategies,
  bestApy,
  isLoading,
}: CompoundTabProps) {
  if (isLoading) return <CompoundTabSkeleton />

  return (
    <div className="space-y-6">
      {/* Educational Hero */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/20 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Auto-Compound Your Rewards</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Automatically reinvest your claimed rewards into yield-generating strategies.
                Compounding can significantly increase your returns over time by putting your
                rewards to work immediately.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Up to <strong className="text-green-500">{formatPercent(bestApy)}</strong> APY</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Set it and forget it</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-500">How Compounding Works</p>
          <p className="text-muted-foreground mt-1">
            When enabled, your claimed rewards are automatically deposited into the selected
            strategy. Your rewards earn additional yield, which compounds over time. You can
            withdraw your compounded rewards at any time.
          </p>
        </div>
      </div>

      {/* Available Strategies */}
      {availableStrategies.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Strategies</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {availableStrategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} isAvailable />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Strategies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {availableStrategies.length > 0 ? 'More Strategies Coming' : 'Coming Soon'}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {comingSoonStrategies.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} isAvailable={false} />
          ))}
        </div>
      </div>
    </div>
  )
}
