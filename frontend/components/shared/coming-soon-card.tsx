'use client'

/**
 * ComingSoonCard Component
 * Displays a protocol card with coming soon state
 */

import { Clock } from 'lucide-react'
import { Card } from '@/app/components/ui/card'
import { ProtocolStatusBadge } from './protocol-status-badge'

interface ComingSoonCardProps {
  protocol: {
    displayName: string
    description?: string
    color: string
    icon: string
  }
}

export function ComingSoonCard({ protocol }: ComingSoonCardProps) {
  return (
    <Card className="p-4 border-dashed opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${protocol.color}20` }}
          >
            <Clock className="h-5 w-5" style={{ color: protocol.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{protocol.displayName}</span>
              <ProtocolStatusBadge status="coming_soon" />
            </div>
            {protocol.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {protocol.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
