'use client'

/**
 * Transaction Status Modal
 * Shows the current status of a claim transaction
 */

import { Loader2, CheckCircle2, XCircle, ExternalLink, Wallet } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import type { TxStatus } from '@/app/dashboard/hooks/use-claim-rewards'
import { PROTOCOL_NAMES } from '@/app/dashboard/constants'
import type { ProtocolId } from '@/app/dashboard/types'

interface TxStatusModalProps {
  isOpen: boolean
  onClose: () => void
  status: TxStatus
  protocol?: ProtocolId
  txHash?: string
  error?: string
  explorerUrl?: string
  rewardsCount?: number
}

function StatusIcon({ status }: { status: TxStatus }) {
  switch (status) {
    case 'pending':
      return <Wallet className="h-12 w-12 text-primary animate-pulse" />
    case 'submitted':
      return <Loader2 className="h-12 w-12 text-primary animate-spin" />
    case 'confirmed':
      return <CheckCircle2 className="h-12 w-12 text-green-500" />
    case 'failed':
      return <XCircle className="h-12 w-12 text-destructive" />
    default:
      return null
  }
}

function StatusMessage({ status, protocol, error }: {
  status: TxStatus
  protocol?: ProtocolId
  error?: string
}) {
  const protocolName = protocol ? PROTOCOL_NAMES[protocol] : 'Protocol'

  switch (status) {
    case 'pending':
      return 'Waiting for wallet approval...'
    case 'submitted':
      return `Claiming ${protocolName} rewards...`
    case 'confirmed':
      return 'Claim successful!'
    case 'failed':
      return error || 'Transaction failed'
    default:
      return ''
  }
}

export function TxStatusModal({
  isOpen,
  onClose,
  status,
  protocol,
  txHash,
  error,
  explorerUrl,
  rewardsCount = 0,
}: TxStatusModalProps) {
  const isComplete = status === 'confirmed' || status === 'failed'
  const protocolName = protocol ? PROTOCOL_NAMES[protocol] : 'Protocol'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {status === 'confirmed' ? 'Claim Complete' : 'Claiming Rewards'}
          </DialogTitle>
          <DialogDescription>
            {protocol && `${protocolName} - ${rewardsCount} reward${rewardsCount !== 1 ? 's' : ''}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          <StatusIcon status={status} />
          <p className="text-center text-muted-foreground">
            <StatusMessage status={status} protocol={protocol} error={error} />
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {txHash && explorerUrl && (
            <Button variant="outline" className="w-full" asChild>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </a>
            </Button>
          )}
          {isComplete && (
            <Button onClick={onClose} className="w-full">
              {status === 'confirmed' ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
