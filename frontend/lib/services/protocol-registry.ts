/**
 * Protocol Registry
 * Central registry for all protocol services
 */

import { ProtocolService, ProtocolId } from './protocol-interface'
// import { jouleService } from './joule-service'
import { isProtocolActive, getActiveProtocolIds } from '@/constants/protocols'

// Registry of protocol services that have implementations
// All protocols are currently "coming soon" - no deployed contracts on Movement testnet
const PROTOCOL_SERVICES: Partial<Record<ProtocolId, ProtocolService>> = {
  // joule: jouleService,     // Coming soon - module not found on testnet
  // yuzu: yuzuService,       // Coming soon - no deployed contract
  // meridian: meridianService, // Coming soon - no deployed contract
  // thunderhead: N/A         // Coming soon - no deployed contract
}

/**
 * Get a specific protocol service by ID
 * Returns null if protocol is not active or service doesn't exist
 */
export function getProtocolService(id: ProtocolId): ProtocolService | null {
  if (!isProtocolActive(id)) {
    return null
  }
  return PROTOCOL_SERVICES[id] || null
}

/**
 * Get all registered protocol services (active only)
 */
export function getAllProtocols(): ProtocolService[] {
  return Object.values(PROTOCOL_SERVICES).filter(Boolean) as ProtocolService[]
}

/**
 * Get only active protocol services
 */
export function getActiveProtocols(): ProtocolService[] {
  return getActiveProtocolIds()
    .map((id) => PROTOCOL_SERVICES[id])
    .filter(Boolean) as ProtocolService[]
}

/**
 * Check if a protocol has an active service
 */
export { isProtocolActive }

/**
 * Get all protocol IDs (active and coming soon)
 */
export function getProtocolIds(): ProtocolId[] {
  return ['joule', 'yuzu', 'meridian', 'thunderhead']
}

/**
 * Get active protocol IDs
 */
export { getActiveProtocolIds }
