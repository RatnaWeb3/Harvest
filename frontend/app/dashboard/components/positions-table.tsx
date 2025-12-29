'use client'

/**
 * PositionsTable Component
 * Table of all positions across protocols with expandable rows
 */

import { useState } from 'react'
import { ChevronDown, ChevronRight, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import { EmptyState } from '@/components/shared/empty-state'
import type { Position, RewardItem } from '../types'
import { POSITION_TYPE_LABELS, PROTOCOL_NAMES } from '../constants'

interface PositionsTableProps {
  positions: Position[]
  isLoading: boolean
  onClaimRewards: (rewards: RewardItem[]) => void
  isClaiming: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function PositionRowExpanded({ position, onClaim, isClaiming }: {
  position: Position
  onClaim: (rewards: RewardItem[]) => void
  isClaiming: boolean
}) {
  const totalRewardsUsd = position.pendingRewards.reduce((sum, r) => sum + r.usdValue, 0)
  const claimableRewards = position.pendingRewards.filter((r) => r.claimable)

  return (
    <div className="px-4 py-3 bg-muted/50 border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Balance</p>
          <p className="font-medium">{position.balance} {position.assetSymbol}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Value</p>
          <p className="font-medium">{formatCurrency(position.usdValue)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Pending Rewards</p>
          <p className="font-medium text-primary">{formatCurrency(totalRewardsUsd)}</p>
        </div>
        <div className="flex items-end">
          {claimableRewards.length > 0 && (
            <Button size="sm" onClick={() => onClaim(claimableRewards)} disabled={isClaiming}>
              Claim Rewards
            </Button>
          )}
        </div>
      </div>
      {position.pendingRewards.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Reward Tokens:</p>
          <div className="flex flex-wrap gap-2">
            {position.pendingRewards.map((reward, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {reward.amount} {reward.tokenSymbol}
                <span className="text-muted-foreground">({formatCurrency(reward.usdValue)})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobilePositionCard({
  position,
  onClaim,
  isClaiming,
}: {
  position: Position
  onClaim: (rewards: RewardItem[]) => void
  isClaiming: boolean
}) {
  const totalRewardsUsd = position.pendingRewards.reduce((sum, r) => sum + r.usdValue, 0)
  const claimableRewards = position.pendingRewards.filter((r) => r.claimable)

  return (
    <div className="border-b border-border last:border-0 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProtocolBadge name={PROTOCOL_NAMES[position.protocol]} />
          <Badge variant="outline" className="text-xs">
            {POSITION_TYPE_LABELS[position.type]}
          </Badge>
        </div>
        <span className="text-green-400 text-sm font-medium">{position.apy.toFixed(1)}% APY</span>
      </div>
      <div className="font-medium">{position.asset}</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Value</p>
          <p className="font-medium">{formatCurrency(position.usdValue)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Rewards</p>
          <p className="font-medium text-primary">{formatCurrency(totalRewardsUsd)}</p>
        </div>
      </div>
      {claimableRewards.length > 0 && (
        <Button
          size="sm"
          className="w-full"
          onClick={() => onClaim(claimableRewards)}
          disabled={isClaiming}
        >
          Claim Rewards
        </Button>
      )}
    </div>
  )
}

function PositionRow({
  position,
  isExpanded,
  onToggle,
  onClaim,
  isClaiming,
}: {
  position: Position
  isExpanded: boolean
  onToggle: () => void
  onClaim: (rewards: RewardItem[]) => void
  isClaiming: boolean
}) {
  const totalRewardsUsd = position.pendingRewards.reduce((sum, r) => sum + r.usdValue, 0)

  return (
    <div className="border-b border-border last:border-0">
      <div
        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <button className="shrink-0 text-muted-foreground" aria-hidden="true">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <ProtocolBadge name={PROTOCOL_NAMES[position.protocol]} className="shrink-0" />
        <Badge variant="outline" className="shrink-0">
          {POSITION_TYPE_LABELS[position.type]}
        </Badge>
        <span className="font-medium truncate">{position.asset}</span>
        <span className="ml-auto text-right shrink-0">{formatCurrency(position.usdValue)}</span>
        <span className="text-green-400 shrink-0 w-16 text-right">{position.apy.toFixed(1)}%</span>
        <span className="text-primary shrink-0 w-20 text-right">{formatCurrency(totalRewardsUsd)}</span>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            const claimable = position.pendingRewards.filter((r) => r.claimable)
            if (claimable.length > 0) onClaim(claimable)
          }}
          disabled={isClaiming || position.pendingRewards.every((r) => !r.claimable)}
        >
          Claim
        </Button>
      </div>
      {isExpanded && (
        <PositionRowExpanded position={position} onClaim={onClaim} isClaiming={isClaiming} />
      )}
    </div>
  )
}

function TableHeader() {
  return (
    <div className="hidden md:flex items-center gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
      <span className="w-4" />
      <span className="w-20">Protocol</span>
      <span className="w-20">Type</span>
      <span className="flex-1">Asset</span>
      <span className="w-24 text-right">Value</span>
      <span className="w-16 text-right">APY</span>
      <span className="w-20 text-right">Rewards</span>
      <span className="w-16" />
    </div>
  )
}

function PositionsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="p-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PositionsTable({
  positions,
  isLoading,
  onClaimRewards,
  isClaiming,
}: PositionsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (isLoading) {
    return <PositionsTableSkeleton />
  }

  if (positions.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No positions found"
        description="You don't have any active positions in Movement DeFi protocols yet. Explore protocols to start earning rewards."
        actionLabel="Explore Protocols"
        onAction={() => window.open('https://movementlabs.xyz/ecosystem', '_blank')}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="h-5 w-5" aria-hidden="true" />
          Positions ({positions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile: Card view */}
        <div className="md:hidden">
          {positions.map((position) => (
            <MobilePositionCard
              key={position.id}
              position={position}
              onClaim={onClaimRewards}
              isClaiming={isClaiming}
            />
          ))}
        </div>

        {/* Desktop: Table view with horizontal scroll */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[700px]">
            <TableHeader />
            {positions.map((position) => (
              <PositionRow
                key={position.id}
                position={position}
                isExpanded={expandedIds.has(position.id)}
                onToggle={() => toggleExpand(position.id)}
                onClaim={onClaimRewards}
                isClaiming={isClaiming}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
