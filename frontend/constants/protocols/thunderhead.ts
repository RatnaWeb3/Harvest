/**
 * Thunderhead Protocol Configuration
 * Liquid Staking (stMOVE) on Movement Network
 *
 * Website: https://stakemove.xyz
 * Status: Coming Soon
 */

// No deployed address yet - mark as coming soon
const THUNDERHEAD_MODULE_ADDRESS: string | null = null

export const THUNDERHEAD_CONFIG = {
  moduleAddress: THUNDERHEAD_MODULE_ADDRESS,
  displayName: 'Thunderhead',
  color: '#6366F1',
  icon: 'thunderhead',
  status: 'coming_soon' as const,
  description: 'Liquid staking with stMOVE - Earn staking rewards',

  // Liquid staking token
  liquidStakingToken: {
    symbol: 'stMOVE',
    name: 'Staked MOVE',
    decimals: 8,
  },

  // View functions (expected patterns)
  // Note: These won't be called until protocol is deployed
  viewFunctions: {
    getStakedAmount: `${THUNDERHEAD_MODULE_ADDRESS}::staking::get_staked_amount`,
    getPendingRewards: `${THUNDERHEAD_MODULE_ADDRESS}::staking::pending_rewards`,
    getExchangeRate: `${THUNDERHEAD_MODULE_ADDRESS}::staking::exchange_rate`,
  },

  // Entry functions
  entryFunctions: {
    stake: `${THUNDERHEAD_MODULE_ADDRESS}::staking::stake`,
    unstake: `${THUNDERHEAD_MODULE_ADDRESS}::staking::unstake`,
    claimRewards: `${THUNDERHEAD_MODULE_ADDRESS}::staking::claim_rewards`,
  },
} as const

// Check if Thunderhead is deployed (has valid address)
export const isThunderheadDeployed = (): boolean => false
