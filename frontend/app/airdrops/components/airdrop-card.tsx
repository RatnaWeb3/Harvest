'use client'

/**
 * Airdrop Card
 * Displays individual airdrop with status, eligibility, and actions
 */

import { useState } from 'react'
import { Gift, Check, X, Clock, Bell, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/app/lib/utils'
import { addReminder, removeReminder, hasReminder } from '@/lib/reminders'
import type { Airdrop } from '../types'

interface AirdropCardProps {
  airdrop: Airdrop
  onClick: () => void
}

const STATUS_CONFIG = {
  claimable: { label: 'Claimable', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  live: { label: 'Live', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  upcoming: { label: 'Upcoming', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ended: { label: 'Ended', className: 'bg-muted text-muted-foreground border-muted' },
}

function formatDate(date?: Date): string {
  if (!date) return 'TBA'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDaysRemaining(date?: Date): string {
  if (!date) return ''
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Expired'
  if (days === 0) return 'Today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export function AirdropCard({ airdrop, onClick }: AirdropCardProps) {
  const [showRequirements, setShowRequirements] = useState(false)
  const [reminderSet, setReminderSet] = useState(() => hasReminder(airdrop.id))
  const statusConfig = STATUS_CONFIG[airdrop.status]

  const handleReminder = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (reminderSet) {
      removeReminder(airdrop.id)
      setReminderSet(false)
    } else if (airdrop.snapshotDate) {
      addReminder(airdrop.id, airdrop.name, airdrop.snapshotDate)
      setReminderSet(true)
    }
  }

  const handleToggleRequirements = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowRequirements(!showRequirements)
  }

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{airdrop.name}</h3>
              <p className="text-sm text-muted-foreground">{airdrop.protocol}</p>
            </div>
          </div>
          <Badge className={cn('shrink-0', statusConfig.className)}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Eligibility */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Eligibility</span>
          <div className="flex items-center gap-1.5">
            {airdrop.eligible === true && (
              <>
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Eligible</span>
              </>
            )}
            {airdrop.eligible === false && (
              <>
                <X className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">Not Eligible</span>
              </>
            )}
            {airdrop.eligible === null && (
              <>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Unknown</span>
              </>
            )}
          </div>
        </div>

        {/* Allocation */}
        {airdrop.allocation && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Allocation</span>
            <div className="text-right">
              <div className="font-medium">{airdrop.allocation}</div>
              {airdrop.allocationUsd && (
                <div className="text-xs text-muted-foreground">
                  ≈ ${airdrop.allocationUsd.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        {(airdrop.snapshotDate || airdrop.claimDeadline) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {airdrop.status === 'upcoming' ? 'Snapshot' : 'Deadline'}
            </span>
            <div className="text-right">
              <div>{formatDate(airdrop.claimDeadline || airdrop.snapshotDate)}</div>
              <div className="text-xs text-muted-foreground">
                {formatDaysRemaining(airdrop.claimDeadline || airdrop.snapshotDate)}
              </div>
            </div>
          </div>
        )}

        {/* Requirements toggle */}
        <button
          onClick={handleToggleRequirements}
          className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
        >
          <span>Requirements ({airdrop.requirements.length})</span>
          {showRequirements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showRequirements && (
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {airdrop.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {req}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {airdrop.status === 'claimable' && airdrop.claimUrl && (
            <Button size="sm" className="flex-1" asChild onClick={(e) => e.stopPropagation()}>
              <a href={airdrop.claimUrl} target="_blank" rel="noopener noreferrer">
                Claim <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {airdrop.status === 'live' && airdrop.checkUrl && (
            <Button size="sm" variant="secondary" className="flex-1" asChild onClick={(e) => e.stopPropagation()}>
              <a href={airdrop.checkUrl} target="_blank" rel="noopener noreferrer">
                Check <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {airdrop.status === 'upcoming' && (
            <Button
              size="sm"
              variant={reminderSet ? 'secondary' : 'outline'}
              className="flex-1"
              onClick={handleReminder}
            >
              <Bell className={cn('mr-1.5 h-3.5 w-3.5', reminderSet && 'text-primary')} />
              {reminderSet ? 'Reminder Set' : 'Set Reminder'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
