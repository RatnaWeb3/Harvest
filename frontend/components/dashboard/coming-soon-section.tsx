'use client'

/**
 * ComingSoonSection Component
 * Displays all coming soon protocols in a dedicated section
 */

import { COMING_SOON_PROTOCOLS, getProtocolConfig } from '@/constants/protocols'
import { ComingSoonCard } from '@/components/shared/coming-soon-card'

export function ComingSoonSection() {
  if (COMING_SOON_PROTOCOLS.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-muted-foreground">
        Coming Soon
      </h3>
      <div className="grid gap-3">
        {COMING_SOON_PROTOCOLS.map((id) => {
          const config = getProtocolConfig(id)
          return <ComingSoonCard key={id} protocol={config} />
        })}
      </div>
    </div>
  )
}
