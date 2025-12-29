'use client'

/**
 * BatchProgress Component
 * Shows progress through multi-step batch claim with protocol-by-protocol status
 */

import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Progress } from '@/app/components/ui/progress'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import type { BatchClaimState, ProtocolClaimResult } from '@/app/dashboard/hooks/use-batch-claim'

interface BatchProgressProps {
  isOpen: boolean
  onClose: () => void
  state: BatchClaimState
  getExplorerLink: (txHash: string) => string
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function ResultIcon({ status }: { status: ProtocolClaimResult['status'] }) {
  switch (status) {
    case 'pending':
      return <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />
  }
}

function ProtocolResultRow({
  result,
  isActive,
  getExplorerLink,
}: {
  result: ProtocolClaimResult
  isActive: boolean
  getExplorerLink: (txHash: string) => string
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        isActive ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <ResultIcon status={result.status} />
        <ProtocolBadge name={result.protocol} />
        <span className="text-sm text-muted-foreground">{formatCurrency(result.amount)}</span>
      </div>
      {result.txHash && (
        <a
          href={getExplorerLink(result.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          View <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {result.error && (
        <span className="text-xs text-destructive max-w-32 truncate" title={result.error}>
          {result.error}
        </span>
      )}
    </div>
  )
}

export function BatchProgress({ isOpen, onClose, state, getExplorerLink }: BatchProgressProps) {
  const progress =
    state.totalClaims > 0 ? ((state.currentIndex + 1) / state.totalClaims) * 100 : 0

  const successCount = state.results.filter((r) => r.status === 'success').length
  const failedCount = state.results.filter((r) => r.status === 'failed').length
  const isComplete = state.status === 'completed' || state.status === 'failed'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && isComplete && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isComplete ? 'Harvest Complete' : 'Harvesting Rewards...'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>
                {state.currentIndex + 1} of {state.totalClaims}
              </span>
            </div>
            <Progress value={isComplete ? 100 : progress} className="h-2" />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.results.map((result, i) => (
              <ProtocolResultRow
                key={result.protocol}
                result={result}
                isActive={state.currentIndex === i && !isComplete}
                getExplorerLink={getExplorerLink}
              />
            ))}
          </div>

          {isComplete && (
            <div className="text-center text-sm text-muted-foreground">
              {successCount > 0 && failedCount === 0 && (
                <p className="text-green-500">All {successCount} claims successful!</p>
              )}
              {successCount > 0 && failedCount > 0 && (
                <p>{successCount} succeeded, {failedCount} failed</p>
              )}
              {successCount === 0 && failedCount > 0 && (
                <p className="text-destructive">All claims failed</p>
              )}
            </div>
          )}
        </div>

        {isComplete && (
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
