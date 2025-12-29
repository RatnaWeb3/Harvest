'use client'

/**
 * MeridianPositionCard Component
 * Displays a Meridian vault or staking position
 */

import { Vault, Coins, TrendingUp, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import type { Position, RewardItem } from '@/lib/services/protocol-interface'

interface MeridianPositionCardProps {
  position: Position
  rewards: RewardItem[]
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
  return `${value.toFixed(1)}%`
}

export function MeridianPositionCard({
  position,
  rewards,
  onClaimRewards,
  isClaiming = false,
}: MeridianPositionCardProps) {
  const positionRewards = rewards.filter((r) => r.positionId === position.id)
  const totalRewardsUsd = positionRewards.reduce((sum, r) => sum + r.valueUsd, 0)
  const hasClaimableRewards = positionRewards.some((r) => r.claimable)

  const isVault = position.type === 'vault'
  const isStake = position.type === 'stake'

  const metadata = position.metadata as {
    vaultType?: string
    strategy?: string
    exchangeRate?: number
    isLiquidStaking?: boolean
    tvl?: number
  }

  return (
    <Card className="border-purple-500/20 hover:border-purple-500/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Position type icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isVault ? 'bg-purple-500/20' : 'bg-indigo-500/20'
              }`}
            >
              {isVault ? (
                <Vault className="h-5 w-5 text-purple-500" />
              ) : (
                <Coins className="h-5 w-5 text-indigo-500" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{position.tokenSymbol}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {isVault ? metadata?.vaultType || 'Vault' : 'Liquid Staking'}
                </Badge>
                {metadata?.strategy && (
                  <span className="text-xs">{metadata.strategy}</span>
                )}
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-500 border-purple-500/30"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Meridian
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position Value & APY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Deposited</p>
            <p className="text-xl font-bold">{formatCurrency(position.valueUsd)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">APY</p>
            <p className="text-xl font-bold text-green-500 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {formatPercent(position.apy)}
            </p>
          </div>
        </div>

        {/* Liquid Staking Info */}
        {isStake && metadata?.exchangeRate && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">
                1 mMOVE = {metadata.exchangeRate.toFixed(4)} MOVE
              </span>
            </div>
          </div>
        )}

        {/* Vault TVL */}
        {isVault && metadata?.tvl && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Value Locked</span>
              <span className="font-medium">
                {formatCurrency(metadata.tvl)}
              </span>
            </div>
          </div>
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
            className="w-full border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-500"
          >
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
