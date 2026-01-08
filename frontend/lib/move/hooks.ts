'use client'

/**
 * Move Abstraction Layer - Wallet Hooks
 * Unified interface for Privy and native wallet interactions
 */

import { useCallback, useMemo } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'
import { useSignRawHash } from '@privy-io/react-auth/extended-chains'
import {
  AccountAuthenticatorEd25519,
  Ed25519PublicKey,
  Ed25519Signature,
  generateSigningMessageForTransaction,
  AccountAddress,
} from '@aptos-labs/ts-sdk'
import { aptos, toHex } from '@/app/lib/aptos'
import type { TransactionPayload, WalletState, SignedTransactionData } from './types'

/**
 * Hook to get the configured Aptos client
 * Use this for view functions and reading blockchain state
 */
export function useAptosClient() {
  return aptos
}

// Helper to extract Aptos wallet from Privy linked accounts
function getPrivyAptosWallet(
  user: ReturnType<typeof usePrivy>['user']
): { address: string; publicKey: string } | null {
  if (!user?.linkedAccounts) return null

  for (const account of user.linkedAccounts) {
    if (
      account.type === 'wallet' &&
      'chainType' in account &&
      account.chainType === 'aptos' &&
      'address' in account
    ) {
      return {
        address: account.address as string,
        publicKey: (account as any).publicKey || (account as any).public_key || '',
      }
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
  const { signRawHash } = useSignRawHash()

  // Get Privy Aptos wallet
  const privyWallet = getPrivyAptosWallet(user)
  const isPrivy = Boolean(privyWallet)
  const isNativeConnected = Boolean(nativeWallet.connected && nativeWallet.account)

  // Determine connection state and address
  const connected = isNativeConnected || (authenticated && isPrivy)
  const address: string | null = isNativeConnected
    ? nativeWallet.account?.address?.toString() || null
    : privyWallet?.address || null

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

      if (isPrivy && privyWallet) {
        // Build the transaction
        const rawTxn = await aptos.transaction.build.simple({
          sender: privyWallet.address,
          data: {
            function: payload.function as `${string}::${string}::${string}`,
            typeArguments: payload.typeArguments as [],
            functionArguments: payload.functionArguments as [],
          },
        })

        // Generate signing message
        const message = generateSigningMessageForTransaction(rawTxn)

        // Sign with Privy wallet
        const { signature: rawSignature } = await signRawHash({
          address: privyWallet.address,
          chainType: 'aptos',
          hash: `0x${toHex(message)}`,
        })

        // Clean public key - remove 0x prefix and leading byte if needed
        let cleanPublicKey = privyWallet.publicKey.startsWith('0x')
          ? privyWallet.publicKey.slice(2)
          : privyWallet.publicKey

        if (cleanPublicKey.length === 66) {
          cleanPublicKey = cleanPublicKey.slice(2)
        }

        // Create authenticator
        const senderAuthenticator = new AccountAuthenticatorEd25519(
          new Ed25519PublicKey(cleanPublicKey),
          new Ed25519Signature(
            rawSignature.startsWith('0x') ? rawSignature.slice(2) : rawSignature
          )
        )

        // Submit the signed transaction
        const committedTransaction = await aptos.transaction.submit.simple({
          transaction: rawTxn,
          senderAuthenticator,
        })

        // Wait for confirmation
        const executed = await aptos.waitForTransaction({
          transactionHash: committedTransaction.hash,
        })

        if (!executed.success) {
          throw new Error('Transaction failed')
        }

        return committedTransaction.hash
      }

      throw new Error('No wallet connected')
    },
    [isNativeConnected, isPrivy, nativeWallet, privyWallet, signRawHash]
  )

  // Sign transaction for sponsorship (without submitting)
  // Builds a fee payer transaction with 0x0 placeholder for Shinami to sponsor
  const signForSponsorship = useCallback(
    async (payload: TransactionPayload): Promise<SignedTransactionData> => {
      if (isNativeConnected && nativeWallet.account) {
        const senderAddress = nativeWallet.account.address.toString()

        // Build fee payer transaction with 0x0 placeholder
        const rawTxn = await aptos.transaction.build.simple({
          sender: senderAddress,
          withFeePayer: true, // Sets feePayer to 0x0
          data: {
            function: payload.function as `${string}::${string}::${string}`,
            typeArguments: payload.typeArguments as [],
            functionArguments: payload.functionArguments as [],
          },
        })

        // Sign with wallet adapter (sign only, don't submit)
        const signResult = await nativeWallet.signTransaction({
          transactionOrPayload: rawTxn,
          asFeePayer: false,
        })

        return {
          rawTransaction: rawTxn.bcsToHex().toString(),
          senderSignature: signResult.authenticator.bcsToHex().toString(),
        }
      }

      if (isPrivy && privyWallet) {
        // Build fee payer transaction
        const rawTxn = await aptos.transaction.build.simple({
          sender: privyWallet.address,
          withFeePayer: true,
          data: {
            function: payload.function as `${string}::${string}::${string}`,
            typeArguments: payload.typeArguments as [],
            functionArguments: payload.functionArguments as [],
          },
        })

        // Generate signing message
        const message = generateSigningMessageForTransaction(rawTxn)

        // Sign with Privy wallet
        const { signature: rawSignature } = await signRawHash({
          address: privyWallet.address,
          chainType: 'aptos',
          hash: `0x${toHex(message)}`,
        })

        // Clean public key
        let cleanPublicKey = privyWallet.publicKey.startsWith('0x')
          ? privyWallet.publicKey.slice(2)
          : privyWallet.publicKey

        if (cleanPublicKey.length === 66) {
          cleanPublicKey = cleanPublicKey.slice(2)
        }

        // Create authenticator
        const senderAuthenticator = new AccountAuthenticatorEd25519(
          new Ed25519PublicKey(cleanPublicKey),
          new Ed25519Signature(
            rawSignature.startsWith('0x') ? rawSignature.slice(2) : rawSignature
          )
        )

        return {
          rawTransaction: rawTxn.bcsToHex().toString(),
          senderSignature: senderAuthenticator.bcsToHex().toString(),
        }
      }

      throw new Error('No wallet connected')
    },
    [isNativeConnected, isPrivy, nativeWallet, privyWallet, signRawHash]
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
      signForSponsorship,
      disconnect,
    }),
    [connected, address, isPrivy, signAndSubmitTransaction, signForSponsorship, disconnect]
  )
}
