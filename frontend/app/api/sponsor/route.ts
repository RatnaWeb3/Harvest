/**
 * Shinami Gas Station Sponsor API Route
 * Server-side only - SHINAMI_KEY never exposed to client
 */

import { NextRequest, NextResponse } from 'next/server'
import { GasStationClient } from '@shinami/clients/aptos'
import {
  SimpleTransaction,
  AccountAuthenticator,
  Deserializer,
} from '@aptos-labs/ts-sdk'

// Server-side only - not prefixed with NEXT_PUBLIC_
const SHINAMI_KEY = process.env.SHINAMI_KEY

// Cache client instance
let shinamiClient: GasStationClient | null = null

function getClient(): GasStationClient | null {
  if (!SHINAMI_KEY) {
    console.warn('[Sponsor API] SHINAMI_KEY not configured')
    return null
  }

  if (!shinamiClient) {
    shinamiClient = new GasStationClient(SHINAMI_KEY)
    console.log('[Sponsor API] Shinami client initialized')
  }

  return shinamiClient
}

export async function POST(request: NextRequest) {
  try {
    const { rawTransaction, senderSignature } = await request.json()

    if (!rawTransaction || !senderSignature) {
      return NextResponse.json(
        { error: 'Missing required fields: rawTransaction, senderSignature' },
        { status: 400 }
      )
    }

    const shinami = getClient()
    if (!shinami) {
      return NextResponse.json(
        { error: 'Sponsorship service unavailable', fallback: true },
        { status: 503 }
      )
    }

    // Deserialize transaction and authenticator from hex
    const txBytes = Buffer.from(rawTransaction.replace('0x', ''), 'hex')
    const sigBytes = Buffer.from(senderSignature.replace('0x', ''), 'hex')

    const transaction = SimpleTransaction.deserialize(new Deserializer(txBytes))
    const senderAuth = AccountAuthenticator.deserialize(new Deserializer(sigBytes))

    const result = await shinami.sponsorAndSubmitSignedTransaction(
      transaction,
      senderAuth
    )

    console.log('[Sponsor API] Transaction sponsored:', result.hash)

    return NextResponse.json({
      txHash: result.hash,
      sponsored: true,
    })
  } catch (error) {
    console.error('[Sponsor API] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('-32010') || errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', fallback: true },
        { status: 429 }
      )
    }

    if (errorMessage.includes('insufficient') || errorMessage.includes('fund')) {
      return NextResponse.json(
        { error: 'Sponsorship fund depleted', fallback: true },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Sponsorship failed', fallback: true, details: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const shinami = getClient()
    if (!shinami) {
      return NextResponse.json({
        available: false,
        reason: 'API key not configured',
      })
    }

    const fund = await shinami.getFund()

    return NextResponse.json({
      available: true,
      fund: {
        balance: fund.balance,
        inFlight: fund.inFlight,
      },
    })
  } catch (error) {
    console.error('[Sponsor API] Status check error:', error)
    return NextResponse.json({
      available: false,
      reason: 'Service check failed',
    })
  }
}
