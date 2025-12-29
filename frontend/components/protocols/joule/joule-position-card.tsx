'use client'

/**
 * JoulePositionCard Component
 * Displays a Joule lending/borrowing position
 */

import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import type { Position, RewardItem } from '@/lib/services/protocol-interface'
import { JouleHealthBadge } from './joule-health-badge'

interface JoulePositionCardProps {
  position: Position
  rewards: RewardItem[]
  healthFactor?: number
  onClaimRewards?: (positionId: string) => void
  isClaiming?: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value: number | undefined): string {
  if (!value) return '0%'
  return `${Math.abs(value).toFixed(1)}%`
}

export function JoulePositionCard({
  position,
  rewards,
  healthFactor,
  onClaimRewards,
  isClaiming = false,
}: JoulePositionCardProps) {
  const positionRewards = rewards.filter((r) => r.positionId === position.id)
  const totalRewardsUsd = positionRewards.reduce((sum, r) => sum + r.valueUsd, 0)
  const hasClaimableRewards = positionRewards.some((r) => r.claimable)

  const isSupply = position.type === 'supply'
  const isBorrow = position.type === 'borrow'

  const metadata = position.metadata as {
    collateralFactor?: number
    isCollateral?: boolean
    borrowLimit?: number
  }

  return (
    <Card className="border-blue-500/20 hover:border-blue-500/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Position type icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSupply ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {isSupply ? (
                <ArrowUpCircle className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{position.tokenSymbol}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={isSupply ? 'default' : 'destructive'} className="text-xs">
                  {isSupply ? 'Supply' : 'Borrow'}
                </Badge>
                {metadata?.isCollateral && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Collateral
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/30"
          >
            Joule
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position Value & APY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-xl font-bold">{formatCurrency(position.valueUsd)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {isSupply ? 'Supply APY' : 'Borrow APY'}
            </p>
            <p
              className={`text-xl font-bold flex items-center gap-1 ${
                isSupply ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              {formatPercent(position.apy)}
            </p>
          </div>
        </div>

        {/* Health Factor (for borrows) */}
        {isBorrow && healthFactor !== undefined && (
          <JouleHealthBadge healthFactor={healthFactor} />
        )}

        {/* Pending Rewards */}
        {positionRewards.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Pending Rewards</p>
            <div className="flex flex-wrap gap-2">
              {positionRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md"
                >
                  <span className="font-medium">{reward.amount}</span>
                  <span className="text-muted-foreground">{reward.tokenSymbol}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Total: {formatCurrency(totalRewardsUsd)}
            </p>
          </div>
        )}

        {/* Claim Button */}
        {hasClaimableRewards && onClaimRewards && (
          <Button
            onClick={() => onClaimRewards(position.id)}
            disabled={isClaiming}
            variant="outline"
            className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500"
          >
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
