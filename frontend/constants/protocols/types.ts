/**
 * Protocol Types
 * Shared type definitions for protocol configurations
 */

// Protocol status
export type ProtocolStatus = 'active' | 'coming_soon' | 'deprecated'

// Protocol identifiers
export type ProtocolId = 'joule' | 'yuzu' | 'meridian' | 'thunderhead'

// Base protocol configuration interface
export interface ProtocolConfig {
  moduleAddress: string | null
  displayName: string
  color: string
  icon: string
  status: ProtocolStatus
  description?: string
}

// Lists of protocols by status
export const ACTIVE_PROTOCOLS: ProtocolId[] = ['joule']
export const COMING_SOON_PROTOCOLS: ProtocolId[] = [
  'yuzu',
  'meridian',
  'thunderhead',
]
export const ALL_PROTOCOL_IDS: ProtocolId[] = [
  'joule',
  'yuzu',
  'meridian',
  'thunderhead',
]
