'use client'

/**
 * useClaimRewards Hook
 * Handles claiming rewards with transaction tracking and status updates
 */

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAptosWallet, getExplorerUrl } from '@/lib/move'
import { getProtocolService, ProtocolId } from '@/lib/services'
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

      const txId = `${protocol}-${Date.now()}`
      const tx: ClaimTransaction = {
        id: txId,
        protocol,
        rewards,
        status: 'pending',
        timestamp: Date.now(),
      }

      setState({ currentTx: tx, isModalOpen: true })

      try {
        const service = getProtocolService(protocol)
        const rewardIds = rewards.map((r) => r.token)
        const payload = await service.buildClaimTransaction(address, rewardIds)

        updateTxStatus({ status: 'submitted' })

        const txHash = await signAndSubmitTransaction(payload)
        updateTxStatus({ status: 'confirmed', txHash })

        return { txHash, rewards, protocol }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Transaction failed'
        updateTxStatus({ status: 'failed', error: errorMessage })
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-rewards'] })
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
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
    currentTx: state.currentTx,
    isModalOpen: state.isModalOpen,
    openModal,
    closeModal,
    getExplorerLink,
  }
}
