'use client'

/**
 * ProtocolStatusBadge Component
 * Displays status badges for protocols (active, coming_soon, deprecated)
 */

import { Badge } from '@/app/components/ui/badge'
import type { ProtocolStatus } from '@/constants/protocols/types'

interface ProtocolStatusBadgeProps {
  status: ProtocolStatus
}

export function ProtocolStatusBadge({ status }: ProtocolStatusBadgeProps) {
  if (status === 'active') return null

  if (status === 'coming_soon') {
    return (
      <Badge
        variant="secondary"
        className="bg-amber-500/10 text-amber-500 border border-amber-500/20"
      >
        Coming Soon
      </Badge>
    )
  }

  if (status === 'deprecated') {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Deprecated
      </Badge>
    )
  }

  return null
}
