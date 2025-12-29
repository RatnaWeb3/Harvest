/**
 * Meridian Protocol Service
 * Liquid Staking & Vaults - mMOVE staking, yield vaults, MOVE incentives
 *
 * Twitter: @meridian_money
 * Real integration with fallback to mock data
 */

import { aptos, TransactionPayload } from '@/lib/move'
import {
  ProtocolService,
  Position,
  RewardItem,
  ProtocolId,
} from './protocol-interface'
import { MERIDIAN_CONFIG, isMeridianDeployed } from '@/constants/protocols/meridian'

// Mock vault/staking positions for development
const MOCK_POSITIONS: Position[] = [
  {
    id: 'meridian-vault-1',
    protocolId: 'meridian',
    type: 'vault',
    tokenSymbol: 'MOVE-USDC Vault',
    tokenAddress: '0x1',
    amount: '1200.00',
    valueUsd: 2450.0,
    apy: 28.5,
    metadata: {
      vaultType: 'delta-neutral',
      strategy: 'CLMM Rebalancing',
      tvl: 5200000,
    },
  },
  {
    id: 'meridian-vault-2',
    protocolId: 'meridian',
    type: 'vault',
    tokenSymbol: 'Stable Yield Vault',
    tokenAddress: '0x2',
    amount: '3500.00',
    valueUsd: 3500.0,
    apy: 15.2,
    metadata: {
      vaultType: 'stable',
      strategy: 'Lending Optimization',
      tvl: 12500000,
    },
  },
  {
    id: 'meridian-stake-1',
    protocolId: 'meridian',
    type: 'stake',
    tokenSymbol: 'mMOVE',
    tokenAddress: '0x3',
    amount: '5000.00',
    valueUsd: 6250.0,
    apy: 12.0,
    metadata: {
      exchangeRate: 1.05,
      isLiquidStaking: true,
    },
  },
]

const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'meridian-reward-1',
    protocolId: 'meridian',
    positionId: 'meridian-vault-1',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '68.50',
    valueUsd: 85.63,
    claimable: true,
  },
  {
    id: 'meridian-reward-2',
    protocolId: 'meridian',
    positionId: 'meridian-vault-2',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '42.30',
    valueUsd: 52.88,
    claimable: true,
  },
  {
    id: 'meridian-reward-3',
    protocolId: 'meridian',
    positionId: 'meridian-stake-1',
    tokenSymbol: 'MERID',
    tokenAddress: '0x3',
    amount: '225.00',
    valueUsd: 33.75,
    claimable: true,
  },
]

class MeridianService implements ProtocolService {
  readonly protocolId: ProtocolId = 'meridian'
  readonly displayName = 'Meridian'

  /**
   * Get vault and staking positions
   */
  async getPositions(address: string): Promise<Position[]> {
    if (!isMeridianDeployed()) {
      console.log('[Meridian] Not deployed, using mock data')
      return MOCK_POSITIONS
    }

    try {
      console.log(`[Meridian] Fetching positions for ${address}`)

      // TODO: Query positions via view function
      // const vaults = await aptos.view({...})
      // const stakes = await aptos.view({...})
      // return [...parseVaults(vaults), ...parseStakes(stakes)]

      return process.env.NODE_ENV === 'development' ? MOCK_POSITIONS : []
    } catch (error) {
      console.error('[Meridian] Error fetching positions:', error)
      return process.env.NODE_ENV === 'development' ? MOCK_POSITIONS : []
    }
  }

  /**
   * Get pending rewards from vaults and staking
   */
  async getPendingRewards(address: string): Promise<RewardItem[]> {
    if (!isMeridianDeployed()) {
      console.log('[Meridian] Not deployed, using mock rewards')
      return MOCK_REWARDS
    }

    try {
      console.log(`[Meridian] Fetching pending rewards for ${address}`)

      // TODO: Query pending rewards
      // const result = await aptos.view({
      //   payload: {
      //     function: MERIDIAN_CONFIG.viewFunctions.getPendingRewards,
      //     typeArguments: [],
      //     functionArguments: [address],
      //   },
      // })
      // return parseMeridianRewards(result)

      return process.env.NODE_ENV === 'development' ? MOCK_REWARDS : []
    } catch (error) {
      console.error('[Meridian] Error fetching rewards:', error)
      return process.env.NODE_ENV === 'development' ? MOCK_REWARDS : []
    }
  }

  /**
   * Get mMOVE/MOVE exchange rate
   */
  async getExchangeRate(): Promise<number> {
    if (!isMeridianDeployed()) return 1.05 // Mock value

    try {
      const result = await aptos.view({
        payload: {
          function: MERIDIAN_CONFIG.viewFunctions.getExchangeRate,
          typeArguments: [],
          functionArguments: [],
        },
      })
      return Number(result[0]) / 1e8
    } catch {
      return 1.0
    }
  }

  /**
   * Build claim rewards transaction
   */
  async buildClaimTransaction(
    address: string,
    rewardIds?: string[]
  ): Promise<TransactionPayload> {
    const rewards = await this.getPendingRewards(address)
    const rewardsToClaim = rewardIds
      ? rewards.filter((r) => rewardIds.includes(r.id))
      : rewards.filter((r) => r.claimable)

    console.log(`[Meridian] Building claim tx for ${rewardsToClaim.length} rewards`)

    if (rewardsToClaim.length === 0) {
      throw new Error('No rewards to claim')
    }

    return {
      function: MERIDIAN_CONFIG.entryFunctions.claimRewards,
      typeArguments: [],
      functionArguments: [],
    }
  }
}

export const meridianService = new MeridianService()
