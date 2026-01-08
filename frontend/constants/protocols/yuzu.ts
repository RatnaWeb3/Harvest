/**
 * Yuzu Protocol Configuration
 * CLMM DEX on Movement Network
 *
 * Docs: https://docs.yuzu.finance/technical/smart-contracts/yuzu-clmm
 * Module: yuzuswap
 *
 * NOTE: Module address is currently TBA (to be announced).
 * Update YUZU_MODULE_ADDRESS when officially deployed.
 */

// No deployed address yet - mark as coming soon
const YUZU_MODULE_ADDRESS: string | null = null

export const YUZU_CONFIG = {
  moduleAddress: YUZU_MODULE_ADDRESS,
  displayName: 'Yuzu',
  color: '#F59E0B',
  icon: 'yuzu',
  status: 'coming_soon' as const,
  description: 'CLMM DEX - Concentrated liquidity for Movement',

  // View functions (from yuzuswap::liquidity_pool and yuzuswap::router)
  // Note: These won't be called until protocol is deployed
  viewFunctions: {
    getPool: `${YUZU_MODULE_ADDRESS}::router::get_pool`,
    quoteSwap: `${YUZU_MODULE_ADDRESS}::liquidity_pool::quote_swap`,
    // Position queries require indexer - not on-chain view functions
  },

  // Entry functions (from yuzuswap::scripts)
  entryFunctions: {
    // Pool creation
    createPool: `${YUZU_MODULE_ADDRESS}::scripts::create_pool`,
    // Liquidity management
    addLiquidity: `${YUZU_MODULE_ADDRESS}::scripts::add_liquidity`,
    removeLiquidity: `${YUZU_MODULE_ADDRESS}::scripts::remove_liquidity`,
    burnPosition: `${YUZU_MODULE_ADDRESS}::scripts::burn_position`,
    // Fee & reward collection
    collectFee: `${YUZU_MODULE_ADDRESS}::scripts::collect_fee`,
    collectReward: `${YUZU_MODULE_ADDRESS}::scripts::collect_reward`,
    // Swaps
    swapExactFaForFa: `${YUZU_MODULE_ADDRESS}::scripts::swap_exact_fa_for_fa`,
  },

  // Fee tiers (basis points) - standard CLMM tiers
  feeTiers: [100, 500, 3000, 10000] as const,

  // Supported pools (top pairs) - update as pools are created
  pools: [
    { id: 'move-usdc', tokenX: 'MOVE', tokenY: 'USDC', fee: 3000 },
    { id: 'move-usdt', tokenX: 'MOVE', tokenY: 'USDT', fee: 3000 },
    { id: 'eth-move', tokenX: 'ETH', tokenY: 'MOVE', fee: 3000 },
    { id: 'usdc-usdt', tokenX: 'USDC', tokenY: 'USDT', fee: 100 },
  ],
} as const

// Check if Yuzu is deployed (has valid address)
export const isYuzuDeployed = (): boolean => false

export type YuzuPool = (typeof YUZU_CONFIG.pools)[number]
export type YuzuFeeTier = (typeof YUZU_CONFIG.feeTiers)[number]
