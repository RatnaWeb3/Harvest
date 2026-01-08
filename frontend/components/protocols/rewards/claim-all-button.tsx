'use client'

/**
 * ClaimAllButton Component
 * Button to claim all pending rewards across protocols
 */

import { Button } from '@/app/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useClaimRewards } from '@/app/dashboard/hooks/use-claim-rewards'
import type { RewardItem } from '@/app/dashboard/types'

interface ClaimAllButtonProps {
  rewards: RewardItem[]
  totalValue: number
  disabled?: boolean
}

export function ClaimAllButton({ rewards, totalValue, disabled }: ClaimAllButtonProps) {
  const { claimRewards, isClaiming } = useClaimRewards()

  const handleClaimAll = async () => {
    // Currently only Joule is active, so claim all = claim Joule rewards
    const jouleRewards = rewards.filter((r) => r.protocol === 'joule' && r.claimable)
    if (jouleRewards.length === 0) return

    await claimRewards('joule', jouleRewards)
  }

  const hasClaimableRewards = rewards.some((r) => r.claimable && r.protocol === 'joule')

  return (
    <Button
      onClick={handleClaimAll}
      disabled={disabled || isClaiming || !hasClaimableRewards || totalValue === 0}
      className="w-full"
    >
      {isClaiming ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        `Claim All ($${totalValue.toFixed(2)})`
      )}
    </Button>
  )
}
