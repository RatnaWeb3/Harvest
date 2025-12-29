/**
 * Airdrop Tracker Types
 * Type definitions for airdrop tracking functionality
 */

// Airdrop status types
export type AirdropStatus = 'upcoming' | 'live' | 'claimable' | 'ended'

// Filter options for airdrop list
export type AirdropFilter = 'all' | 'eligible' | 'claimable' | 'upcoming'

// Individual airdrop item
export interface Airdrop {
  id: string
  name: string
  protocol: string
  protocolIcon?: string
  status: AirdropStatus
  eligible: boolean | null // null = unknown/unchecked
  allocation?: string
  allocationUsd?: number
  claimDeadline?: Date
  snapshotDate?: Date
  requirements: string[]
  checkUrl?: string
  claimUrl?: string
  description?: string
}

// Eligibility check result
export interface EligibilityResult {
  airdropId: string
  eligible: boolean
  allocation?: string
  allocationUsd?: number
  checkedAt: Date
}

// Reminder stored in localStorage
export interface AirdropReminder {
  airdropId: string
  airdropName: string
  reminderDate: Date
  notified: boolean
}

// Airdrop page state
export interface AirdropPageState {
  filter: AirdropFilter
  searchQuery: string
  selectedAirdrop: Airdrop | null
}
