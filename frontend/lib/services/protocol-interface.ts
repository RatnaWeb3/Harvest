/**
 * Protocol Service Interface
 * Base interface for all Movement ecosystem protocol integrations
 */

import { TransactionPayload } from '@/lib/move'

// Protocol identifiers
export type ProtocolId = 'joule' | 'yuzu' | 'meridian' | 'thunderhead'

// Protocol status
export type ProtocolStatus = 'active' | 'coming_soon' | 'deprecated'

// Position types
export type PositionType = 'lp' | 'supply' | 'borrow' | 'stake' | 'vault'

// User position in a protocol
export interface Position {
  id: string
  protocolId: ProtocolId
  type: PositionType
  tokenSymbol: string
  tokenAddress: string
  amount: string
  valueUsd: number
  apy?: number
  metadata?: Record<string, unknown>
}

// Pending reward item
export interface RewardItem {
  id: string
  protocolId: ProtocolId
  positionId: string
  tokenSymbol: string
  tokenAddress: string
  amount: string
  valueUsd: number
  claimable: boolean
}

// Protocol service interface
export interface ProtocolService {
  readonly protocolId: ProtocolId
  readonly displayName: string

  getPositions(address: string): Promise<Position[]>
  getPendingRewards(address: string): Promise<RewardItem[]>
  buildClaimTransaction(address: string, rewardIds?: string[]): Promise<TransactionPayload>
}

// Protocol configuration
export interface ProtocolConfig {
  moduleAddress: string | null
  displayName: string
  color: string
  icon: string
  status: ProtocolStatus
  description?: string
  claimFunction?: string
  viewFunctions?: {
    getRewards: string
    getPositions: string
  }
}
