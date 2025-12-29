/**
 * Yuzu Parser
 * Parses raw view function results to typed Position and RewardItem
 */

import type { Position, RewardItem } from '../protocol-interface'

// Raw position data from Yuzu view functions
interface RawYuzuPosition {
  position_id: string
  pool_address: string
  tick_lower: number
  tick_upper: number
  liquidity: string
  fee_growth_inside_0: string
  fee_growth_inside_1: string
  tokens_owed_0: string
  tokens_owed_1: string
}

// Raw pool data
interface RawPoolData {
  token_0: string
  token_1: string
  fee: number
  sqrt_price: string
  tick: number
  liquidity: string
}

// Token metadata cache (would be populated from indexer)
const TOKEN_SYMBOLS: Record<string, string> = {
  '0x1::aptos_coin::AptosCoin': 'MOVE',
}

// Mock USD prices for value calculation
const TOKEN_PRICES: Record<string, number> = {
  MOVE: 1.25,
  USDC: 1.0,
  USDT: 1.0,
  ETH: 3500,
  YUZU: 0.1,
}

/**
 * Parse raw Yuzu position data to Position type
 */
export function parseYuzuPosition(
  raw: RawYuzuPosition,
  poolData: RawPoolData
): Position {
  const token0Symbol = TOKEN_SYMBOLS[poolData.token_0] || 'Unknown'
  const token1Symbol = TOKEN_SYMBOLS[poolData.token_1] || 'Unknown'
  const pairSymbol = `${token0Symbol}/${token1Symbol}`

  // Calculate USD value (simplified - real impl needs sqrtPrice calc)
  const liquidityNum = Number(raw.liquidity) / 1e8
  const valueUsd = liquidityNum * (TOKEN_PRICES[token0Symbol] || 1)

  return {
    id: `yuzu-lp-${raw.position_id}`,
    protocolId: 'yuzu',
    type: 'lp',
    tokenSymbol: pairSymbol,
    tokenAddress: raw.pool_address,
    amount: liquidityNum.toFixed(4),
    valueUsd,
    apy: 0, // Would come from farming rewards
    metadata: {
      pool: pairSymbol,
      tickLower: raw.tick_lower,
      tickUpper: raw.tick_upper,
      liquidity: raw.liquidity,
      fee: poolData.fee,
    },
  }
}

/**
 * Parse raw Yuzu reward data to RewardItem type
 */
export function parseYuzuReward(
  positionId: string,
  tokenSymbol: string,
  tokenAddress: string,
  amount: string,
  rewardIndex: number
): RewardItem {
  const amountNum = Number(amount) / 1e8
  const price = TOKEN_PRICES[tokenSymbol] || 0

  return {
    id: `yuzu-reward-${positionId}-${rewardIndex}`,
    protocolId: 'yuzu',
    positionId: `yuzu-lp-${positionId}`,
    tokenSymbol,
    tokenAddress,
    amount: amountNum.toFixed(4),
    valueUsd: amountNum * price,
    claimable: amountNum > 0,
  }
}

/**
 * Parse fee rewards (tokens_owed_0, tokens_owed_1)
 */
export function parseYuzuFees(
  position: RawYuzuPosition,
  poolData: RawPoolData
): RewardItem[] {
  const rewards: RewardItem[] = []
  const token0Symbol = TOKEN_SYMBOLS[poolData.token_0] || 'Token0'
  const token1Symbol = TOKEN_SYMBOLS[poolData.token_1] || 'Token1'

  if (Number(position.tokens_owed_0) > 0) {
    rewards.push(
      parseYuzuReward(
        position.position_id,
        token0Symbol,
        poolData.token_0,
        position.tokens_owed_0,
        0
      )
    )
  }

  if (Number(position.tokens_owed_1) > 0) {
    rewards.push(
      parseYuzuReward(
        position.position_id,
        token1Symbol,
        poolData.token_1,
        position.tokens_owed_1,
        1
      )
    )
  }

  return rewards
}
