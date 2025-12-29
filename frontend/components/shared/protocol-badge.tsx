"use client";

import { cn } from "@/app/lib/utils";

const protocolColors: Record<string, string> = {
  yuzu: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  joule: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  meridian: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  thunderhead: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  canopy: "bg-green-500/20 text-green-400 border-green-500/30",
  default: "bg-muted text-muted-foreground border-border",
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
        colorClass,
        className
      )}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={name} className="w-3.5 h-3.5 rounded-full" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full bg-current opacity-50" />
      )}
      {name}
    </div>
  );
}
