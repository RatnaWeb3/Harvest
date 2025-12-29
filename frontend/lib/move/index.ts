/**
 * Move Abstraction Layer
 *
 * This is the stable export file - it should NEVER change once established.
 * All components should import from '@/lib/move' only.
 *
 * Usage:
 *   import { useAptosWallet, useAptosClient, aptos } from '@/lib/move'
 */

// Re-export client utilities
export {
  aptos,
  MOVEMENT_CONFIGS,
  CURRENT_NETWORK,
  getCurrentNetworkConfig,
  getExplorerUrl,
  toHex,
} from './client'

// Re-export hooks
export { useAptosWallet, useAptosClient } from './hooks'

// Re-export types
export type {
  TransactionPayload,
  WalletState,
  ViewFunctionPayload,
  TransactionResponse,
  NetworkConfig,
  AccountInfo,
  PendingTransaction,
} from './types'

// Re-export constants
export {
  HARVEST_ADDRESS,
  PROTOCOL_ADDRESSES,
  TYPE_ARGUMENTS,
  MODULES,
} from './constants'
