'use client'

/**
 * Claim Button Component
 * Reusable button for claiming rewards with loading state
 */

import { Loader2, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import type { RewardItem, ProtocolId } from '@/app/dashboard/types'

interface ClaimButtonProps {
  rewards: RewardItem[]
  protocol: ProtocolId
  onClaim: (protocol: ProtocolId, rewards: RewardItem[]) => void
  isClaiming: boolean
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  label?: string
}

export function ClaimButton({
  rewards,
  protocol,
  onClaim,
  isClaiming,
  disabled = false,
  variant = 'default',
  size = 'sm',
  className,
  label = 'Claim',
}: ClaimButtonProps) {
  const claimableRewards = rewards.filter((r) => r.claimable)
  const hasClaimable = claimableRewards.length > 0
  const isDisabled = disabled || isClaiming || !hasClaimable

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDisabled) {
      onClaim(protocol, claimableRewards)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {isClaiming ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          <Check className="h-3 w-3" />
          {label}
        </>
      )}
    </Button>
  )
}
