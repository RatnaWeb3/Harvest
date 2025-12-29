'use client'

/**
 * Recent Claims Component
 * Shows the last 5 claim transactions with explorer links
 */

import { useEffect, useState } from 'react'
import { History, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import { getExplorerUrl } from '@/lib/move'
import { PROTOCOL_NAMES } from '../constants'
import type { ProtocolId } from '../types'

export interface ClaimRecord {
  id: string
  protocol: ProtocolId
  txHash: string
  amount: number
  timestamp: number
}

const STORAGE_KEY = 'harvest_recent_claims'
const MAX_CLAIMS = 5

export function getRecentClaims(): ClaimRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveClaimRecord(record: Omit<ClaimRecord, 'id'>) {
  const claims = getRecentClaims()
  const newClaim: ClaimRecord = {
    ...record,
    id: `${record.protocol}-${record.timestamp}`,
  }
  const updated = [newClaim, ...claims].slice(0, MAX_CLAIMS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function ClaimRow({ claim }: { claim: ClaimRecord }) {
  const explorerUrl = getExplorerUrl('txn', claim.txHash)

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <div>
          <div className="flex items-center gap-2">
            <ProtocolBadge name={PROTOCOL_NAMES[claim.protocol]} className="text-xs" />
            <span className="text-sm font-medium">{formatCurrency(claim.amount)}</span>
          </div>
          <p className="text-xs text-muted-foreground">{formatTimeAgo(claim.timestamp)}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </div>
  )
}

function RecentClaimsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RecentClaims({ isLoading = false }: { isLoading?: boolean }) {
  const [claims, setClaims] = useState<ClaimRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setClaims(getRecentClaims())
  }, [])

  if (!mounted || isLoading) {
    return <RecentClaimsSkeleton />
  }

  if (claims.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" />
          Recent Claims
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {claims.map((claim) => (
          <ClaimRow key={claim.id} claim={claim} />
        ))}
      </CardContent>
    </Card>
  )
}
