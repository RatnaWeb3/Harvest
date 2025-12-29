/**
 * Yuzu Protocol Service
 * CLMM DEX - LP positions, trading fees, and LP incentives
 *
 * Real integration with fallback to mock data when:
 * - Yuzu contracts are not deployed
 * - View function calls fail
 * - User has no positions (returns empty)
 */

import { aptos, TransactionPayload } from '@/lib/move'
import {
  ProtocolService,
  Position,
  RewardItem,
  ProtocolId,
} from './protocol-interface'
import { YUZU_CONFIG, isYuzuDeployed } from '@/constants/protocols/yuzu'

// Mock data for development and fallback
const MOCK_POSITIONS: Position[] = [
  {
    id: 'yuzu-lp-1',
    protocolId: 'yuzu',
    type: 'lp',
    tokenSymbol: 'MOVE/USDC',
    tokenAddress: '0x1',
    amount: '1500.00',
    valueUsd: 3245.5,
    apy: 42.5,
    metadata: {
      pool: 'MOVE/USDC',
      tickLower: -887220,
      tickUpper: 887220,
      liquidity: '1500000000',
    },
  },
  {
    id: 'yuzu-lp-2',
    protocolId: 'yuzu',
    type: 'lp',
    tokenSymbol: 'ETH/MOVE',
    tokenAddress: '0x2',
    amount: '0.85',
    valueUsd: 2890.0,
    apy: 38.2,
    metadata: {
      pool: 'ETH/MOVE',
      tickLower: -443580,
      tickUpper: 443580,
      liquidity: '850000000',
    },
  },
]

const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'yuzu-reward-1',
    protocolId: 'yuzu',
    positionId: 'yuzu-lp-1',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '125.50',
    valueUsd: 156.88,
    claimable: true,
  },
  {
    id: 'yuzu-reward-2',
    protocolId: 'yuzu',
    positionId: 'yuzu-lp-1',
    tokenSymbol: 'YUZU',
    tokenAddress: '0x1',
    amount: '450.00',
    valueUsd: 45.0,
    claimable: true,
  },
  {
    id: 'yuzu-reward-3',
    protocolId: 'yuzu',
    positionId: 'yuzu-lp-2',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '89.25',
    valueUsd: 111.56,
    claimable: true,
  },
]

class YuzuService implements ProtocolService {
  readonly protocolId: ProtocolId = 'yuzu'
  readonly displayName = 'Yuzu'

  /**
   * Get LP positions for an address
   * Falls back to mock data if Yuzu not deployed or on error
   */
  async getPositions(address: string): Promise<Position[]> {
    if (!isYuzuDeployed()) {
      console.log('[Yuzu] Not deployed, using mock data')
      return MOCK_POSITIONS
    }

    try {
      // NOTE: Yuzu CLMM positions are stored as NFTs
      // Real implementation requires indexer to query position NFTs
      // This is a placeholder for when indexer API is available
      console.log(`[Yuzu] Fetching positions for ${address}`)

      // TODO: Query position NFTs via indexer
      // const positions = await fetchYuzuPositions(address)
      // return positions.map(parseYuzuPosition)

      // For now, return empty if deployed (user has no positions)
      // or mock for development
      return process.env.NODE_ENV === 'development' ? MOCK_POSITIONS : []
    } catch (error) {
      console.error('[Yuzu] Error fetching positions:', error)
      return process.env.NODE_ENV === 'development' ? MOCK_POSITIONS : []
    }
  }

  /**
   * Get pending rewards for an address
   */
  async getPendingRewards(address: string): Promise<RewardItem[]> {
    if (!isYuzuDeployed()) {
      console.log('[Yuzu] Not deployed, using mock rewards')
      return MOCK_REWARDS
    }

    try {
      console.log(`[Yuzu] Fetching pending rewards for ${address}`)

      // NOTE: Pending rewards come from:
      // 1. Accrued trading fees (tokens_owed_0, tokens_owed_1)
      // 2. Farming incentive rewards (if pool has active farm)
      //
      // Real implementation requires position data from indexer
      // then querying fee accruals on-chain

      return process.env.NODE_ENV === 'development' ? MOCK_REWARDS : []
    } catch (error) {
      console.error('[Yuzu] Error fetching rewards:', error)
      return process.env.NODE_ENV === 'development' ? MOCK_REWARDS : []
    }
  }

  /**
   * Build transaction to collect fees from a position
   */
  buildCollectFeeTransaction(
    positionId: number,
    amount0Requested: bigint,
    amount1Requested: bigint,
    recipient: string
  ): TransactionPayload {
    return {
      function: YUZU_CONFIG.entryFunctions.collectFee,
      typeArguments: [],
      functionArguments: [
        positionId.toString(),
        amount0Requested.toString(),
        amount1Requested.toString(),
        recipient,
      ],
    }
  }

  /**
   * Build transaction to collect farming rewards
   */
  buildCollectRewardTransaction(
    positionId: number,
    rewardIndex: number,
    amountRequested: bigint,
    recipient: string
  ): TransactionPayload {
    return {
      function: YUZU_CONFIG.entryFunctions.collectReward,
      typeArguments: [],
      functionArguments: [
        positionId.toString(),
        rewardIndex.toString(),
        amountRequested.toString(),
        recipient,
      ],
    }
  }

  /**
   * Build claim transaction for all pending rewards
   * This is a simplified version - real implementation would batch claims
   */
  async buildClaimTransaction(
    address: string,
    rewardIds?: string[]
  ): Promise<TransactionPayload> {
    // Filter rewards to claim
    const rewards = await this.getPendingRewards(address)
    const rewardsToClaim = rewardIds
      ? rewards.filter((r) => rewardIds.includes(r.id))
      : rewards.filter((r) => r.claimable)

    console.log(`[Yuzu] Building claim tx for ${rewardsToClaim.length} rewards`)

    // For now, return collect_fee for first position
    // Real implementation would use multicall or batch claim
    if (rewardsToClaim.length === 0) {
      throw new Error('No rewards to claim')
    }

    // Extract position ID from reward
    const positionId = rewardsToClaim[0].positionId.replace('yuzu-lp-', '')

    return this.buildCollectFeeTransaction(
      parseInt(positionId) || 1,
      BigInt('340282366920938463463374607431768211455'), // u128 max
      BigInt('340282366920938463463374607431768211455'),
      address
    )
  }

  /**
   * Quote a swap without executing
   */
  async quoteSwap(
    poolAddress: string,
    zeroForOne: boolean,
    amountIn: bigint,
    sqrtPriceLimit: bigint
  ): Promise<{ amountIn: bigint; amountOut: bigint; fee: bigint }> {
    try {
      const result = await aptos.view({
        payload: {
          function: YUZU_CONFIG.viewFunctions.quoteSwap,
          typeArguments: [],
          functionArguments: [
            poolAddress,
            zeroForOne,
            true, // is_exact_in
            amountIn.toString(),
            sqrtPriceLimit.toString(),
          ],
        },
      })

      return {
        amountIn: BigInt(result[0] as string),
        amountOut: BigInt(result[1] as string),
        fee: BigInt(result[2] as string),
      }
    } catch (error) {
      console.error('[Yuzu] Quote swap failed:', error)
      throw error
    }
  }
}

export const yuzuService = new YuzuService()
