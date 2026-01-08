'use client'

import { useState, useMemo } from 'react'
import { Wallet, ChevronDown, LogOut, Copy, Check, ExternalLink, Loader2 } from 'lucide-react'
import { useAptosWallet, getExplorerUrl } from '@/lib/move'
import { useMoveBalance } from '@/lib/hooks/use-move-balance'
import { cn } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/button'
import { WalletSelectionModal } from '@/app/components/wallet-selection-modal'

export function WalletButton() {
  const { connected, address, disconnect } = useAptosWallet()
  const { formatted, isLoading: isBalanceLoading } = useMoveBalance(address)
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  // Generate DiceBear pixel-art avatar URL using address as seed
  const avatarUrl = useMemo(() => {
    if (!address) return null
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${address}`
  }, [address])

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExplorer = () => {
    if (address) {
      window.open(getExplorerUrl('account', address), '_blank')
    }
  }

  if (!connected) {
    return (
      <WalletSelectionModal>
        <Button size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect</span>
        </Button>
      </WalletSelectionModal>
    )
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2 h-10">
        {/* Balance */}
        <span className="text-sm font-bold">
          {isBalanceLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            `${formatted} MOVE`
          )}
        </span>

        {/* Divider */}
        <div className="h-5 w-px bg-border" />

        {/* Avatar */}
        {avatarUrl && (
          <img src={avatarUrl} alt="Wallet" className="w-5 h-5 rounded-full" />
        )}
        {!avatarUrl && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}

        {/* Address */}
        <span className="font-mono text-xs hidden sm:inline">{truncatedAddress}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-3 z-50 w-56 cartoon-card p-2 animate-fade-in">
            {/* Full address display */}
            <div className="px-3 py-2 text-xs text-muted-foreground font-mono break-all border-b-2 border-border mb-2">
              {address}
            </div>

            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <button
              onClick={handleExplorer}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View in Explorer
            </button>
            <div className="cartoon-divider my-2" />
            <button
              onClick={() => {
                disconnect()
                setIsOpen(false)
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  )
}
