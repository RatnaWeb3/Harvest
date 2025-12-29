'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth'
import { WalletProvider } from '@/app/components/wallet-provider'
import { useState, type ReactNode } from 'react'

// Privy requires a valid app ID - use placeholder for build if not set
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

function PrivyWrapper({ children }: { children: ReactNode }) {
  // Skip Privy during SSR/build if no app ID is configured
  if (!PRIVY_APP_ID) {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'discord', 'github'],
        appearance: {
          theme: 'dark',
          accentColor: '#22c55e',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection)
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PrivyWrapper>{children}</PrivyWrapper>
      </WalletProvider>
    </QueryClientProvider>
  )
}
