'use client'

/**
 * Period Selector Component
 * Tab buttons for selecting leaderboard time period
 */

import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import type { LeaderboardPeriod } from '../types'

interface PeriodSelectorProps {
  value: LeaderboardPeriod
  onChange: (period: LeaderboardPeriod) => void
}

const PERIODS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'all-time', label: 'All Time' },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as LeaderboardPeriod)}>
      <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
        {PERIODS.map((period) => (
          <TabsTrigger
            key={period.value}
            value={period.value}
            className="text-xs md:text-sm"
          >
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
