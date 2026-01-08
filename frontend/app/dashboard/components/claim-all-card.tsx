'use client'

/**
 * ClaimAllCard Component
 * Prominent card showing total claimable rewards with Harvest All button
 */

import { Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
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
      <div className="cartoon-card-glow p-6 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
        <div className="h-14 w-full bg-muted rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`cartoon-card-glow p-6 space-y-5 ${hasRewards ? 'animate-pulse-glow' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="cartoon-icon-primary p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold uppercase tracking-wide">Ready to Harvest</span>
          {claimableProtocols.length > 0 && (
            <span className="cartoon-badge-primary">
              {claimableProtocols.length}
            </span>
          )}
        </div>
        <p className="text-2xl font-extrabold text-primary stat-number">
          {formatCurrency(claimableTotal)}
        </p>
      </div>

      <Button
        onClick={onOpenModal}
        disabled={!hasRewards || isClaiming}
        className="w-full h-14 text-lg gap-2"
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
            <span className="text-xs text-muted-foreground font-bold self-center">
              +{claimableProtocols.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}
