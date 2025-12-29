/**
 * Protocol Constants
 * Configuration for all Movement ecosystem protocols
 */

import { ProtocolId, ProtocolConfig } from '@/lib/services/protocol-interface'
import { YUZU_CONFIG } from './yuzu'
import { JOULE_CONFIG } from './joule'
import { MERIDIAN_CONFIG } from './meridian'

// Re-export protocol-specific configs
export { YUZU_CONFIG, isYuzuDeployed } from './yuzu'
export { JOULE_CONFIG, isJouleDeployed } from './joule'
export { MERIDIAN_CONFIG, isMeridianDeployed } from './meridian'

// Protocol configurations
export const PROTOCOL_CONFIGS: Record<ProtocolId, ProtocolConfig> = {
  yuzu: {
    moduleAddress: YUZU_CONFIG.moduleAddress,
    displayName: YUZU_CONFIG.displayName,
    color: YUZU_CONFIG.color,
    icon: YUZU_CONFIG.icon,
    claimFunction: 'collect_fee',
    viewFunctions: {
      getRewards: 'quote_swap',
      getPositions: 'get_pool',
    },
  },
  joule: {
    moduleAddress: JOULE_CONFIG.moduleAddress,
    displayName: JOULE_CONFIG.displayName,
    color: JOULE_CONFIG.color,
    icon: JOULE_CONFIG.icon,
    claimFunction: 'claim_all',
    viewFunctions: {
      getRewards: 'pending_rewards',
      getPositions: 'get_user_position',
    },
  },
  meridian: {
    moduleAddress: MERIDIAN_CONFIG.moduleAddress,
    displayName: MERIDIAN_CONFIG.displayName,
    color: MERIDIAN_CONFIG.color,
    icon: MERIDIAN_CONFIG.icon,
    claimFunction: 'claim',
    viewFunctions: {
      getRewards: 'pending',
      getPositions: 'get_position',
    },
  },
}

// Active protocols (can be toggled)
export const ACTIVE_PROTOCOLS: ProtocolId[] = ['yuzu', 'joule', 'meridian']

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
  yuzu: 'YUZU',
  joule: 'JOULE',
  meridian: 'MERID',
}
