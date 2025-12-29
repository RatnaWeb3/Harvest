/**
 * History Service
 * Manages claim history storage and retrieval using localStorage
 */

import type { ClaimHistory, ClaimReward, HistoryFilters, PaginationState } from '@/app/rewards/types'
import type { ProtocolId } from '@/app/dashboard/types'

const STORAGE_KEY = 'harvest_claim_history'
const MAX_HISTORY_ITEMS = 100

// Get all claim history from storage
function getStoredHistory(): ClaimHistory[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    // Convert timestamp strings back to Date objects
    return parsed.map((item: ClaimHistory) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }))
  } catch {
    return []
  }
}

// Save claim history to storage
function saveHistory(history: ClaimHistory[]): void {
  if (typeof window === 'undefined') return
  try {
    // Keep only the most recent items
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Failed to save claim history:', error)
  }
}

// Apply filters to history
function applyFilters(history: ClaimHistory[], filters: HistoryFilters): ClaimHistory[] {
  return history.filter((item) => {
    if (filters.protocol && item.protocol !== filters.protocol) return false
    if (filters.status && item.status !== filters.status) return false
    if (filters.dateFrom && item.timestamp < filters.dateFrom) return false
    if (filters.dateTo && item.timestamp > filters.dateTo) return false
    return true
  })
}

class HistoryService {
  /**
   * Get paginated claim history with optional filters
   */
  getClaimHistory(
    filters: HistoryFilters = {},
    page = 1,
    pageSize = 10
  ): { data: ClaimHistory[]; pagination: PaginationState } {
    const allHistory = getStoredHistory()
    const filtered = applyFilters(allHistory, filters)

    const totalCount = filtered.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (page - 1) * pageSize
    const data = filtered.slice(startIndex, startIndex + pageSize)

    return {
      data,
      pagination: { page, pageSize, totalCount, totalPages },
    }
  }

  /**
   * Add a new claim record
   */
  addClaimRecord(record: {
    txHash: string
    protocol: ProtocolId
    rewards: ClaimReward[]
    status?: 'pending' | 'confirmed' | 'failed'
  }): ClaimHistory {
    const history = getStoredHistory()
    const totalUsdValue = record.rewards.reduce((sum, r) => sum + r.usdValue, 0)

    const newRecord: ClaimHistory = {
      id: `${record.protocol}-${Date.now()}`,
      txHash: record.txHash,
      timestamp: new Date(),
      protocol: record.protocol,
      rewards: record.rewards,
      totalUsdValue,
      status: record.status || 'confirmed',
    }

    const updated = [newRecord, ...history]
    saveHistory(updated)
    return newRecord
  }

  /**
   * Update claim status (e.g., pending -> confirmed)
   */
  updateClaimStatus(id: string, status: 'pending' | 'confirmed' | 'failed'): void {
    const history = getStoredHistory()
    const index = history.findIndex((item) => item.id === id)
    if (index !== -1) {
      history[index].status = status
      saveHistory(history)
    }
  }

  /**
   * Get total claims stats
   */
  getClaimStats(): { totalClaims: number; totalValue: number; protocolBreakdown: Record<ProtocolId, number> } {
    const history = getStoredHistory().filter((h) => h.status === 'confirmed')
    const protocolBreakdown = {} as Record<ProtocolId, number>

    for (const claim of history) {
      protocolBreakdown[claim.protocol] = (protocolBreakdown[claim.protocol] || 0) + claim.totalUsdValue
    }

    return {
      totalClaims: history.length,
      totalValue: history.reduce((sum, h) => sum + h.totalUsdValue, 0),
      protocolBreakdown,
    }
  }

  /**
   * Clear all history (for testing/reset)
   */
  clearHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

export const historyService = new HistoryService()
