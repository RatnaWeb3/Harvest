'use client'

/**
 * Claim History Tab
 * Displays past claims with filtering, pagination, and CSV export
 */

import { History, Download, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/skeleton'
import { Badge } from '@/app/components/ui/badge'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { getExplorerUrl } from '@/lib/move'
import { PROTOCOL_NAMES } from '@/app/dashboard/constants'
import type { ClaimHistory, HistoryFilters, PaginationState, ProtocolId } from '../types'

interface HistoryTabProps {
  history: ClaimHistory[]
  pagination: PaginationState
  filters: HistoryFilters
  isLoading: boolean
  onSetProtocolFilter: (protocol: ProtocolId | undefined) => void
  onClearFilters: () => void
  onGoToPage: (page: number) => void
  onExportCSV: () => void
}

const PROTOCOLS: ProtocolId[] = ['yuzu', 'joule', 'meridian', 'thunderhead', 'canopy']

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function StatusBadge({ status }: { status: 'pending' | 'confirmed' | 'failed' }) {
  const variants = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    confirmed: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  }
  return (
    <Badge variant="outline" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function ClaimRow({ claim }: { claim: ClaimHistory }) {
  const explorerUrl = getExplorerUrl('txn', claim.txHash)
  const tokenList = claim.rewards.map((r) => r.tokenSymbol).join(', ')

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm">{formatDate(claim.timestamp)}</p>
      </td>
      <td className="py-3 px-4">
        <ProtocolBadge name={PROTOCOL_NAMES[claim.protocol]} className="text-xs" />
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-muted-foreground">{tokenList}</p>
      </td>
      <td className="py-3 px-4 text-right">
        <p className="text-sm font-medium">{formatCurrency(claim.totalUsdValue)}</p>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={claim.status} />
      </td>
      <td className="py-3 px-4">
        <Button variant="ghost" size="sm" asChild>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </td>
    </tr>
  )
}

function HistoryTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function HistoryTab({
  history,
  pagination,
  filters,
  isLoading,
  onSetProtocolFilter,
  onClearFilters,
  onGoToPage,
  onExportCSV,
}: HistoryTabProps) {
  if (isLoading) return <HistoryTableSkeleton />

  const hasFilters = filters.protocol || filters.dateFrom || filters.dateTo

  return (
    <div className="space-y-4">
      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {PROTOCOLS.map((p) => (
            <Button
              key={p}
              variant={filters.protocol === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSetProtocolFilter(filters.protocol === p ? undefined : p)}
            >
              {PROTOCOL_NAMES[p]}
            </Button>
          ))}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onExportCSV} disabled={history.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* History Table */}
      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Claim History"
          description={
            hasFilters
              ? 'No claims match your current filters. Try adjusting or clearing filters.'
              : "You haven't claimed any rewards yet. Claim your first rewards to see them here."
          }
          actionLabel={hasFilters ? 'Clear Filters' : undefined}
          onAction={hasFilters ? onClearFilters : undefined}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Protocol</th>
                    <th className="py-3 px-4 font-medium">Tokens</th>
                    <th className="py-3 px-4 font-medium text-right">Value</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Tx</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((claim) => (
                    <ClaimRow key={claim.id} claim={claim} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{' '}
            {pagination.totalCount} claims
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
