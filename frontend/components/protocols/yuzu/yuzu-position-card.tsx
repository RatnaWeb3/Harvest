'use client'

/**
 * YuzuPositionCard Component
 * Displays a Yuzu CLMM LP position with rewards info
 */

import { TrendingUp, Droplet, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import type { Position, RewardItem } from '@/lib/services/protocol-interface'

interface YuzuPositionCardProps {
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

export function YuzuPositionCard({
  position,
  rewards,
  onClaimRewards,
  isClaiming = false,
}: YuzuPositionCardProps) {
  const positionRewards = rewards.filter((r) => r.positionId === position.id)
  const totalRewardsUsd = positionRewards.reduce((sum, r) => sum + r.valueUsd, 0)
  const hasClaimableRewards = positionRewards.some((r) => r.claimable)

  // Parse pool pair from token symbol
  const [token0, token1] = position.tokenSymbol.split('/')

  // Get tick range info from metadata
  const metadata = position.metadata as {
    tickLower?: number
    tickUpper?: number
    liquidity?: string
    fee?: number
  }

  const feePercent = metadata?.fee ? metadata.fee / 10000 : 0.3

  return (
    <Card className="border-amber-500/20 hover:border-amber-500/40 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Token pair icons - using colored circles as placeholder */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-xs font-bold text-white">
                {token0?.[0]}
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-background flex items-center justify-center text-xs font-bold text-white">
                {token1?.[0]}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{position.tokenSymbol}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {feePercent}% fee
                </Badge>
                <span>CLMM</span>
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-500 border-amber-500/30"
          >
            <Droplet className="h-3 w-3 mr-1" />
            Yuzu
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Liquidity</p>
            <p className="text-xl font-bold">{formatCurrency(position.valueUsd)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">APR</p>
            <p className="text-xl font-bold text-green-500 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {formatPercent(position.apy)}
            </p>
          </div>
        </div>

        {/* Tick Range - CLMM specific */}
        {metadata?.tickLower !== undefined && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Price Range</p>
            <div className="flex items-center justify-between text-sm">
              <span>Lower: {metadata.tickLower}</span>
              <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              <span>Upper: {metadata.tickUpper}</span>
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
            className="w-full border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
          >
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
