'use client'

/**
 * ClaimAllModal Component
 * Modal for selecting and claiming rewards from multiple protocols
 */

import { useState, useMemo, useCallback } from 'react'
import { Sparkles, Fuel, Wallet, TrendingUp, Settings2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Separator } from '@/app/components/ui/separator'
import { ProtocolBadge } from '@/components/shared/protocol-badge'
import type { ProtocolRewards, ProtocolId } from '@/app/dashboard/types'
import { PROTOCOL_NAMES } from '@/app/dashboard/constants'

type CompoundOption = 'wallet' | 'auto-compound' | 'custom'

interface ClaimAllModalProps {
  isOpen: boolean
  onClose: () => void
  rewardsByProtocol: ProtocolRewards[]
  onClaimSelected: (selectedProtocols: ProtocolId[]) => void
  isClaiming: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function ProtocolRewardRow({
  reward,
  isSelected,
  onToggle,
  disabled,
}: {
  reward: ProtocolRewards
  isSelected: boolean
  onToggle: () => void
  disabled: boolean
}) {
  const claimableValue = reward.rewards
    .filter((r) => r.claimable)
    .reduce((sum, r) => sum + r.usdValue, 0)

  if (claimableValue === 0) return null

  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          disabled={disabled}
          aria-label={`Select ${reward.protocolName} rewards`}
        />
        <ProtocolBadge name={reward.protocolName} />
        <span className="text-sm text-muted-foreground">
          {reward.rewards.filter((r) => r.claimable).length} reward
          {reward.rewards.filter((r) => r.claimable).length !== 1 ? 's' : ''}
        </span>
      </div>
      <span className="font-medium">{formatCurrency(claimableValue)}</span>
    </div>
  )
}

function CompoundOptionsSection({
  selected,
  onChange,
  disabled,
}: {
  selected: CompoundOption
  onChange: (option: CompoundOption) => void
  disabled: boolean
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Settings2 className="h-4 w-4" />
        <span>Destination</span>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
          <input
            type="radio"
            name="compound-option"
            checked={selected === 'wallet'}
            onChange={() => onChange('wallet')}
            disabled={disabled}
            className="h-4 w-4 text-primary"
          />
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Send to wallet</p>
            <p className="text-xs text-muted-foreground">Receive tokens directly</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors opacity-60">
          <input
            type="radio"
            name="compound-option"
            checked={selected === 'auto-compound'}
            onChange={() => onChange('auto-compound')}
            disabled={true}
            className="h-4 w-4"
          />
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Auto-compound</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </div>
        </label>
      </div>
    </div>
  )
}

export function ClaimAllModal({
  isOpen,
  onClose,
  rewardsByProtocol,
  onClaimSelected,
  isClaiming,
}: ClaimAllModalProps) {
  const claimableProtocols = useMemo(
    () => rewardsByProtocol.filter((p) => p.rewards.some((r) => r.claimable)),
    [rewardsByProtocol]
  )

  const [selectedProtocols, setSelectedProtocols] = useState<Set<ProtocolId>>(
    () => new Set(claimableProtocols.map((p) => p.protocol))
  )
  const [compoundOption, setCompoundOption] = useState<CompoundOption>('wallet')

  const toggleProtocol = useCallback((protocol: ProtocolId) => {
    setSelectedProtocols((prev) => {
      const next = new Set(prev)
      if (next.has(protocol)) next.delete(protocol)
      else next.add(protocol)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    if (selectedProtocols.size === claimableProtocols.length) {
      setSelectedProtocols(new Set())
    } else {
      setSelectedProtocols(new Set(claimableProtocols.map((p) => p.protocol)))
    }
  }, [selectedProtocols.size, claimableProtocols])

  const selectedTotal = useMemo(() => {
    return claimableProtocols
      .filter((p) => selectedProtocols.has(p.protocol))
      .reduce(
        (sum, p) => sum + p.rewards.filter((r) => r.claimable).reduce((s, r) => s + r.usdValue, 0),
        0
      )
  }, [claimableProtocols, selectedProtocols])

  const estimatedGas = selectedProtocols.size * 0.01 // Rough estimate

  const handleClaim = () => {
    onClaimSelected(Array.from(selectedProtocols))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Harvest Rewards
          </DialogTitle>
          <DialogDescription>
            Select which protocol rewards to claim
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Select All */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleAll}
              disabled={isClaiming}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {selectedProtocols.size === claimableProtocols.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-muted-foreground">
              {selectedProtocols.size} of {claimableProtocols.length} selected
            </span>
          </div>

          {/* Protocol List */}
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {claimableProtocols.map((reward) => (
              <ProtocolRewardRow
                key={reward.protocol}
                reward={reward}
                isSelected={selectedProtocols.has(reward.protocol)}
                onToggle={() => toggleProtocol(reward.protocol)}
                disabled={isClaiming}
              />
            ))}
          </div>

          <Separator />

          {/* Compound Options */}
          <CompoundOptionsSection
            selected={compoundOption}
            onChange={setCompoundOption}
            disabled={isClaiming}
          />

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Rewards</span>
              <span className="font-medium">{formatCurrency(selectedTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Fuel className="h-3 w-3" />
                Est. Gas
              </span>
              <span className="text-muted-foreground">~{formatCurrency(estimatedGas)}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleClaim}
          disabled={selectedProtocols.size === 0 || isClaiming}
          className="w-full gap-2"
          size="lg"
        >
          <Sparkles className="h-4 w-4" />
          {isClaiming ? 'Harvesting...' : `Harvest All (${formatCurrency(selectedTotal)})`}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
