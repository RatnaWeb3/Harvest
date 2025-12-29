'use client'

/**
 * Rewards Management Page
 * Tab-based interface for pending rewards, claim history, and compound strategies
 */

import { useState, useCallback } from 'react'
import { useAptosWallet } from '@/lib/move'
import { usePendingRewards } from '@/app/dashboard/hooks/use-pending-rewards'
import { useClaimHistory } from './hooks/use-claim-history'
import { useCompoundStrategies } from './hooks/use-compound-strategies'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { PendingTab } from './components/pending-tab'
import { HistoryTab } from './components/history-tab'
import { CompoundTab } from './components/compound-tab'
import type { RewardsTab, ProtocolId, RewardItem } from './types'

export default function RewardsPage() {
  const { connected } = useAptosWallet()
  const [activeTab, setActiveTab] = useState<RewardsTab>('pending')

  const {
    rewardsByProtocol,
    claimRewards,
    isLoading: rewardsLoading,
    isClaiming,
  } = usePendingRewards()

  const claimHistory = useClaimHistory()
  const compoundStrategies = useCompoundStrategies()

  const handleClaimSingle = useCallback(
    (protocol: ProtocolId, rewards: RewardItem[]) => {
      claimRewards(rewards)
    },
    [claimRewards]
  )

  const handleClaimSelected = useCallback(
    (protocols: ProtocolId[]) => {
      const selectedRewards = rewardsByProtocol
        .filter((g) => protocols.includes(g.protocol))
        .flatMap((g) => g.rewards.filter((r) => r.claimable))
      if (selectedRewards.length > 0) {
        claimRewards(selectedRewards)
      }
    },
    [rewardsByProtocol, claimRewards]
  )

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <h1 className="text-2xl font-bold">Rewards Management</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Connect your wallet to view and manage your rewards across protocols.
        </p>
      </div>
    )
  }

  const pendingGroups = rewardsByProtocol.map((g) => ({
    protocol: g.protocol,
    rewards: g.rewards,
    totalUsd: g.totalUsdValue,
  }))

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rewards</h1>
          <p className="text-sm text-muted-foreground">
            Manage, claim, and compound your rewards
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RewardsTab)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="compound">Compound</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <PendingTab
            rewardsByProtocol={pendingGroups}
            isLoading={rewardsLoading}
            onClaimSingle={handleClaimSingle}
            onClaimSelected={handleClaimSelected}
            isClaiming={isClaiming}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryTab
            history={claimHistory.history}
            pagination={claimHistory.pagination}
            filters={claimHistory.filters}
            isLoading={claimHistory.isLoading}
            onSetProtocolFilter={claimHistory.setProtocolFilter}
            onClearFilters={claimHistory.clearFilters}
            onGoToPage={claimHistory.goToPage}
            onExportCSV={claimHistory.exportCSV}
          />
        </TabsContent>

        <TabsContent value="compound" className="mt-6">
          <CompoundTab
            availableStrategies={compoundStrategies.availableStrategies}
            comingSoonStrategies={compoundStrategies.comingSoonStrategies}
            bestApy={compoundStrategies.bestApy}
            isLoading={compoundStrategies.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
