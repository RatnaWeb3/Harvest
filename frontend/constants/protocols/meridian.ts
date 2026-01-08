/**
 * Meridian Protocol Configuration
 * Native Liquidity Layer & Liquid Staking on Movement Network
 *
 * Twitter: @meridian_money
 *
 * Meridian offers:
 * - Decentralized liquidity marketplace
 * - Liquid staking (mMOVE)
 * - Yield optimization vaults
 *
 * NOTE: Contract addresses TBA - mainnet deployment pending.
 */

// No deployed address yet - mark as coming soon
const MERIDIAN_MODULE_ADDRESS: string | null = null

export const MERIDIAN_CONFIG = {
  moduleAddress: MERIDIAN_MODULE_ADDRESS,
  displayName: 'Meridian',
  color: '#8B5CF6',
  icon: 'meridian',
  status: 'coming_soon' as const,
  description: 'Native Liquidity Layer - Liquid staking with mMOVE',

  // View functions (expected patterns)
  // Note: These won't be called until protocol is deployed
  viewFunctions: {
    getUserStake: `${MERIDIAN_MODULE_ADDRESS}::staking::get_user_stake`,
    getVaultPosition: `${MERIDIAN_MODULE_ADDRESS}::vault::get_position`,
    getPendingRewards: `${MERIDIAN_MODULE_ADDRESS}::rewards::pending`,
    getExchangeRate: `${MERIDIAN_MODULE_ADDRESS}::liquid_staking::exchange_rate`,
  },

  // Entry functions
  entryFunctions: {
    stake: `${MERIDIAN_MODULE_ADDRESS}::staking::stake`,
    unstake: `${MERIDIAN_MODULE_ADDRESS}::staking::unstake`,
    depositVault: `${MERIDIAN_MODULE_ADDRESS}::vault::deposit`,
    withdrawVault: `${MERIDIAN_MODULE_ADDRESS}::vault::withdraw`,
    claimRewards: `${MERIDIAN_MODULE_ADDRESS}::rewards::claim`,
  },

  // Liquid staking token
  liquidStakingToken: {
    symbol: 'mMOVE',
    name: 'Meridian Staked MOVE',
    decimals: 8,
  },

  // Vault types
  vaultTypes: [
    { id: 'delta-neutral', name: 'Delta Neutral', strategy: 'CLMM Rebalancing' },
    { id: 'stable', name: 'Stable Yield', strategy: 'Lending Optimization' },
    { id: 'aggressive', name: 'High Yield', strategy: 'Leveraged Farming' },
  ],
} as const

// Check if Meridian is deployed (has valid address)
export const isMeridianDeployed = (): boolean => false

export type MeridianVaultType = (typeof MERIDIAN_CONFIG.vaultTypes)[number]
