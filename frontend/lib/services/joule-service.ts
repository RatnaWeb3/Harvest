/**
 * Joule Protocol Service
 * Lending/Borrowing - Supply/borrow positions, interest, MOVE incentives
 *
 * Docs: https://docs.joule.finance
 * Real integration with fallback to mock data
 */

import { aptos, TransactionPayload } from '@/lib/move'
import {
  ProtocolService,
  Position,
  RewardItem,
  ProtocolId,
} from './protocol-interface'
import { JOULE_CONFIG, isJouleDeployed } from '@/constants/protocols/joule'

// Mock lending positions for development/fallback
const MOCK_POSITIONS: Position[] = [
  {
    id: 'joule-supply-1',
    protocolId: 'joule',
    type: 'supply',
    tokenSymbol: 'USDC',
    tokenAddress: '0x1',
    amount: '5000.00',
    valueUsd: 5000.0,
    apy: 8.5,
    metadata: { collateralFactor: 0.85, isCollateral: true },
  },
  {
    id: 'joule-supply-2',
    protocolId: 'joule',
    type: 'supply',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '2500.00',
    valueUsd: 3125.0,
    apy: 12.3,
    metadata: { collateralFactor: 0.75, isCollateral: true },
  },
  {
    id: 'joule-borrow-1',
    protocolId: 'joule',
    type: 'borrow',
    tokenSymbol: 'USDT',
    tokenAddress: '0x2',
    amount: '2000.00',
    valueUsd: 2000.0,
    apy: -5.2,
    metadata: { borrowLimit: 4500, healthFactor: 2.1 },
  },
]

const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'joule-reward-1',
    protocolId: 'joule',
    positionId: 'joule-supply-1',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '85.20',
    valueUsd: 106.5,
    claimable: true,
  },
  {
    id: 'joule-reward-2',
    protocolId: 'joule',
    positionId: 'joule-supply-2',
    tokenSymbol: 'MOVE',
    tokenAddress: '0x1::aptos_coin::AptosCoin',
    amount: '142.80',
    valueUsd: 178.5,
    claimable: true,
  },
  {
    id: 'joule-reward-3',
    protocolId: 'joule',
    positionId: 'joule-supply-1',
    tokenSymbol: 'JOULE',
    tokenAddress: '0x3',
    amount: '320.00',
    valueUsd: 64.0,
    claimable: true,
  },
]

class JouleService implements ProtocolService {
  readonly protocolId: ProtocolId = 'joule'
  readonly displayName = 'Joule'

  /**
   * Get lending positions (supply + borrow) for an address
   */
  async getPositions(address: string): Promise<Position[]> {
    if (!isJouleDeployed()) {
      console.log('[Joule] Not deployed, using mock data')
      return MOCK_POSITIONS
    }

    try {
      console.log(`[Joule] Fetching positions for ${address}`)

      // TODO: Query lending positions via view function
      // const result = await aptos.view({
      //   payload: {
      //     function: JOULE_CONFIG.viewFunctions.getUserPosition,
      //     typeArguments: [],
      //     functionArguments: [address],
      //   },
      // })
      // return parseJoulePositions(result)

      return process.env.NODE_ENV === 'development' ? MOCK_POSITIONS : []
    } catch (error) {
      console.error('[Joule] Error fetching positions:', error)
      return process.env.NODE_ENV === 'development' ? MOCK_POSITIONS : []
    }
  }

  /**
   * Get pending MOVE incentive rewards
   */
  async getPendingRewards(address: string): Promise<RewardItem[]> {
    if (!isJouleDeployed()) {
      console.log('[Joule] Not deployed, using mock rewards')
      return MOCK_REWARDS
    }

    try {
      console.log(`[Joule] Fetching pending rewards for ${address}`)

      // TODO: Query incentive rewards
      // const result = await aptos.view({
      //   payload: {
      //     function: JOULE_CONFIG.viewFunctions.getPendingRewards,
      //     typeArguments: [],
      //     functionArguments: [address],
      //   },
      // })
      // return parseJouleRewards(result)

      return process.env.NODE_ENV === 'development' ? MOCK_REWARDS : []
    } catch (error) {
      console.error('[Joule] Error fetching rewards:', error)
      return process.env.NODE_ENV === 'development' ? MOCK_REWARDS : []
    }
  }

  /**
   * Get user's health factor
   */
  async getHealthFactor(address: string): Promise<number> {
    if (!isJouleDeployed()) return 2.1 // Mock value

    try {
      const result = await aptos.view({
        payload: {
          function: JOULE_CONFIG.viewFunctions.getHealthFactor,
          typeArguments: [],
          functionArguments: [address],
        },
      })
      return Number(result[0]) / 100 // Assuming basis points
    } catch {
      return 0
    }
  }

  /**
   * Build claim all rewards transaction
   */
  async buildClaimTransaction(
    address: string,
    rewardIds?: string[]
  ): Promise<TransactionPayload> {
    const rewards = await this.getPendingRewards(address)
    const rewardsToClaim = rewardIds
      ? rewards.filter((r) => rewardIds.includes(r.id))
      : rewards.filter((r) => r.claimable)

    console.log(`[Joule] Building claim tx for ${rewardsToClaim.length} rewards`)

    if (rewardsToClaim.length === 0) {
      throw new Error('No rewards to claim')
    }

    return {
      function: JOULE_CONFIG.entryFunctions.claimRewards,
      typeArguments: [],
      functionArguments: [],
    }
  }
}

export const jouleService = new JouleService()
