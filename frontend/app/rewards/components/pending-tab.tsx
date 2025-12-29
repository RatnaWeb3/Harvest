'use client'

/**
 * Pending Rewards Tab
 * Displays all pending rewards grouped by protocol with claim actions
 */

import { useState, useCallback } from 'react'
import { Gift, Loader2, CheckSquare, Square } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import { TokenDisplay } from '@/components/shared/token-display'
import { EmptyState } from '@/components/shared/empty-state'
import { PROTOCOL_NAMES } from '@/app/dashboard/constants'
import type { ProtocolId, RewardItem } from '../types'

interface ProtocolGroup {
  protocol: ProtocolId
  rewards: RewardItem[]
  totalUsd: number
}

interface PendingTabProps {
  rewardsByProtocol: ProtocolGroup[]
  isLoading: boolean
  onClaimSingle: (protocol: ProtocolId, rewards: RewardItem[]) => void
  onClaimSelected: (protocols: ProtocolId[]) => void
  isClaiming: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function ProtocolRewardCard({
  group,
  isSelected,
  onToggle,
  onClaim,
  isClaiming,
}: {
  group: ProtocolGroup
  isSelected: boolean
  onToggle: () => void
  onClaim: () => void
  isClaiming: boolean
}) {
  const claimableRewards = group.rewards.filter((r) => r.claimable)
  const hasClaimable = claimableRewards.length > 0

  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasClaimable && (
              <Checkbox checked={isSelected} onCheckedChange={onToggle} disabled={isClaiming} />
            )}
            <ProtocolBadge name={PROTOCOL_NAMES[group.protocol]} />
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{formatCurrency(group.totalUsd)}</p>
            <p className="text-xs text-muted-foreground">{claimableRewards.length} claimable</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {group.rewards.map((reward, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
            <TokenDisplay symbol={reward.tokenSymbol} amount={reward.amount} />
            <div className="text-right">
              <p className="text-sm font-medium">{formatCurrency(reward.usdValue)}</p>
              {!reward.claimable && (
                <p className="text-xs text-muted-foreground">Locked</p>
              )}
            </div>
          </div>
        ))}
        {hasClaimable && (
          <Button
            onClick={onClaim}
            disabled={isClaiming}
            className="w-full mt-2"
            size="sm"
          >
            {isClaiming ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Claiming...
              </>
            ) : (
              `Claim ${PROTOCOL_NAMES[group.protocol]} Rewards`
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function PendingTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function PendingTab({
  rewardsByProtocol,
  isLoading,
  onClaimSingle,
  onClaimSelected,
  isClaiming,
}: PendingTabProps) {
  const [selectedProtocols, setSelectedProtocols] = useState<Set<ProtocolId>>(new Set())

  const claimableGroups = rewardsByProtocol.filter((g) =>
    g.rewards.some((r) => r.claimable)
  )

  const totalClaimable = claimableGroups.reduce((sum, g) => sum + g.totalUsd, 0)

  const toggleProtocol = useCallback((protocol: ProtocolId) => {
    setSelectedProtocols((prev) => {
      const next = new Set(prev)
      if (next.has(protocol)) {
        next.delete(protocol)
      } else {
        next.add(protocol)
      }
      return next
    })
  }, [])

  const selectAll = () => {
    setSelectedProtocols(new Set(claimableGroups.map((g) => g.protocol)))
  }

  const deselectAll = useCallback(() => {
    setSelectedProtocols(new Set())
  }, [])

  const handleClaimSelected = useCallback(() => {
    onClaimSelected(Array.from(selectedProtocols))
  }, [selectedProtocols, onClaimSelected])

  if (isLoading) return <PendingTabSkeleton />

  if (rewardsByProtocol.length === 0) {
    return (
      <EmptyState
        icon={Gift}
        title="No Pending Rewards"
        description="You don't have any pending rewards at the moment. Keep providing liquidity or staking to earn rewards."
      />
    )
  }

  const allSelected = selectedProtocols.size === claimableGroups.length && claimableGroups.length > 0

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Total Claimable</h3>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalClaimable)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={allSelected ? deselectAll : selectAll}>
            {allSelected ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
          <Button
            onClick={handleClaimSelected}
            disabled={selectedProtocols.size === 0 || isClaiming}
            size="sm"
          >
            {isClaiming ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Claiming...</>
            ) : (
              `Claim Selected (${selectedProtocols.size})`
            )}
          </Button>
        </div>
      </div>

      {/* Protocol Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {rewardsByProtocol.map((group) => (
          <ProtocolRewardCard
            key={group.protocol}
            group={group}
            isSelected={selectedProtocols.has(group.protocol)}
            onToggle={() => toggleProtocol(group.protocol)}
            onClaim={() => onClaimSingle(group.protocol, group.rewards.filter((r) => r.claimable))}
            isClaiming={isClaiming}
          />
        ))}
      </div>
    </div>
  )
}
