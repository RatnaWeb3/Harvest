/**
 * Protocol Constants
 * Configuration for all Movement ecosystem protocols
 */

import { ProtocolId, ProtocolConfig } from './types'
import { JOULE_CONFIG } from './joule'
import { YUZU_CONFIG } from './yuzu'
import { MERIDIAN_CONFIG } from './meridian'
import { THUNDERHEAD_CONFIG } from './thunderhead'

// Re-export all protocol configs
export { JOULE_CONFIG, isJouleDeployed } from './joule'
export { YUZU_CONFIG, isYuzuDeployed } from './yuzu'
export { MERIDIAN_CONFIG, isMeridianDeployed } from './meridian'
export { THUNDERHEAD_CONFIG, isThunderheadDeployed } from './thunderhead'

// Re-export types
export * from './types'

// Protocol configurations registry
export const PROTOCOL_CONFIGS: Record<ProtocolId, ProtocolConfig> = {
  joule: {
    moduleAddress: JOULE_CONFIG.moduleAddress,
    displayName: JOULE_CONFIG.displayName,
    color: JOULE_CONFIG.color,
    icon: JOULE_CONFIG.icon,
    status: JOULE_CONFIG.status,
    description: JOULE_CONFIG.description,
  },
  yuzu: {
    moduleAddress: YUZU_CONFIG.moduleAddress,
    displayName: YUZU_CONFIG.displayName,
    color: YUZU_CONFIG.color,
    icon: YUZU_CONFIG.icon,
    status: YUZU_CONFIG.status,
    description: YUZU_CONFIG.description,
  },
  meridian: {
    moduleAddress: MERIDIAN_CONFIG.moduleAddress,
    displayName: MERIDIAN_CONFIG.displayName,
    color: MERIDIAN_CONFIG.color,
    icon: MERIDIAN_CONFIG.icon,
    status: MERIDIAN_CONFIG.status,
    description: MERIDIAN_CONFIG.description,
  },
  thunderhead: {
    moduleAddress: THUNDERHEAD_CONFIG.moduleAddress,
    displayName: THUNDERHEAD_CONFIG.displayName,
    color: THUNDERHEAD_CONFIG.color,
    icon: THUNDERHEAD_CONFIG.icon,
    status: THUNDERHEAD_CONFIG.status,
    description: THUNDERHEAD_CONFIG.description,
  },
}

/**
 * Get protocol configuration by ID
 */
export function getProtocolConfig(id: ProtocolId): ProtocolConfig {
  return PROTOCOL_CONFIGS[id]
}

/**
 * Check if a protocol is active (has deployed contract)
 */
export function isProtocolActive(id: ProtocolId): boolean {
  return PROTOCOL_CONFIGS[id].status === 'active'
}

/**
 * Get all active protocol IDs
 */
export function getActiveProtocolIds(): ProtocolId[] {
  return (Object.keys(PROTOCOL_CONFIGS) as ProtocolId[]).filter(
    (id) => PROTOCOL_CONFIGS[id].status === 'active'
  )
}

// Token addresses (common across protocols)
export const TOKEN_ADDRESSES = {
  MOVE: '0x1::aptos_coin::AptosCoin',
  USDC: '0x1',
  USDT: '0x1',
  ETH: '0x1',
} as const

// Common reward token symbols
export const REWARD_TOKENS = ['MOVE', 'YUZU', 'JOULE', 'MERID'] as const

export type RewardToken = (typeof REWARD_TOKENS)[number]

// Protocol-specific token symbols
export const PROTOCOL_TOKENS: Record<ProtocolId, string> = {
  joule: 'JOULE',
  yuzu: 'YUZU',
  meridian: 'MERID',
  thunderhead: 'stMOVE',
}
