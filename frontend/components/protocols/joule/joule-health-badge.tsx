'use client'

/**
 * JouleHealthBadge Component
 * Displays health factor with color-coded status
 */

import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface JouleHealthBadgeProps {
  healthFactor: number
}

type HealthStatus = 'safe' | 'warning' | 'danger'

function getHealthStatus(hf: number): HealthStatus {
  if (hf >= 2.0) return 'safe'
  if (hf >= 1.2) return 'warning'
  return 'danger'
}

const statusConfig: Record<
  HealthStatus,
  { color: string; bgColor: string; icon: typeof CheckCircle; label: string }
> = {
  safe: {
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: CheckCircle,
    label: 'Safe',
  },
  warning: {
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: AlertTriangle,
    label: 'At Risk',
  },
  danger: {
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: AlertCircle,
    label: 'Liquidation Risk',
  },
}

export function JouleHealthBadge({ healthFactor }: JouleHealthBadgeProps) {
  const status = getHealthStatus(healthFactor)
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`p-3 rounded-lg ${config.bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.color}`} />
          <span className="text-sm text-muted-foreground">Health Factor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${config.color}`}>
            {healthFactor === Infinity ? '∞' : healthFactor.toFixed(2)}
          </span>
          <span className={`text-xs ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Health bar */}
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            status === 'safe'
              ? 'bg-green-500'
              : status === 'warning'
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}
          style={{
            width: `${Math.min(100, (healthFactor / 3) * 100)}%`,
          }}
        />
      </div>
    </div>
  )
}
