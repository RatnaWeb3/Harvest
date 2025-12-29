'use client'

/**
 * Airdrop Tracker Page
 * Browse and track airdrops across the Movement ecosystem
 */

import { useState, useCallback, useEffect } from 'react'
import { useAirdrops } from './hooks/use-airdrops'
import { AirdropFilters } from './components/airdrop-filters'
import { AirdropGrid } from './components/airdrop-grid'
import { AirdropDetailModal } from './components/airdrop-detail-modal'
import { checkReminders } from '@/lib/reminders'
import type { Airdrop, AirdropFilter } from './types'

export default function AirdropsPage() {
  const [filter, setFilter] = useState<AirdropFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null)

  const { airdrops, stats, isLoading, error } = useAirdrops({
    filter,
    searchQuery,
  })

  // Check reminders on mount
  useEffect(() => {
    checkReminders()
  }, [])

  const handleSelectAirdrop = useCallback((airdrop: Airdrop) => {
    setSelectedAirdrop(airdrop)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedAirdrop(null)
  }, [])

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold md:text-2xl">Airdrop Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Track and claim airdrops across the Movement ecosystem
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <AirdropFilters
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
      />

      <AirdropGrid
        airdrops={airdrops}
        isLoading={isLoading}
        onSelectAirdrop={handleSelectAirdrop}
      />

      <AirdropDetailModal
        airdrop={selectedAirdrop}
        isOpen={selectedAirdrop !== null}
        onClose={handleCloseModal}
      />
    </div>
  )
}
