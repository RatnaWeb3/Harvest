'use client'

/**
 * RewardsBreakdown Component
 * Shows rewards grouped by protocol with individual claim buttons
 */

import { Gift, Lock, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { COMING_SOON_PROTOCOLS, getProtocolConfig } from '@/constants/protocols'
import type { ProtocolRewards, RewardItem } from '../types'

interface RewardsBreakdownProps {
  rewardsByProtocol: ProtocolRewards[]
  isLoading: boolean
  onClaimRewards: (rewards: RewardItem[]) => void
  isClaiming: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function RewardRow({ reward, onClaim, isClaiming }: {
  reward: RewardItem
  onClaim: () => void
  isClaiming: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-medium">{reward.tokenSymbol.slice(0, 2)}</span>
        </div>
        <div>
          <p className="font-medium">{reward.amount} {reward.tokenSymbol}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(reward.usdValue)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {reward.claimable ? (
          <Button size="sm" variant="outline" onClick={onClaim} disabled={isClaiming}>
            <Check className="h-3 w-3 mr-1" />
            Claim
          </Button>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" />
            Locked
          </Badge>
        )}
      </div>
    </div>
  )
}

function ProtocolSection({
  protocolRewards,
  onClaimRewards,
  isClaiming,
}: {
  protocolRewards: ProtocolRewards
  onClaimRewards: (rewards: RewardItem[]) => void
  isClaiming: boolean
}) {
  const claimableRewards = protocolRewards.rewards.filter((r) => r.claimable)

  return (
    <div className="border-b border-border last:border-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between mb-3">
        <ProtocolBadge name={protocolRewards.protocolName} />
        <span className="text-sm font-medium">{formatCurrency(protocolRewards.totalUsdValue)}</span>
      </div>
      <div className="space-y-1">
        {protocolRewards.rewards.map((reward, i) => (
          <RewardRow
            key={`${reward.token}-${i}`}
            reward={reward}
            onClaim={() => onClaimRewards([reward])}
            isClaiming={isClaiming}
          />
        ))}
      </div>
      {claimableRewards.length > 1 && (
        <Button
          size="sm"
          className="w-full mt-3"
          onClick={() => onClaimRewards(claimableRewards)}
          disabled={isClaiming}
        >
          Claim All {protocolRewards.protocolName} Rewards
        </Button>
      )}
    </div>
  )
}

function RewardsBreakdownSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3 pb-4 border-b border-border last:border-0">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RewardsBreakdown({
  rewardsByProtocol,
  isLoading,
  onClaimRewards,
  isClaiming,
}: RewardsBreakdownProps) {
  if (isLoading) {
    return <RewardsBreakdownSkeleton />
  }

  if (rewardsByProtocol.length === 0) {
    return (
      <EmptyState
        icon={Gift}
        title="No pending rewards"
        description="You don't have any pending rewards to claim. Add liquidity or stake assets to start earning."
        actionLabel="Explore Protocols"
        onAction={() => window.open('https://movementlabs.xyz/ecosystem', '_blank')}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5" />
          Rewards Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rewardsByProtocol.map((pr) => (
          <ProtocolSection
            key={pr.protocol}
            protocolRewards={pr}
            onClaimRewards={onClaimRewards}
            isClaiming={isClaiming}
          />
        ))}

        {COMING_SOON_PROTOCOLS.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Rewards from {COMING_SOON_PROTOCOLS.length} more protocols coming soon:{' '}
              <span className="font-medium">
                {COMING_SOON_PROTOCOLS.map((id) => getProtocolConfig(id).displayName).join(', ')}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
