'use client'

/**
 * usePendingRewards Hook
 * Fetches and aggregates pending rewards from all protocols via harvestService
 */

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAptosWallet, getExplorerUrl } from '@/lib/move'
import { harvestService } from '@/lib/services'
import { showTxPending, showTxSuccess, showTxError, dismissToast } from '@/lib/toast'
import type { RewardItem as ServiceReward, ProtocolId as ServiceProtocolId } from '@/lib/services'
import type { RewardItem, ProtocolRewards, ProtocolId } from '../types'
import { PROTOCOL_NAMES, DATA_REFRESH_INTERVAL } from '../constants'
import { saveClaimRecord } from '../components/recent-claims'

export type TxStatus = 'idle' | 'pending' | 'submitted' | 'confirmed' | 'failed'

export interface ClaimTxState {
  status: TxStatus
  protocol?: ProtocolId
  txHash?: string
  error?: string
  rewardsCount: number
}

/**
 * Transform service reward to dashboard reward format
 */
function transformReward(reward: ServiceReward): RewardItem {
  return {
    protocol: reward.protocolId as ProtocolId,
    token: reward.tokenAddress,
    tokenSymbol: reward.tokenSymbol,
    amount: reward.amount,
    usdValue: reward.valueUsd,
    claimable: reward.claimable,
  }
}

/**
 * Group rewards by protocol for display
 */
function groupByProtocol(rewards: RewardItem[]): ProtocolRewards[] {
  const grouped = rewards.reduce(
    (acc, reward) => {
      if (!acc[reward.protocol]) {
        acc[reward.protocol] = {
          protocol: reward.protocol,
          protocolName: PROTOCOL_NAMES[reward.protocol] || reward.protocol,
          rewards: [],
          totalUsdValue: 0,
        }
      }
      acc[reward.protocol].rewards.push(reward)
      acc[reward.protocol].totalUsdValue += reward.usdValue
      return acc
    },
    {} as Record<ProtocolId, ProtocolRewards>
  )

  return Object.values(grouped).sort((a, b) => b.totalUsdValue - a.totalUsdValue)
}

const initialTxState: ClaimTxState = {
  status: 'idle',
  rewardsCount: 0,
}

export function usePendingRewards() {
  const { address, connected, signAndSubmitTransaction } = useAptosWallet()
  const queryClient = useQueryClient()
  const [txState, setTxState] = useState<ClaimTxState>(initialTxState)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setTxState(initialTxState)
  }, [])

  const {
    data: rewards = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pending-rewards', address],
    queryFn: async () => {
      if (!address) return []
      const serviceRewards = await harvestService.getAllPendingRewards(address)
      return serviceRewards.map(transformReward)
    },
    enabled: connected && !!address,
    staleTime: DATA_REFRESH_INTERVAL,
    refetchInterval: DATA_REFRESH_INTERVAL,
  })

  const claimMutation = useMutation({
    mutationFn: async (rewardsToClaim: RewardItem[]) => {
      if (!address || !signAndSubmitTransaction) {
        throw new Error('Wallet not connected')
      }

      // Group rewards by protocol for batch claiming
      const claimsByProtocol = rewardsToClaim.reduce(
        (acc, r) => {
          if (!acc[r.protocol]) acc[r.protocol] = []
          acc[r.protocol].push(r)
          return acc
        },
        {} as Record<ProtocolId, RewardItem[]>
      )

      const results: { protocol: ProtocolId; txHash: string; amount: number }[] = []

      // Build and submit transactions for each protocol
      for (const [protocolId, protocolRewards] of Object.entries(claimsByProtocol)) {
        const protocol = protocolId as ProtocolId
        const rewardIds = protocolRewards.map((r) => r.token)
        const totalAmount = protocolRewards.reduce((sum, r) => sum + r.usdValue, 0)

        setTxState({
          status: 'pending',
          protocol,
          rewardsCount: protocolRewards.length,
        })
        setIsModalOpen(true)

        const toastId = showTxPending(`Claiming ${PROTOCOL_NAMES[protocol]} rewards...`)

        try {
          const tx = await harvestService.buildClaimTransaction(
            address,
            protocolId as ServiceProtocolId,
            rewardIds
          )

          setTxState((prev) => ({ ...prev, status: 'submitted' }))

          const txHash = await signAndSubmitTransaction(tx)

          setTxState((prev) => ({ ...prev, status: 'confirmed', txHash }))
          dismissToast(toastId)
          showTxSuccess(txHash, `Claimed ${PROTOCOL_NAMES[protocol]} rewards!`)

          // Save to recent claims
          saveClaimRecord({
            protocol,
            txHash,
            amount: totalAmount,
            timestamp: Date.now(),
          })

          results.push({ protocol, txHash, amount: totalAmount })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
          setTxState((prev) => ({ ...prev, status: 'failed', error: errorMessage }))
          dismissToast(toastId)
          showTxError(errorMessage)
          throw err
        }
      }

      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-rewards'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })

  const totalRewardsUSD = rewards.reduce((sum, r) => sum + r.usdValue, 0)
  const claimableRewards = rewards.filter((r) => r.claimable)
  const claimableTotal = claimableRewards.reduce((sum, r) => sum + r.usdValue, 0)
  const rewardsByProtocol = groupByProtocol(rewards)

  const explorerUrl = txState.txHash ? getExplorerUrl('txn', txState.txHash) : undefined

  return {
    rewards,
    rewardsByProtocol,
    totalRewardsUSD,
    claimableRewards,
    claimableTotal,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    claimRewards: claimMutation.mutate,
    isClaiming: claimMutation.isPending,
    claimError: claimMutation.error ? (claimMutation.error as Error).message : null,
    // Transaction state
    txState,
    isModalOpen,
    closeModal,
    explorerUrl,
  }
}
