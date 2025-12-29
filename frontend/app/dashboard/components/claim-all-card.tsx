'use client'

/**
 * ClaimAllCard Component
 * Prominent card showing total claimable rewards with Harvest All button
 */

import { Sparkles, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import type { ProtocolRewards } from '../types'

interface ClaimAllCardProps {
  rewardsByProtocol: ProtocolRewards[]
  claimableTotal: number
  isLoading: boolean
  onOpenModal: () => void
  isClaiming: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function ClaimAllCard({
  rewardsByProtocol,
  claimableTotal,
  isLoading,
  onOpenModal,
  isClaiming,
}: ClaimAllCardProps) {
  const claimableProtocols = rewardsByProtocol.filter((p) =>
    p.rewards.some((r) => r.claimable)
  )
  const hasRewards = claimableTotal > 0

  if (isLoading) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 transition-all ${
        hasRewards ? 'animate-pulse-subtle' : ''
      }`}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium">Ready to Harvest</span>
            {claimableProtocols.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {claimableProtocols.length}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(claimableTotal)}</p>
        </div>

        <Button
          onClick={onOpenModal}
          disabled={!hasRewards || isClaiming}
          className="w-full h-12 text-lg gap-2"
          size="lg"
        >
          <Sparkles className="h-5 w-5" />
          {isClaiming ? 'Harvesting...' : 'Harvest All Rewards'}
          <ChevronRight className="h-5 w-5" />
        </Button>

        {claimableProtocols.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {claimableProtocols.slice(0, 4).map((p) => (
              <ProtocolBadge key={p.protocol} name={p.protocolName} />
            ))}
            {claimableProtocols.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{claimableProtocols.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
