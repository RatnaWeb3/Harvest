'use client'

/**
 * useClaimHistory Hook
 * Manages claim history state with filtering and pagination
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { historyService } from '@/lib/services/history-service'
import { exportClaimHistoryCSV } from '@/lib/export'
import type { ClaimHistory, HistoryFilters, PaginationState, ProtocolId } from '../types'

const PAGE_SIZE = 10

export function useClaimHistory() {
  const [history, setHistory] = useState<ClaimHistory[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<HistoryFilters>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetch history with current filters and pagination
  const fetchHistory = useCallback(() => {
    setIsLoading(true)
    try {
      const result = historyService.getClaimHistory(filters, pagination.page, PAGE_SIZE)
      setHistory(result.data)
      setPagination(result.pagination)
    } finally {
      setIsLoading(false)
    }
  }, [filters, pagination.page])

  // Initial load and refetch when filters/page change
  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Update protocol filter
  const setProtocolFilter = useCallback((protocol: ProtocolId | undefined) => {
    setFilters((prev) => ({ ...prev, protocol }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  // Update date range filter
  const setDateFilter = useCallback((dateFrom?: Date, dateTo?: Date) => {
    setFilters((prev) => ({ ...prev, dateFrom, dateTo }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  // Change page
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  // Export to CSV
  const exportCSV = useCallback(() => {
    // Get all filtered history (not just current page)
    const allHistory = historyService.getClaimHistory(filters, 1, 1000)
    exportClaimHistoryCSV(allHistory.data)
  }, [filters])

  // Get claim stats
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stats = useMemo(() => historyService.getClaimStats(), [history])

  return {
    history,
    pagination,
    filters,
    isLoading,
    stats,
    setProtocolFilter,
    setDateFilter,
    clearFilters,
    goToPage,
    exportCSV,
    refetch: fetchHistory,
  }
}
