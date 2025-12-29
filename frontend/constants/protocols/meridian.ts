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

// Placeholder until official deployment
const MERIDIAN_MODULE_ADDRESS =
  process.env.NEXT_PUBLIC_MERIDIAN_ADDRESS ||
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export const MERIDIAN_CONFIG = {
  moduleAddress: MERIDIAN_MODULE_ADDRESS,
  displayName: 'Meridian',
  color: '#8B5CF6',
  icon: 'meridian',

  // View functions (expected patterns)
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

// Check if Meridian is deployed
export const isMeridianDeployed = (): boolean => {
  return (
    MERIDIAN_MODULE_ADDRESS !==
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  )
}

export type MeridianVaultType = (typeof MERIDIAN_CONFIG.vaultTypes)[number]
