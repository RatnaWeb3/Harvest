"use client";

import { cn } from "@/app/lib/utils";

const protocolColors: Record<string, string> = {
  yuzu: "bg-orange-500/20 text-orange-300 border-orange-500",
  joule: "bg-blue-500/20 text-blue-300 border-blue-500",
  meridian: "bg-purple-500/20 text-purple-300 border-purple-500",
  thunderhead: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
  canopy: "bg-green-500/20 text-green-300 border-green-500",
  default: "bg-muted text-foreground border-border",
};

interface ProtocolBadgeProps {
  name: string;
  iconUrl?: string;
  className?: string;
}

export function ProtocolBadge({ name, iconUrl, className }: ProtocolBadgeProps) {
  const colorClass = protocolColors[name.toLowerCase()] || protocolColors.default;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        colorClass,
        className
      )}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={name} className="w-4 h-4 rounded-full" />
      ) : (
        <div className="w-4 h-4 rounded-full bg-current opacity-60" />
      )}
      {name}
    </div>
  );
}
