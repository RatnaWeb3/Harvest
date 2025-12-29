/**
 * Move Abstraction Layer - Shared Types
 * All types for blockchain interactions go here
 */

// Transaction payload for entry function calls
export interface TransactionPayload {
  function: string
  typeArguments: string[]
  functionArguments: unknown[]
}

// Standardized wallet state across Privy and native wallets
export interface WalletState {
  connected: boolean
  address: string | null
  isPrivy: boolean
  signAndSubmitTransaction: (payload: TransactionPayload) => Promise<string>
  disconnect: () => Promise<void>
}

// View function parameters
export interface ViewFunctionPayload {
  function: string
  typeArguments?: string[]
  functionArguments?: unknown[]
}

// Transaction response after submission
export interface TransactionResponse {
  hash: string
  success: boolean
}

// Network configuration type
export interface NetworkConfig {
  chainId: number
  name: string
  fullnode: string
  explorer: string
}

// Account info returned from wallet
export interface AccountInfo {
  address: string
  publicKey?: string
}

// Pending transaction status
export interface PendingTransaction {
  hash: string
  status: 'pending' | 'success' | 'failed'
}
