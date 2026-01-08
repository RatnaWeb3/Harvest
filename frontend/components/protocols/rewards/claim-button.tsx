'use client'

/**
 * ClaimButton Component
 * Individual claim button for protocol rewards with loading/success/error states
 */

import { Button } from '@/app/components/ui/button'
import { Loader2, Check, X } from 'lucide-react'
import { useClaimRewards } from '@/app/dashboard/hooks/use-claim-rewards'
import { isProtocolActive, ProtocolId } from '@/constants/protocols'
import type { RewardItem } from '@/app/dashboard/types'

interface ClaimButtonProps {
  protocolId: ProtocolId
  rewards: RewardItem[]
  disabled?: boolean
}

export function ClaimButton({ protocolId, rewards, disabled }: ClaimButtonProps) {
  const { claimRewards, isClaiming, isSuccess, isError } = useClaimRewards()

  const isActive = isProtocolActive(protocolId)

  const handleClaim = async () => {
    if (!isActive || protocolId !== 'joule') {
      // Only Joule claims are supported for now
      return
    }
    await claimRewards(protocolId, rewards)
  }

  if (!isActive) {
    return (
      <Button variant="outline" size="sm" disabled>
        Coming Soon
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={disabled || isClaiming || rewards.length === 0}
      size="sm"
      variant={isSuccess ? 'outline' : 'default'}
    >
      {isClaiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSuccess && <Check className="mr-2 h-4 w-4 text-green-500" />}
      {isError && <X className="mr-2 h-4 w-4 text-red-500" />}
      {isClaiming ? 'Claiming...' : isSuccess ? 'Claimed!' : 'Claim'}
    </Button>
  )
}
