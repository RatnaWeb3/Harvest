"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  Coins,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/airdrops", label: "Airdrops", icon: Coins },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const protocols = [
  { name: "Yuzu", color: "bg-orange-500" },
  { name: "Joule", color: "bg-blue-500" },
  { name: "Meridian", color: "bg-purple-500" },
  { name: "Thunderhead", color: "bg-yellow-500" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Protocol Quick Links */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Protocols
          </p>
          <div className="space-y-1">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <div className={cn("w-2 h-2 rounded-full", protocol.color)} />
                {protocol.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
