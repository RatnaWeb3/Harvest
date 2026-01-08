/**
 * Shinami Gas Station Service
 * Wrapper for Shinami SDK with Movement Network configuration
 */

import { GasStationClient } from '@shinami/clients/aptos'

// Shinami API key from environment
const SHINAMI_KEY = process.env.SHINAMI_KEY

// Cache the client instance
let shinamiClient: GasStationClient | null = null

/**
 * Create or return cached Shinami Gas Station client
 * Returns null if API key is not configured
 */
export function createShinamiClient(): GasStationClient | null {
  if (!SHINAMI_KEY) {
    console.warn('[Shinami] SHINAMI_KEY not configured - sponsorship disabled')
    return null
  }

  if (!shinamiClient) {
    shinamiClient = new GasStationClient(SHINAMI_KEY)
    console.log('[Shinami] Gas Station client initialized')
  }

  return shinamiClient
}

/**
 * Check if Shinami sponsorship is available
 */
export function isSponsorshipAvailable(): boolean {
  return Boolean(SHINAMI_KEY)
}

/**
 * Get sponsorship status info
 */
export async function getSponsorshipStatus(): Promise<{
  available: boolean
  balance?: number
  inFlight?: number
}> {
  const client = createShinamiClient()
  if (!client) {
    return { available: false }
  }

  try {
    const fund = await client.getFund()
    return {
      available: true,
      balance: fund.balance,
      inFlight: fund.inFlight,
    }
  } catch {
    return { available: false }
  }
}
