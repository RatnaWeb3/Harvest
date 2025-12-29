/**
 * Meridian Parser
 * Parses vault and liquid staking position data
 */

import type { Position, RewardItem } from '../protocol-interface'

// Raw vault position data
interface RawMeridianVault {
  vault_id: string
  vault_type: string
  deposited_amount: string
  share_amount: string
  token_address: string
}

// Raw staking position
interface RawMeridianStake {
  staked_amount: string
  mmove_amount: string
  exchange_rate: string
}

// Token metadata
const TOKEN_INFO: Record<string, { symbol: string; decimals: number }> = {
  '0x1::aptos_coin::AptosCoin': { symbol: 'MOVE', decimals: 8 },
}

// Mock USD prices
const TOKEN_PRICES: Record<string, number> = {
  MOVE: 1.25,
  mMOVE: 1.31,
  USDC: 1.0,
  MERID: 0.15,
}

// Vault metadata
const VAULT_INFO: Record<string, { name: string; strategy: string }> = {
  'delta-neutral': { name: 'Delta Neutral', strategy: 'CLMM Rebalancing' },
  stable: { name: 'Stable Yield', strategy: 'Lending Optimization' },
  aggressive: { name: 'High Yield', strategy: 'Leveraged Farming' },
}

/**
 * Parse raw Meridian vault position
 */
export function parseMeridianVault(
  raw: RawMeridianVault,
  index: number
): Position {
  const depositedAmount = Number(raw.deposited_amount) / 1e8
  const vaultInfo = VAULT_INFO[raw.vault_type] || { name: 'Unknown', strategy: '' }

  return {
    id: `meridian-vault-${index}`,
    protocolId: 'meridian',
    type: 'vault',
    tokenSymbol: `${vaultInfo.name} Vault`,
    tokenAddress: raw.token_address,
    amount: depositedAmount.toFixed(2),
    valueUsd: depositedAmount * TOKEN_PRICES.MOVE,
    apy: 0, // Would come from vault stats
    metadata: {
      vaultType: raw.vault_type,
      strategy: vaultInfo.strategy,
      shares: raw.share_amount,
    },
  }
}

/**
 * Parse raw Meridian liquid staking position
 */
export function parseMeridianStake(raw: RawMeridianStake): Position {
  const stakedAmount = Number(raw.staked_amount) / 1e8
  const mMoveAmount = Number(raw.mmove_amount) / 1e8
  const exchangeRate = Number(raw.exchange_rate) / 1e8

  return {
    id: 'meridian-stake-1',
    protocolId: 'meridian',
    type: 'stake',
    tokenSymbol: 'mMOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: mMoveAmount.toFixed(2),
    valueUsd: stakedAmount * TOKEN_PRICES.MOVE,
    apy: 12.0, // Would come from staking stats
    metadata: {
      exchangeRate,
      isLiquidStaking: true,
      underlyingAmount: stakedAmount,
    },
  }
}

/**
 * Parse raw Meridian reward
 */
export function parseMeridianReward(
  tokenAddress: string,
  amount: string,
  positionId: string,
  index: number
): RewardItem {
  const tokenInfo = TOKEN_INFO[tokenAddress] || { symbol: 'MERID', decimals: 8 }
  const amountNum = Number(amount) / Math.pow(10, tokenInfo.decimals)

  return {
    id: `meridian-reward-${index}`,
    protocolId: 'meridian',
    positionId,
    tokenSymbol: tokenInfo.symbol,
    tokenAddress,
    amount: amountNum.toFixed(2),
    valueUsd: amountNum * (TOKEN_PRICES[tokenInfo.symbol] || 0),
    claimable: amountNum > 0,
  }
}
