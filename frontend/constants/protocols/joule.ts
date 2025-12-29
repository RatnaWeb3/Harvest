/**
 * Joule Protocol Configuration
 * Lending/Borrowing Protocol on Movement Network
 *
 * Docs: https://docs.joule.finance/docs
 * Contract Addresses: https://docs.joule.finance/docs/money-market/contract-addresses
 *
 * Joule is the "Liquidity Hub of MoveVM" offering:
 * - Isolated lending positions
 * - Variable interest rates
 * - MOVE incentive rewards
 */

// Movement Testnet address (mainnet TBA)
const JOULE_MODULE_ADDRESS =
  process.env.NEXT_PUBLIC_JOULE_ADDRESS ||
  '0x7ada55ecf28c22d62f0b05c21ecb20c5767ef743fb0bb2cf486948d0a24413bf'

export const JOULE_CONFIG = {
  moduleAddress: JOULE_MODULE_ADDRESS,
  displayName: 'Joule',
  color: '#3B82F6',
  icon: 'joule',

  // View functions (standard lending protocol pattern)
  viewFunctions: {
    getUserPosition: `${JOULE_MODULE_ADDRESS}::lending_pool::get_user_position`,
    getMarketData: `${JOULE_MODULE_ADDRESS}::lending_pool::get_market_data`,
    getPendingRewards: `${JOULE_MODULE_ADDRESS}::incentives::pending_rewards`,
    getHealthFactor: `${JOULE_MODULE_ADDRESS}::risk::get_health_factor`,
  },

  // Entry functions
  entryFunctions: {
    deposit: `${JOULE_MODULE_ADDRESS}::lending_pool::deposit`,
    withdraw: `${JOULE_MODULE_ADDRESS}::lending_pool::withdraw`,
    borrow: `${JOULE_MODULE_ADDRESS}::lending_pool::borrow`,
    repay: `${JOULE_MODULE_ADDRESS}::lending_pool::repay`,
    claimRewards: `${JOULE_MODULE_ADDRESS}::incentives::claim_all`,
  },

  // Supported markets
  markets: [
    { symbol: 'USDC', decimals: 6, ltv: 0.85 },
    { symbol: 'USDT', decimals: 6, ltv: 0.85 },
    { symbol: 'MOVE', decimals: 8, ltv: 0.75 },
    { symbol: 'WETH', decimals: 8, ltv: 0.80 },
  ],

  // Points system (per day per unit)
  pointsMultiplier: {
    supply: 1,
    borrow: 4,
  },
} as const

// Check if Joule is deployed (has valid address)
export const isJouleDeployed = (): boolean => {
  return JOULE_MODULE_ADDRESS.length > 10 && JOULE_MODULE_ADDRESS !== '0x0'
}

export type JouleMarket = (typeof JOULE_CONFIG.markets)[number]
