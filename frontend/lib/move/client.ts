/**
 * Move Abstraction Layer - Client Configuration
 * Aptos SDK client configured for Movement network
 */

import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'
import type { NetworkConfig } from './types'

// Movement network configurations
export const MOVEMENT_CONFIGS: Record<string, NetworkConfig> = {
  mainnet: {
    chainId: 126,
    name: 'Movement Mainnet',
    fullnode: 'https://full.mainnet.movementinfra.xyz/v1',
    explorer: 'mainnet',
  },
  testnet: {
    chainId: 250,
    name: 'Movement Testnet',
    fullnode: 'https://testnet.movementnetwork.xyz/v1',
    explorer: 'testnet',
  },
}

// Current network from environment (defaults to testnet)
export const CURRENT_NETWORK = (process.env.NEXT_PUBLIC_MOVEMENT_NETWORK ||
  'testnet') as keyof typeof MOVEMENT_CONFIGS

// Aptos client configured for Movement
export const aptos = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    fullnode: MOVEMENT_CONFIGS[CURRENT_NETWORK].fullnode,
  })
)

// Get current network config
export const getCurrentNetworkConfig = (): NetworkConfig => {
  return MOVEMENT_CONFIGS[CURRENT_NETWORK]
}

// Get explorer URL for a transaction or account
export const getExplorerUrl = (
  type: 'txn' | 'account',
  hash: string
): string => {
  const formatted = hash.startsWith('0x') ? hash : `0x${hash}`
  const network = MOVEMENT_CONFIGS[CURRENT_NETWORK].explorer
  return `https://explorer.movementnetwork.xyz/${type}/${formatted}?network=${network}`
}

// Utility to convert Uint8Array to hex string
export const toHex = (buffer: Uint8Array): string => {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
