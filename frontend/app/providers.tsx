'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth'
import { WalletProvider } from '@/app/components/wallet-provider'
import { useState, createContext, useContext, type ReactNode } from 'react'

// Get Privy App ID from environment
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
export const isPrivyConfigured = !!(PRIVY_APP_ID && PRIVY_APP_ID !== 'YOUR_PRIVY_APP_ID' && PRIVY_APP_ID.length > 0)

// Context to track if Privy is available
const PrivyAvailableContext = createContext<boolean>(false)
export const usePrivyAvailable = () => useContext(PrivyAvailableContext)

// Mock Privy context for when Privy is not configured
interface MockPrivyContextType {
  ready: boolean
  authenticated: boolean
  user: null
  login: () => void
  logout: () => Promise<void>
}

const MockPrivyContext = createContext<MockPrivyContextType>({
  ready: true,
  authenticated: false,
  user: null,
  login: () => {},
  logout: async () => {},
})

export const useMockPrivy = () => useContext(MockPrivyContext)

// Mock createWallet context
interface MockCreateWalletContextType {
  createWallet: () => Promise<null>
}

const MockCreateWalletContext = createContext<MockCreateWalletContextType>({
  createWallet: async () => null,
})

export const useMockCreateWallet = () => useContext(MockCreateWalletContext)

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

  // If no Privy App ID is configured, render without PrivyProvider
  if (!isPrivyConfigured) {
    return (
      <QueryClientProvider client={queryClient}>
        <PrivyAvailableContext.Provider value={false}>
          <MockPrivyContext.Provider
            value={{
              ready: true,
              authenticated: false,
              user: null,
              login: () => console.warn('Privy not configured'),
              logout: async () => {},
            }}
          >
            <MockCreateWalletContext.Provider value={{ createWallet: async () => null }}>
              <WalletProvider>{children}</WalletProvider>
            </MockCreateWalletContext.Provider>
          </MockPrivyContext.Provider>
        </PrivyAvailableContext.Provider>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyAvailableContext.Provider value={true}>
        <WalletProvider>
          <PrivyProvider
            appId={PRIVY_APP_ID!}
            config={{
              loginMethods: ['email'],
              appearance: {
                theme: 'dark',
                accentColor: '#1fb855',
                logo: '/logo.png',
              },
            }}
          >
            {children}
          </PrivyProvider>
        </WalletProvider>
      </PrivyAvailableContext.Provider>
    </QueryClientProvider>
  )
}
