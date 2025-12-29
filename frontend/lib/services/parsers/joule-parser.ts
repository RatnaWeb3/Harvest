/**
 * Joule Parser
 * Parses raw lending positions and rewards to typed interfaces
 */

import type { Position, RewardItem } from '../protocol-interface'

// Raw position data from Joule view functions
interface RawJoulePosition {
  market_id: string
  token_address: string
  supplied_amount: string
  borrowed_amount: string
  collateral_enabled: boolean
}

// Raw reward data
interface RawJouleReward {
  token_address: string
  amount: string
  market_id: string
}

// Token metadata
const TOKEN_INFO: Record<string, { symbol: string; decimals: number }> = {
  '0x1::aptos_coin::AptosCoin': { symbol: 'MOVE', decimals: 8 },
}

// Mock USD prices
const TOKEN_PRICES: Record<string, number> = {
  MOVE: 1.25,
  USDC: 1.0,
  USDT: 1.0,
  WETH: 3500,
  JOULE: 0.2,
}

/**
 * Parse raw Joule supply position
 */
export function parseJouleSupplyPosition(
  raw: RawJoulePosition,
  index: number
): Position | null {
  const tokenInfo = TOKEN_INFO[raw.token_address] || { symbol: 'Unknown', decimals: 8 }
  const amount = Number(raw.supplied_amount) / Math.pow(10, tokenInfo.decimals)

  if (amount === 0) return null

  return {
    id: `joule-supply-${index}`,
    protocolId: 'joule',
    type: 'supply',
    tokenSymbol: tokenInfo.symbol,
    tokenAddress: raw.token_address,
    amount: amount.toFixed(2),
    valueUsd: amount * (TOKEN_PRICES[tokenInfo.symbol] || 1),
    apy: 0, // Would come from market data
    metadata: {
      collateralFactor: 0.75,
      isCollateral: raw.collateral_enabled,
    },
  }
}

/**
 * Parse raw Joule borrow position
 */
export function parseJouleBorrowPosition(
  raw: RawJoulePosition,
  index: number
): Position | null {
  const tokenInfo = TOKEN_INFO[raw.token_address] || { symbol: 'Unknown', decimals: 8 }
  const amount = Number(raw.borrowed_amount) / Math.pow(10, tokenInfo.decimals)

  if (amount === 0) return null

  return {
    id: `joule-borrow-${index}`,
    protocolId: 'joule',
    type: 'borrow',
    tokenSymbol: tokenInfo.symbol,
    tokenAddress: raw.token_address,
    amount: amount.toFixed(2),
    valueUsd: amount * (TOKEN_PRICES[tokenInfo.symbol] || 1),
    apy: 0, // Would be negative for borrows
    metadata: {
      borrowLimit: 0,
      healthFactor: 0,
    },
  }
}

/**
 * Parse raw Joule reward
 */
export function parseJouleReward(
  raw: RawJouleReward,
  positionId: string,
  index: number
): RewardItem {
  const tokenInfo = TOKEN_INFO[raw.token_address] || { symbol: 'MOVE', decimals: 8 }
  const amount = Number(raw.amount) / Math.pow(10, tokenInfo.decimals)

  return {
    id: `joule-reward-${index}`,
    protocolId: 'joule',
    positionId,
    tokenSymbol: tokenInfo.symbol,
    tokenAddress: raw.token_address,
    amount: amount.toFixed(2),
    valueUsd: amount * (TOKEN_PRICES[tokenInfo.symbol] || 0),
    claimable: amount > 0,
  }
}

/**
 * Calculate health factor from positions
 */
export function calculateHealthFactor(positions: Position[]): number {
  const supplied = positions
    .filter((p) => p.type === 'supply')
    .reduce((sum, p) => sum + p.valueUsd * 0.75, 0)

  const borrowed = positions
    .filter((p) => p.type === 'borrow')
    .reduce((sum, p) => sum + p.valueUsd, 0)

  if (borrowed === 0) return Infinity
  return supplied / borrowed
}
