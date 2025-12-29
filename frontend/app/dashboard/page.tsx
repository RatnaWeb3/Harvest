'use client'

/**
 * Dashboard Page
 * Main dashboard with portfolio overview, positions, and rewards
 */

import { useState, useCallback } from 'react'
import { useAptosWallet } from '@/lib/move'
import { usePortfolio } from './hooks/use-portfolio'
import { usePendingRewards } from './hooks/use-pending-rewards'
import { useBatchClaim } from './hooks/use-batch-claim'
import { QuickStats } from './components/quick-stats'
import { PortfolioSummary } from './components/portfolio-summary'
import { PositionsTable } from './components/positions-table'
import { RewardsBreakdown } from './components/rewards-breakdown'
import { RecentClaims } from './components/recent-claims'
import { ClaimAllCard } from './components/claim-all-card'
import { ErrorCard } from '@/components/shared/error-card'
import { TxStatusModal } from '@/components/shared/tx-status-modal'
import { ClaimAllModal } from '@/components/rewards/claim-all-modal'
import { BatchProgress } from '@/components/rewards/batch-progress'
import type { ProtocolId, RewardItem } from './types'

export default function DashboardPage() {
  const { connected } = useAptosWallet()
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)

  const {
    positions,
    stats,
    isLoading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = usePortfolio()
  const {
    rewards,
    rewardsByProtocol,
    claimableTotal,
    claimRewards,
    claimableRewards,
    isClaiming: isClaimingSingle,
    isLoading: rewardsLoading,
    error: rewardsError,
    refetch: refetchRewards,
    txState,
    isModalOpen: isTxModalOpen,
    closeModal: closeTxModal,
    explorerUrl,
  } = usePendingRewards()

  const batchClaim = useBatchClaim()

  const isLoading = portfolioLoading || rewardsLoading
  const hasError = portfolioError || rewardsError
  const isClaiming = isClaimingSingle || batchClaim.status === 'claiming'

  const handleClaimAll = () => {
    if (claimableRewards.length > 0) {
      claimRewards(claimableRewards)
    }
  }

  const handleOpenClaimModal = useCallback(() => setIsClaimModalOpen(true), [])
  const handleCloseClaimModal = useCallback(() => setIsClaimModalOpen(false), [])

  const handleClaimSelected = useCallback(
    (selectedProtocols: ProtocolId[]) => {
      setIsClaimModalOpen(false)
      const rewardsByProto = new Map<ProtocolId, RewardItem[]>()
      for (const protocol of selectedProtocols) {
        const protocolRewards = rewards.filter(
          (r) => r.protocol === protocol && r.claimable
        )
        if (protocolRewards.length > 0) {
          rewardsByProto.set(protocol, protocolRewards)
        }
      }
      batchClaim.executeBatchClaim(rewardsByProto)
    },
    [rewards, batchClaim]
  )

  const handleRetry = () => {
    refetchPortfolio()
    refetchRewards()
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Welcome to Harvest</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Connect your wallet to view your portfolio, track rewards, and claim earnings
          across the Movement ecosystem.
        </p>
      </div>
    )
  }

  if (hasError && !isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <ErrorCard
          title="Failed to load dashboard data"
          message={portfolioError || rewardsError || 'An unexpected error occurred'}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
      </div>

      <QuickStats stats={stats} isLoading={isLoading} />

      {/* Portfolio + Claim section - stacks on mobile */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioSummary
            stats={stats}
            claimableTotal={claimableTotal}
            isLoading={isLoading}
            onClaimAll={handleClaimAll}
            isClaiming={isClaiming}
          />
        </div>
        <ClaimAllCard
          rewardsByProtocol={rewardsByProtocol}
          claimableTotal={claimableTotal}
          isLoading={isLoading}
          onOpenModal={handleOpenClaimModal}
          isClaiming={isClaiming}
        />
      </div>

      {/* Positions + sidebar - stacks on mobile */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 order-1">
          <PositionsTable
            positions={positions}
            isLoading={isLoading}
            onClaimRewards={claimRewards}
            isClaiming={isClaiming}
          />
        </div>
        <div className="space-y-4 md:space-y-6 order-2 lg:order-2">
          <RewardsBreakdown
            rewardsByProtocol={rewardsByProtocol}
            isLoading={isLoading}
            onClaimRewards={claimRewards}
            isClaiming={isClaiming}
          />
          <RecentClaims isLoading={isLoading} />
        </div>
      </div>

      {/* Single claim modal */}
      <TxStatusModal
        isOpen={isTxModalOpen}
        onClose={closeTxModal}
        status={txState.status}
        protocol={txState.protocol}
        txHash={txState.txHash}
        error={txState.error}
        explorerUrl={explorerUrl}
        rewardsCount={txState.rewardsCount}
      />

      {/* Batch claim selection modal */}
      <ClaimAllModal
        isOpen={isClaimModalOpen}
        onClose={handleCloseClaimModal}
        rewardsByProtocol={rewardsByProtocol}
        onClaimSelected={handleClaimSelected}
        isClaiming={isClaiming}
      />

      {/* Batch claim progress modal */}
      <BatchProgress
        isOpen={batchClaim.isModalOpen}
        onClose={batchClaim.reset}
        state={batchClaim}
        getExplorerLink={batchClaim.getExplorerLink}
      />
    </div>
  )
}
