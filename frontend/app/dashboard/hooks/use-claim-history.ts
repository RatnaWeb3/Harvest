'use client'

/**
 * useClaimHistory Hook
 * Fetches claim history from the backend API
 */

import { useQuery } from '@tanstack/react-query'
import { api, ClaimRecord } from '@/lib/api'
import { useAptosWallet } from '@/lib/move'

const STALE_TIME = 60 * 1000 // 1 minute

export function useClaimHistory(limit = 50) {
  const { address, connected } = useAptosWallet()

  return useQuery<ClaimRecord[]>({
    queryKey: ['claim-history', address, limit],
    queryFn: () => api.getClaimHistory(address!, limit),
    enabled: connected && !!address,
    staleTime: STALE_TIME,
  })
}
