'use client'

/**
 * useBatchClaim Hook
 * Handles batch claiming of rewards from multiple protocols with progress tracking
 */

import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAptosWallet, getExplorerUrl } from '@/lib/move'
import { harvestService } from '@/lib/services'
import { ProtocolId as ServiceProtocolId } from '@/lib/services'
import { showTxPending, showTxSuccess, showTxError, dismissToast } from '@/lib/toast'
import { PROTOCOL_NAMES } from '../constants'
import { saveClaimRecord } from '../components/recent-claims'
import type { RewardItem, ProtocolId } from '../types'

export type BatchClaimStatus = 'idle' | 'preparing' | 'claiming' | 'completed' | 'failed'

export interface ProtocolClaimResult {
  protocol: ProtocolId
  status: 'pending' | 'success' | 'failed'
  txHash?: string
  error?: string
  amount: number
}

export interface BatchClaimState {
  status: BatchClaimStatus
  currentProtocol?: ProtocolId
  currentIndex: number
  totalClaims: number
  results: ProtocolClaimResult[]
  error?: string
}

const initialState: BatchClaimState = {
  status: 'idle',
  currentIndex: 0,
  totalClaims: 0,
  results: [],
}

export function useBatchClaim() {
  const { address, signAndSubmitTransaction } = useAptosWallet()
  const queryClient = useQueryClient()
  const [state, setState] = useState<BatchClaimState>(initialState)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const reset = useCallback(() => {
    setState(initialState)
    setIsModalOpen(false)
  }, [])

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const executeBatchClaim = useCallback(
    async (rewardsByProtocol: Map<ProtocolId, RewardItem[]>) => {
      if (!address || !signAndSubmitTransaction) {
        throw new Error('Wallet not connected')
      }

      const protocols = Array.from(rewardsByProtocol.keys())
      const claims = protocols.map((protocol) => ({
        protocol: protocol as ServiceProtocolId,
        rewardIds: rewardsByProtocol.get(protocol)?.map((r) => r.token),
      }))

      setState({
        status: 'preparing',
        currentIndex: 0,
        totalClaims: protocols.length,
        results: protocols.map((protocol) => ({
          protocol,
          status: 'pending' as const,
          amount: rewardsByProtocol.get(protocol)?.reduce((sum, r) => sum + r.usdValue, 0) || 0,
        })),
      })
      setIsModalOpen(true)

      const { payloads, protocols: validProtocols } = await harvestService.buildBatchClaimPayload(
        address,
        claims
      )

      const results: ProtocolClaimResult[] = []

      for (let i = 0; i < payloads.length; i++) {
        const protocol = validProtocols[i]
        const amount = rewardsByProtocol.get(protocol)?.reduce((sum, r) => sum + r.usdValue, 0) || 0

        setState((prev) => ({
          ...prev,
          status: 'claiming',
          currentProtocol: protocol,
          currentIndex: i,
        }))

        const toastId = showTxPending(`Claiming ${PROTOCOL_NAMES[protocol]} rewards...`)

        try {
          const txHash = await signAndSubmitTransaction(payloads[i])

          results.push({ protocol, status: 'success', txHash, amount })
          dismissToast(toastId)
          showTxSuccess(txHash, `Claimed ${PROTOCOL_NAMES[protocol]} rewards!`)

          saveClaimRecord({ protocol, txHash, amount, timestamp: Date.now() })

          setState((prev) => ({
            ...prev,
            results: prev.results.map((r) =>
              r.protocol === protocol ? { ...r, status: 'success', txHash } : r
            ),
          }))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
          results.push({ protocol, status: 'failed', error: errorMessage, amount })
          dismissToast(toastId)
          showTxError(`${PROTOCOL_NAMES[protocol]}: ${errorMessage}`)

          setState((prev) => ({
            ...prev,
            results: prev.results.map((r) =>
              r.protocol === protocol ? { ...r, status: 'failed', error: errorMessage } : r
            ),
          }))
        }
      }

      const hasSuccess = results.some((r) => r.status === 'success')
      const hasFailed = results.some((r) => r.status === 'failed')

      setState((prev) => ({
        ...prev,
        status: hasSuccess ? 'completed' : 'failed',
        error: hasFailed && !hasSuccess ? 'All claims failed' : undefined,
      }))

      if (hasSuccess) {
        queryClient.invalidateQueries({ queryKey: ['pending-rewards'] })
        queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      }

      return results
    },
    [address, signAndSubmitTransaction, queryClient]
  )

  const getExplorerLink = useCallback((txHash: string) => {
    return getExplorerUrl('txn', txHash)
  }, [])

  return {
    ...state,
    isModalOpen,
    openModal,
    closeModal,
    reset,
    executeBatchClaim,
    getExplorerLink,
  }
}
