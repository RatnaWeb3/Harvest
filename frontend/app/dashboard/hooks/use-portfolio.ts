'use client'

/**
 * usePortfolio Hook
 * Fetches and aggregates positions from all integrated protocols via harvestService
 */

import { useQuery } from '@tanstack/react-query'
import { useAptosWallet } from '@/lib/move'
import { harvestService } from '@/lib/services'
import type { Position as ServicePosition } from '@/lib/services'
import type { Position, PortfolioStats, RewardItem, ProtocolId } from '../types'
import { DEFAULT_STATS, DATA_REFRESH_INTERVAL } from '../constants'

/**
 * Map service position type to dashboard position type
 */
function mapPositionType(type: string): Position['type'] {
  const typeMap: Record<string, Position['type']> = {
    lp: 'lp',
    supply: 'lending',
    borrow: 'lending',
    stake: 'staking',
    vault: 'vault',
  }
  return typeMap[type] || 'vault'
}

/**
 * Transform service position to dashboard position format
 */
function transformPosition(pos: ServicePosition): Position {
  return {
    id: pos.id,
    protocol: pos.protocolId as ProtocolId,
    type: mapPositionType(pos.type),
    asset: pos.tokenSymbol,
    assetSymbol: pos.tokenSymbol,
    balance: pos.amount,
    usdValue: pos.valueUsd,
    apy: pos.apy ?? 0,
    pendingRewards: [], // Rewards fetched separately via usePendingRewards
  }
}

/**
 * Calculate portfolio stats from positions
 */
function calculateStats(positions: Position[]): PortfolioStats {
  if (positions.length === 0) return DEFAULT_STATS

  const totalValue = positions.reduce((sum, pos) => sum + pos.usdValue, 0)
  const totalRewards = positions.reduce(
    (sum, pos) => sum + pos.pendingRewards.reduce((rSum, r) => rSum + r.usdValue, 0),
    0
  )
  const avgApy =
    positions.length > 0
      ? positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length
      : 0
  const protocolCount = new Set(positions.map((p) => p.protocol)).size

  return {
    totalValue,
    totalRewards,
    avgApy,
    protocolCount,
    // 24h change - would need historical data, using estimate for now
    change24h: totalValue * 0.02,
    change24hPercent: 2.0,
  }
}

export function usePortfolio() {
  const { address, connected } = useAptosWallet()

  const {
    data: positions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) return []
      const servicePositions = await harvestService.getAllPositions(address)
      return servicePositions.map(transformPosition)
    },
    enabled: connected && !!address,
    staleTime: DATA_REFRESH_INTERVAL,
    refetchInterval: DATA_REFRESH_INTERVAL,
  })

  const stats = calculateStats(positions)

  return {
    positions,
    stats,
    totalValue: stats.totalValue,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  }
}
