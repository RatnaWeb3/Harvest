'use client'

/**
 * Share Rank Component
 * Generate shareable links and share to social media
 */

import { useState } from 'react'
import { Share2, Twitter, Copy, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import type { UserRankInfo } from '../types'

interface ShareRankProps {
  userRank: UserRankInfo | null
  isConnected: boolean
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

export function ShareRank({ userRank, isConnected }: ShareRankProps) {
  const [copied, setCopied] = useState(false)

  if (!isConnected || !userRank) return null

  const shareText = `I'm ranked #${userRank.rank} on Harvest with ${formatUsd(userRank.entry.totalHarvested)} harvested! 🌾

Claim your rewards across the Movement ecosystem:
https://harvest.movement.xyz`

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareTwitter}
        className="gap-2"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Share on X</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span className="hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </Button>
    </div>
  )
}
