"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { WalletButton } from "@/components/shared/wallet-button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/rewards", label: "Rewards" },
  { href: "/airdrops", label: "Airdrops" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b-3 border-border">
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center hover-lift">
          <Image
            src="/harvest-logo-text.png"
            alt="Harvest"
            width={180}
            height={52}
            className="h-13 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Wallet + Mobile menu */}
        <div className="flex items-center gap-3">
          <WalletButton />

          {/* Mobile menu button */}
          <button
            className="md:hidden cartoon-btn-secondary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden p-4 animate-fade-in">
          <div className="bg-card rounded-lg p-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-bold transition-all",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
