"use client";

import { cn } from "@/app/lib/utils";

interface TokenDisplayProps {
  symbol: string;
  amount: string | number;
  usdValue?: string | number;
  iconUrl?: string;
  compact?: boolean;
  className?: string;
}

export function TokenDisplay({
  symbol,
  amount,
  usdValue,
  iconUrl,
  compact = false,
  className,
}: TokenDisplayProps) {
  const formattedAmount =
    typeof amount === "number"
      ? amount.toLocaleString(undefined, { maximumFractionDigits: 6 })
      : amount;

  const formattedUsd =
    usdValue !== undefined
      ? `$${typeof usdValue === "number" ? usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : usdValue}`
      : null;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {iconUrl && (
          <img src={iconUrl} alt={symbol} className="w-4 h-4 rounded-full" />
        )}
        <span className="font-medium">{formattedAmount}</span>
        <span className="text-muted-foreground">{symbol}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {iconUrl ? (
        <img src={iconUrl} alt={symbol} className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{symbol.slice(0, 2)}</span>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-foreground">{formattedAmount}</span>
          <span className="text-sm text-muted-foreground">{symbol}</span>
        </div>
        {formattedUsd && (
          <span className="text-xs text-muted-foreground">{formattedUsd}</span>
        )}
      </div>
    </div>
  );
}
