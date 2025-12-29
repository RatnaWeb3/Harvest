/**
 * Airdrop Service
 * Handles fetching airdrop data and eligibility checks
 */

import { MOCK_AIRDROPS } from '@/app/airdrops/data/airdrops'
import type { Airdrop, AirdropFilter, EligibilityResult } from '@/app/airdrops/types'

class AirdropService {
  private eligibilityCache = new Map<string, EligibilityResult>()

  /**
   * Fetch all airdrops
   */
  async getAirdrops(): Promise<Airdrop[]> {
    // Simulate API delay
    await this.delay(300)
    return [...MOCK_AIRDROPS]
  }

  /**
   * Get airdrops filtered by status
   */
  async getFilteredAirdrops(filter: AirdropFilter): Promise<Airdrop[]> {
    const airdrops = await this.getAirdrops()

    switch (filter) {
      case 'eligible':
        return airdrops.filter((a) => a.eligible === true)
      case 'claimable':
        return airdrops.filter((a) => a.status === 'claimable' && a.eligible === true)
      case 'upcoming':
        return airdrops.filter((a) => a.status === 'upcoming')
      default:
        return airdrops
    }
  }

  /**
   * Search airdrops by name or protocol
   */
  async searchAirdrops(query: string, airdrops?: Airdrop[]): Promise<Airdrop[]> {
    const list = airdrops ?? (await this.getAirdrops())
    const lowerQuery = query.toLowerCase().trim()

    if (!lowerQuery) return list

    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.protocol.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Check eligibility for a specific airdrop
   */
  async checkEligibility(airdropId: string, walletAddress: string): Promise<EligibilityResult> {
    // Check cache first
    const cacheKey = `${airdropId}-${walletAddress}`
    const cached = this.eligibilityCache.get(cacheKey)
    if (cached) return cached

    // Simulate API delay
    await this.delay(800)

    // Mock eligibility check - in production would call backend/contract
    const airdrop = MOCK_AIRDROPS.find((a) => a.id === airdropId)
    const result: EligibilityResult = {
      airdropId,
      eligible: airdrop?.eligible ?? Math.random() > 0.4,
      allocation: airdrop?.allocation,
      allocationUsd: airdrop?.allocationUsd,
      checkedAt: new Date(),
    }

    // Cache the result
    this.eligibilityCache.set(cacheKey, result)

    return result
  }

  /**
   * Get airdrop by ID
   */
  async getAirdropById(id: string): Promise<Airdrop | null> {
    const airdrops = await this.getAirdrops()
    return airdrops.find((a) => a.id === id) ?? null
  }

  /**
   * Get stats summary
   */
  async getAirdropStats(walletAddress?: string): Promise<{
    total: number
    claimable: number
    upcoming: number
    totalValue: number
  }> {
    const airdrops = await this.getAirdrops()

    return {
      total: airdrops.length,
      claimable: airdrops.filter((a) => a.status === 'claimable' && a.eligible).length,
      upcoming: airdrops.filter((a) => a.status === 'upcoming').length,
      totalValue: airdrops
        .filter((a) => a.eligible && (a.status === 'claimable' || a.status === 'live'))
        .reduce((sum, a) => sum + (a.allocationUsd ?? 0), 0),
    }
  }

  /**
   * Clear eligibility cache
   */
  clearCache(): void {
    this.eligibilityCache.clear()
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const airdropService = new AirdropService()
