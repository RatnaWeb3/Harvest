'use client'

/**
 * useEligibilityCheck Hook
 * Check eligibility for a specific airdrop
 */

import { useState, useCallback } from 'react'
import { useAptosWallet } from '@/lib/move'
import { airdropService } from '@/lib/services/airdrop-service'
import type { EligibilityResult } from '../types'

interface UseEligibilityCheckResult {
  result: EligibilityResult | null
  isChecking: boolean
  error: string | null
  checkEligibility: (airdropId: string) => Promise<void>
  reset: () => void
}

export function useEligibilityCheck(): UseEligibilityCheckResult {
  const { address } = useAptosWallet()
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEligibility = useCallback(
    async (airdropId: string) => {
      if (!address) {
        setError('Please connect your wallet to check eligibility')
        return
      }

      setIsChecking(true)
      setError(null)

      try {
        const eligibility = await airdropService.checkEligibility(airdropId, address)
        setResult(eligibility)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check eligibility')
      } finally {
        setIsChecking(false)
      }
    },
    [address]
  )

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setIsChecking(false)
  }, [])

  return {
    result,
    isChecking,
    error,
    checkEligibility,
    reset,
  }
}
