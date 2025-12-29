'use client'

/**
 * Airdrop Filters
 * Filter tabs and search input for airdrop list
 */

import { Search } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Input } from '@/app/components/ui/input'
import type { AirdropFilter } from '../types'

interface AirdropFiltersProps {
  filter: AirdropFilter
  onFilterChange: (filter: AirdropFilter) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  stats: { total: number; eligible: number; claimable: number; upcoming: number }
}

export function AirdropFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  stats,
}: AirdropFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={filter} onValueChange={(v) => onFilterChange(v as AirdropFilter)}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="eligible">Eligible ({stats.eligible})</TabsTrigger>
          <TabsTrigger value="claimable">Claimable ({stats.claimable})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({stats.upcoming})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search airdrops..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
