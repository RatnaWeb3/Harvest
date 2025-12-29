'use client'

/**
 * Airdrop Detail Modal
 * Full airdrop details with timeline and requirements
 */

import { useState } from 'react'
import {
  Gift,
  Check,
  X,
  Clock,
  Calendar,
  ExternalLink,
  Bell,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { cn } from '@/app/lib/utils'
import { addReminder, removeReminder, hasReminder } from '@/lib/reminders'
import { useEligibilityCheck } from '../hooks/use-eligibility-check'
import type { Airdrop } from '../types'

interface AirdropDetailModalProps {
  airdrop: Airdrop | null
  isOpen: boolean
  onClose: () => void
}

const STATUS_CONFIG = {
  claimable: { label: 'Claimable', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  live: { label: 'Live', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  upcoming: { label: 'Upcoming', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ended: { label: 'Ended', className: 'bg-muted text-muted-foreground border-muted' },
}

function formatDate(date?: Date): string {
  if (!date) return 'TBA'
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function AirdropDetailModal({ airdrop, isOpen, onClose }: AirdropDetailModalProps) {
  const [reminderSet, setReminderSet] = useState(() =>
    airdrop ? hasReminder(airdrop.id) : false
  )
  const { result, isChecking, checkEligibility } = useEligibilityCheck()

  if (!airdrop) return null

  const statusConfig = STATUS_CONFIG[airdrop.status]

  const handleReminder = () => {
    if (reminderSet) {
      removeReminder(airdrop.id)
      setReminderSet(false)
    } else if (airdrop.snapshotDate) {
      addReminder(airdrop.id, airdrop.name, airdrop.snapshotDate)
      setReminderSet(true)
    }
  }

  const handleCheckEligibility = () => {
    checkEligibility(airdrop.id)
  }

  const eligibility = result?.airdropId === airdrop.id ? result.eligible : airdrop.eligible

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle>{airdrop.name}</DialogTitle>
              <DialogDescription>{airdrop.protocol}</DialogDescription>
            </div>
            <Badge className={cn('shrink-0', statusConfig.className)}>{statusConfig.label}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          {airdrop.description && (
            <p className="text-sm text-muted-foreground">{airdrop.description}</p>
          )}

          <Separator />

          {/* Eligibility section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Eligibility</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {eligibility === true && (
                  <>
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-green-400">You are eligible</span>
                  </>
                )}
                {eligibility === false && (
                  <>
                    <X className="h-5 w-5 text-red-400" />
                    <span className="text-red-400">Not eligible</span>
                  </>
                )}
                {eligibility === null && (
                  <>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Not checked</span>
                  </>
                )}
              </div>
              {airdrop.checkUrl && eligibility === null && (
                <Button size="sm" variant="outline" onClick={handleCheckEligibility} disabled={isChecking}>
                  {isChecking && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  Check
                </Button>
              )}
            </div>

            {/* Allocation */}
            {(airdrop.allocation || result?.allocation) && (
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="text-sm text-muted-foreground">Your Allocation</div>
                <div className="text-lg font-semibold">{result?.allocation || airdrop.allocation}</div>
                {(airdrop.allocationUsd || result?.allocationUsd) && (
                  <div className="text-sm text-muted-foreground">
                    ≈ ${(result?.allocationUsd || airdrop.allocationUsd)?.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Timeline</h4>
            <div className="space-y-2">
              {airdrop.snapshotDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Snapshot:</span>
                  <span>{formatDate(airdrop.snapshotDate)}</span>
                </div>
              )}
              {airdrop.claimDeadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Claim Deadline:</span>
                  <span>{formatDate(airdrop.claimDeadline)}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Requirements</h4>
            <ul className="space-y-2">
              {airdrop.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {airdrop.status === 'claimable' && airdrop.claimUrl && (
              <Button className="flex-1" asChild>
                <a href={airdrop.claimUrl} target="_blank" rel="noopener noreferrer">
                  Claim Now <ExternalLink className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            )}
            {airdrop.status === 'live' && airdrop.checkUrl && (
              <Button variant="secondary" className="flex-1" asChild>
                <a href={airdrop.checkUrl} target="_blank" rel="noopener noreferrer">
                  Check Details <ExternalLink className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            )}
            {airdrop.status === 'upcoming' && (
              <Button
                variant={reminderSet ? 'secondary' : 'outline'}
                className="flex-1"
                onClick={handleReminder}
              >
                <Bell className={cn('mr-1.5 h-4 w-4', reminderSet && 'text-primary')} />
                {reminderSet ? 'Reminder Set' : 'Set Reminder'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
