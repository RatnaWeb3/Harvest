'use client'

/**
 * useAirdrops Hook
 * Fetches and filters airdrops with search functionality
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { airdropService } from '@/lib/services/airdrop-service'
import type { Airdrop, AirdropFilter } from '../types'

const STALE_TIME = 1000 * 60 * 5 // 5 minutes

interface UseAirdropsOptions {
  filter?: AirdropFilter
  searchQuery?: string
}

export function useAirdrops({ filter = 'all', searchQuery = '' }: UseAirdropsOptions = {}) {
  const {
    data: airdrops = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['airdrops'],
    queryFn: () => airdropService.getAirdrops(),
    staleTime: STALE_TIME,
  })

  const filteredAirdrops = useMemo(() => {
    let result = [...airdrops]

    // Apply filter
    switch (filter) {
      case 'eligible':
        result = result.filter((a) => a.eligible === true)
        break
      case 'claimable':
        result = result.filter((a) => a.status === 'claimable' && a.eligible === true)
        break
      case 'upcoming':
        result = result.filter((a) => a.status === 'upcoming')
        break
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) || a.protocol.toLowerCase().includes(query)
      )
    }

    // Sort: claimable first, then live, upcoming, ended
    const statusOrder: Record<Airdrop['status'], number> = {
      claimable: 0,
      live: 1,
      upcoming: 2,
      ended: 3,
    }
    result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

    return result
  }, [airdrops, filter, searchQuery])

  const stats = useMemo(() => {
    return {
      total: airdrops.length,
      claimable: airdrops.filter((a) => a.status === 'claimable' && a.eligible).length,
      eligible: airdrops.filter((a) => a.eligible === true).length,
      upcoming: airdrops.filter((a) => a.status === 'upcoming').length,
    }
  }, [airdrops])

  return {
    airdrops: filteredAirdrops,
    allAirdrops: airdrops,
    stats,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  }
}
