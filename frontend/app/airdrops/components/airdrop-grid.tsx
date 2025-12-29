'use client'

/**
 * Airdrop Grid
 * Grid layout for displaying airdrop cards with empty state
 */

import { Gift } from 'lucide-react'
import { Skeleton } from '@/app/components/ui/skeleton'
import { AirdropCard } from './airdrop-card'
import type { Airdrop } from '../types'

interface AirdropGridProps {
  airdrops: Airdrop[]
  isLoading: boolean
  onSelectAirdrop: (airdrop: Airdrop) => void
}

function AirdropSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Gift className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">No airdrops found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your filters or check back later for new opportunities.
      </p>
    </div>
  )
}

export function AirdropGrid({ airdrops, isLoading, onSelectAirdrop }: AirdropGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AirdropSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (airdrops.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {airdrops.map((airdrop) => (
        <AirdropCard
          key={airdrop.id}
          airdrop={airdrop}
          onClick={() => onSelectAirdrop(airdrop)}
        />
      ))}
    </div>
  )
}
