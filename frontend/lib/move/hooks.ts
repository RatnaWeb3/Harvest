'use client'

/**
 * Move Abstraction Layer - Wallet Hooks
 * Unified interface for Privy and native wallet interactions
 */

import { useCallback, useMemo } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'
import { aptos } from './client'
import type { TransactionPayload, WalletState } from './types'

/**
 * Hook to get the configured Aptos client
 * Use this for view functions and reading blockchain state
 */
export function useAptosClient() {
  return aptos
}

// Helper to extract Aptos wallet address from Privy linked accounts
function getPrivyAptosAddress(
  linkedAccounts: ReturnType<typeof usePrivy>['user']
): string | null {
  if (!linkedAccounts?.linkedAccounts) return null

  for (const account of linkedAccounts.linkedAccounts) {
    if (
      account.type === 'wallet' &&
      'chainType' in account &&
      account.chainType === 'aptos' &&
      'address' in account
    ) {
      return account.address as string
    }
  }
  return null
}

/**
 * Unified wallet hook that handles both Privy and native wallet adapters
 * Provides a consistent interface regardless of wallet type
 */
export function useAptosWallet(): WalletState {
  // Native wallet adapter
  const nativeWallet = useWallet()

  // Privy wallet
  const { user, authenticated, logout } = usePrivy()

  // Get Privy Aptos wallet address
  const privyAptosAddress = getPrivyAptosAddress(user)
  const isPrivy = Boolean(privyAptosAddress)
  const isNativeConnected = Boolean(nativeWallet.connected && nativeWallet.account)

  // Determine connection state and address
  const connected = isNativeConnected || (authenticated && isPrivy)
  const address: string | null = isNativeConnected
    ? nativeWallet.account?.address?.toString() || null
    : privyAptosAddress

  // Sign and submit transaction - unified interface
  const signAndSubmitTransaction = useCallback(
    async (payload: TransactionPayload): Promise<string> => {
      if (isNativeConnected) {
        // Use native wallet adapter
        const response = await nativeWallet.signAndSubmitTransaction({
          data: {
            function: payload.function as `${string}::${string}::${string}`,
            typeArguments: payload.typeArguments as [],
            functionArguments: payload.functionArguments as [],
          },
        })
        return response.hash
      }

      if (isPrivy && privyAptosAddress) {
        // TODO: Implement Privy transaction signing
        throw new Error('Privy transaction signing not yet implemented')
      }

      throw new Error('No wallet connected')
    },
    [isNativeConnected, isPrivy, nativeWallet, privyAptosAddress]
  )

  // Disconnect handler
  const disconnect = useCallback(async () => {
    if (isNativeConnected) {
      await nativeWallet.disconnect()
    } else if (authenticated) {
      await logout()
    }
  }, [isNativeConnected, authenticated, nativeWallet, logout])

  return useMemo(
    () => ({
      connected,
      address,
      isPrivy,
      signAndSubmitTransaction,
      disconnect,
    }),
    [connected, address, isPrivy, signAndSubmitTransaction, disconnect]
  )
}
