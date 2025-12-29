'use client'

/**
 * useCompoundStrategies Hook
 * Lists available compound strategies and calculates estimated APY
 * Uses mock data initially - will connect to real data when available
 */

import { useMemo } from 'react'
import type { CompoundStrategy } from '../types'

// Mock compound strategies - will be replaced with real data
const MOCK_STRATEGIES: CompoundStrategy[] = [
  {
    id: 'yuzu-lp-compound',
    name: 'Yuzu LP Auto-Compound',
    description: 'Automatically claim and reinvest LP rewards back into Yuzu pools',
    targetProtocol: 'yuzu',
    estimatedApy: 45.5,
    minRewardAmount: 10,
    isAvailable: false,
  },
  {
    id: 'joule-lending-compound',
    name: 'Joule Lending Optimizer',
    description: 'Compound lending rewards to maximize MOVE yield',
    targetProtocol: 'joule',
    estimatedApy: 28.3,
    minRewardAmount: 5,
    isAvailable: false,
  },
  {
    id: 'thunderhead-staking',
    name: 'Thunderhead Stake & Earn',
    description: 'Stake claimed rewards in Thunderhead for liquid staking returns',
    targetProtocol: 'thunderhead',
    estimatedApy: 12.8,
    minRewardAmount: 1,
    isAvailable: false,
  },
  {
    id: 'meridian-vault',
    name: 'Meridian Yield Vault',
    description: 'Deposit rewards into Meridian vaults for optimized returns',
    targetProtocol: 'meridian',
    estimatedApy: 35.2,
    minRewardAmount: 25,
    isAvailable: false,
  },
]

export function useCompoundStrategies() {
  // In the future, this will fetch real data from the backend
  const strategies = useMemo(() => MOCK_STRATEGIES, [])

  const availableStrategies = useMemo(
    () => strategies.filter((s) => s.isAvailable),
    [strategies]
  )

  const comingSoonStrategies = useMemo(
    () => strategies.filter((s) => !s.isAvailable),
    [strategies]
  )

  const bestApy = useMemo(
    () => Math.max(...strategies.map((s) => s.estimatedApy), 0),
    [strategies]
  )

  return {
    strategies,
    availableStrategies,
    comingSoonStrategies,
    bestApy,
    isLoading: false,
  }
}
