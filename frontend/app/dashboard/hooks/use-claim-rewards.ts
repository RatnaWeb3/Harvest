'use client'

/**
 * useClaimRewards Hook
 * Handles claiming rewards with transaction tracking, status updates, and toast notifications
 */

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAptosWallet, getExplorerUrl, aptos } from '@/lib/move'
import { getProtocolService, ProtocolId } from '@/lib/services'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { RewardItem } from '../types'

export type TxStatus = 'idle' | 'pending' | 'submitted' | 'confirmed' | 'failed'

export interface ClaimTransaction {
  id: string
  protocol: ProtocolId
  rewards: RewardItem[]
  status: TxStatus
  txHash?: string
  error?: string
  timestamp: number
}

export interface ClaimState {
  currentTx: ClaimTransaction | null
  isModalOpen: boolean
}

export function useClaimRewards() {
  const { address, signAndSubmitTransaction } = useAptosWallet()
  const queryClient = useQueryClient()
  const [state, setState] = useState<ClaimState>({
    currentTx: null,
    isModalOpen: false,
  })

  const openModal = useCallback(() => {
    setState((prev) => ({ ...prev, isModalOpen: true }))
  }, [])

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, isModalOpen: false, currentTx: null }))
  }, [])

  const updateTxStatus = useCallback(
    (updates: Partial<ClaimTransaction>) => {
      setState((prev) => ({
        ...prev,
        currentTx: prev.currentTx ? { ...prev.currentTx, ...updates } : null,
      }))
    },
    []
  )

  const claimMutation = useMutation({
    mutationFn: async ({
      protocol,
      rewards,
    }: {
      protocol: ProtocolId
      rewards: RewardItem[]
    }) => {
      if (!address || !signAndSubmitTransaction) {
        throw new Error('Wallet not connected')
      }

      console.log('[Claim] Starting claim for', protocol)

      const txId = `${protocol}-${Date.now()}`
      const tx: ClaimTransaction = {
        id: txId,
        protocol,
        rewards,
        status: 'pending',
        timestamp: Date.now(),
      }

      setState({ currentTx: tx, isModalOpen: true })

      const service = getProtocolService(protocol)
      if (!service) {
        throw new Error(`Protocol ${protocol} is not currently active`)
      }
      const rewardIds = rewards.map((r) => r.token)
      const payload = await service.buildClaimTransaction(address, rewardIds)

      console.log('[Claim] Transaction payload:', payload)
      updateTxStatus({ status: 'submitted' })

      const txHash = await signAndSubmitTransaction(payload)
      console.log('[Claim] Transaction submitted:', txHash)

      // Wait for confirmation
      const result = await aptos.waitForTransaction({
        transactionHash: txHash,
      })

      console.log('[Claim] Transaction confirmed:', result.success)

      if (!result.success) {
        throw new Error('Transaction failed on-chain')
      }

      updateTxStatus({ status: 'confirmed', txHash })
      return { txHash, rewards, protocol }
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-rewards'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      queryClient.invalidateQueries({ queryKey: ['claim-history'] })

      // Record claim to backend (non-blocking)
      if (address) {
        try {
          // Calculate total value from rewards
          const totalValue = data.rewards.reduce((sum, r) => sum + (r.usdValue || 0), 0)
          const totalAmount = data.rewards.reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0)

          await api.recordClaim({
            address,
            protocol: data.protocol,
            txHash: data.txHash,
            amount: totalAmount.toString(),
            tokenSymbol: 'MOVE',
            valueUsd: totalValue,
          })
          console.log('[Claim] Recorded to backend')
        } catch (error) {
          console.error('[Claim] Failed to record:', error)
          // Don't fail the claim if backend recording fails
        }
      }

      toast.success('Rewards claimed!', {
        description: 'Transaction confirmed',
        action: {
          label: 'View',
          onClick: () => window.open(getExplorerUrl('txn', data.txHash), '_blank'),
        },
      })
    },
    onError: (error: Error) => {
      console.error('[Claim] Error:', error)
      updateTxStatus({ status: 'failed', error: error.message })

      // Handle user rejection specially
      if (error.message.includes('rejected') || error.message.includes('cancelled')) {
        toast.info('Transaction cancelled')
        return
      }

      toast.error('Claim failed', {
        description: error.message,
      })
    },
  })

  const claimRewards = useCallback(
    (protocol: ProtocolId, rewards: RewardItem[]) => {
      return claimMutation.mutateAsync({ protocol, rewards })
    },
    [claimMutation]
  )

  const getExplorerLink = useCallback((txHash: string) => {
    return getExplorerUrl('txn', txHash)
  }, [])

  return {
    claimRewards,
    isClaiming: claimMutation.isPending,
    isSuccess: claimMutation.isSuccess,
    isError: claimMutation.isError,
    currentTx: state.currentTx,
    isModalOpen: state.isModalOpen,
    openModal,
    closeModal,
    getExplorerLink,
  }
}
