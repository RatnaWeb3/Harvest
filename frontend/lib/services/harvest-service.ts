/**
 * Harvest Aggregator Service
 * Aggregates data and actions from all protocol services
 */

import { TransactionPayload } from '@/lib/move'
import { Position, RewardItem, ProtocolId } from './protocol-interface'
import { getActiveProtocols, getProtocolService } from './protocol-registry'

// Claim request for batch claiming
export interface ClaimRequest {
  protocolId: ProtocolId
  rewardIds: string[]
}

// Aggregated portfolio summary
export interface PortfolioSummary {
  totalValueUsd: number
  totalRewardsUsd: number
  positionCount: number
  rewardCount: number
  positionsByProtocol: Record<ProtocolId, number>
  rewardsByProtocol: Record<ProtocolId, number>
}

class HarvestService {
  /**
   * Get all positions from all active protocols
   */
  async getAllPositions(address: string): Promise<Position[]> {
    const protocols = getActiveProtocols()

    const results = await Promise.allSettled(
      protocols.map((protocol) => protocol.getPositions(address))
    )

    return results
      .filter((r): r is PromiseFulfilledResult<Position[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value)
  }

  /**
   * Get all pending rewards from all active protocols
   */
  async getAllPendingRewards(address: string): Promise<RewardItem[]> {
    const protocols = getActiveProtocols()

    const results = await Promise.allSettled(
      protocols.map((protocol) => protocol.getPendingRewards(address))
    )

    return results
      .filter((r): r is PromiseFulfilledResult<RewardItem[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value)
  }

  /**
   * Get portfolio summary across all protocols
   */
  async getPortfolioSummary(address: string): Promise<PortfolioSummary> {
    const [positions, rewards] = await Promise.all([
      this.getAllPositions(address),
      this.getAllPendingRewards(address),
    ])

    const positionsByProtocol = this.groupByProtocol(positions)
    const rewardsByProtocol = this.groupByProtocol(rewards)

    return {
      totalValueUsd: positions.reduce((sum, p) => sum + p.valueUsd, 0),
      totalRewardsUsd: rewards.reduce((sum, r) => sum + r.valueUsd, 0),
      positionCount: positions.length,
      rewardCount: rewards.length,
      positionsByProtocol,
      rewardsByProtocol,
    }
  }

  /**
   * Build batch claim transaction payloads for multiple protocols
   */
  async buildBatchClaimTransactions(
    address: string,
    claims: ClaimRequest[]
  ): Promise<TransactionPayload[]> {
    const transactions = await Promise.all(
      claims.map(async (claim) => {
        const service = getProtocolService(claim.protocolId)
        return service.buildClaimTransaction(address, claim.rewardIds)
      })
    )

    return transactions
  }

  /**
   * Build single claim transaction for a protocol
   */
  async buildClaimTransaction(
    address: string,
    protocolId: ProtocolId,
    rewardIds?: string[]
  ): Promise<TransactionPayload> {
    const service = getProtocolService(protocolId)
    return service.buildClaimTransaction(address, rewardIds)
  }

  /**
   * Build batch claim payload for multiple protocols
   * For MVP: Returns array of transaction payloads to execute sequentially
   * For production: Would use Harvest batch_claim contract for atomic execution
   */
  async buildBatchClaimPayload(
    address: string,
    claims: { protocol: ProtocolId; rewardIds?: string[] }[]
  ): Promise<{ payloads: TransactionPayload[]; protocols: ProtocolId[] }> {
    const payloads: TransactionPayload[] = []
    const protocols: ProtocolId[] = []

    for (const claim of claims) {
      try {
        const service = getProtocolService(claim.protocol)
        const payload = await service.buildClaimTransaction(address, claim.rewardIds)
        payloads.push(payload)
        protocols.push(claim.protocol)
      } catch (error) {
        console.error(`Failed to build claim for ${claim.protocol}:`, error)
        // Continue with other claims even if one fails
      }
    }

    return { payloads, protocols }
  }

  private groupByProtocol<T extends { protocolId: ProtocolId }>(
    items: T[]
  ): Record<ProtocolId, number> {
    return items.reduce(
      (acc, item) => {
        acc[item.protocolId] = (acc[item.protocolId] || 0) + 1
        return acc
      },
      {} as Record<ProtocolId, number>
    )
  }
}

export const harvestService = new HarvestService()
