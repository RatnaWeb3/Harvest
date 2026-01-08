'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, TrendingUp, Wallet, Zap, Sparkles } from 'lucide-react'
import { useAptosWallet } from '@/lib/move'
import { Button } from '@/app/components/ui/button'

const features = [
  {
    icon: TrendingUp,
    title: 'Track Rewards',
    description: 'Monitor pending rewards across all Movement protocols in one dashboard',
  },
  {
    icon: Wallet,
    title: 'Batch Claims',
    description: 'Claim rewards from multiple protocols in a single transaction',
  },
  {
    icon: Zap,
    title: 'Auto-Compound',
    description: 'Set up automatic reward reinvestment to maximize yields',
  },
]

export default function HomePage() {
  const router = useRouter()
  const { connected } = useAptosWallet()

  // Auto-redirect connected users to dashboard
  useEffect(() => {
    if (connected) {
      router.push('/dashboard')
    }
  }, [connected, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        {/* Logo with floating animation */}
        <div className="flex items-center justify-center mb-8">
          <div className="animate-float">
            <Image
              src="/harvest-logo.png"
              alt="Harvest"
              width={120}
              height={120}
              className="drop-shadow-lg"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 cartoon-badge-primary mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Movement Network
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gradient-primary tracking-tight">
          Harvest Your Rewards
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          The all-in-one dashboard for tracking, claiming, and auto-compounding
          rewards across the Movement ecosystem.
        </p>

        <Button
          onClick={() => router.push('/dashboard')}
          size="lg"
          className="gap-3 text-lg px-10"
        >
          Launch App
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Features Grid with Cartoon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl w-full mb-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="cartoon-card hover-lift p-6"
          >
            <div className="cartoon-icon-primary w-14 h-14 mb-5">
              <feature.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Supported Protocols with cartoon badges */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-5 font-medium">
          Supporting protocols on Movement Network
        </p>
        <div className="flex items-center justify-center flex-wrap gap-3">
          <span className="cartoon-badge">Joule</span>
          <span className="cartoon-badge">Meridian</span>
          <span className="cartoon-badge">Yuzu</span>
          <span className="cartoon-badge-primary">+ more</span>
        </div>
      </div>
    </div>
  )
}
