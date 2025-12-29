/**
 * Move Abstraction Layer - Constants
 * Module addresses and common configurations
 */

// Harvest contract address (from environment)
export const HARVEST_ADDRESS =
  process.env.NEXT_PUBLIC_HARVEST_ADDRESS ||
  '0x0000000000000000000000000000000000000000000000000000000000000000'

// Protocol addresses placeholder - to be populated as integrations are added
export const PROTOCOL_ADDRESSES = {
  yuzu: process.env.NEXT_PUBLIC_YUZU_ADDRESS || '',
  joule: process.env.NEXT_PUBLIC_JOULE_ADDRESS || '',
  meridian: process.env.NEXT_PUBLIC_MERIDIAN_ADDRESS || '',
  thunderhead: process.env.NEXT_PUBLIC_THUNDERHEAD_ADDRESS || '',
  canopy: process.env.NEXT_PUBLIC_CANOPY_ADDRESS || '',
} as const

// Common type arguments for Move functions
export const TYPE_ARGUMENTS = {
  APTOS_COIN: '0x1::aptos_coin::AptosCoin',
  MOVE_COIN: '0x1::aptos_coin::AptosCoin', // Movement uses same as Aptos
} as const

// Common module paths
export const MODULES = {
  COIN: '0x1::coin',
  APTOS_ACCOUNT: '0x1::aptos_account',
} as const
