/**
 * Protocol Registry
 * Central registry for all protocol services
 */

import { ProtocolService, ProtocolId } from './protocol-interface'
import { yuzuService } from './yuzu-service'
import { jouleService } from './joule-service'
import { meridianService } from './meridian-service'
import { ACTIVE_PROTOCOLS } from '@/constants/protocols'

// Registry of all protocol services
const PROTOCOL_SERVICES: Record<ProtocolId, ProtocolService> = {
  yuzu: yuzuService,
  joule: jouleService,
  meridian: meridianService,
}

/**
 * Get a specific protocol service by ID
 */
export function getProtocolService(id: ProtocolId): ProtocolService {
  const service = PROTOCOL_SERVICES[id]
  if (!service) {
    throw new Error(`Protocol service not found: ${id}`)
  }
  return service
}

/**
 * Get all registered protocol services
 */
export function getAllProtocols(): ProtocolService[] {
  return Object.values(PROTOCOL_SERVICES)
}

/**
 * Get only active protocol services
 */
export function getActiveProtocols(): ProtocolService[] {
  return ACTIVE_PROTOCOLS.map((id) => PROTOCOL_SERVICES[id]).filter(Boolean)
}

/**
 * Check if a protocol is active
 */
export function isProtocolActive(id: ProtocolId): boolean {
  return ACTIVE_PROTOCOLS.includes(id)
}

/**
 * Get all protocol IDs
 */
export function getProtocolIds(): ProtocolId[] {
  return Object.keys(PROTOCOL_SERVICES) as ProtocolId[]
}

/**
 * Get active protocol IDs
 */
export function getActiveProtocolIds(): ProtocolId[] {
  return ACTIVE_PROTOCOLS
}
