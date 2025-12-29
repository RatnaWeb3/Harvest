"use client";

import { useState } from "react";
import { Wallet, ChevronDown, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { useAptosWallet, getExplorerUrl } from "@/lib/move";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

export function WalletButton() {
  const { connected, address, disconnect } = useAptosWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExplorer = () => {
    if (address) {
      window.open(getExplorerUrl("account", address), "_blank");
    }
  };

  if (!connected) {
    return (
      <Button variant="default" size="sm" className="gap-2">
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-sm">{truncatedAddress}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-border bg-popover p-2 shadow-lg animate-fade-in">
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Address"}
            </button>
            <button
              onClick={handleExplorer}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View in Explorer
            </button>
            <div className="my-1 h-px bg-border" />
            <button
              onClick={() => { disconnect(); setIsOpen(false); }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
