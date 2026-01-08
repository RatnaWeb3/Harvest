/**
 * Shinami Gas Station Sponsor Routes
 * Handles gasless transaction sponsorship for reward claims
 */

import { Router } from 'express'
import {
  SimpleTransaction,
  AccountAuthenticator,
  Deserializer,
} from '@aptos-labs/ts-sdk'
import { createShinamiClient } from '../services/shinami'

const router = Router()

interface SponsorRequest {
  rawTransaction: string
  senderSignature: string
}

interface SponsorResponse {
  txHash: string
  sponsored: boolean
}

/**
 * POST /api/sponsor
 * Sponsor and submit a signed transaction via Shinami Gas Station
 */
router.post('/', async (req, res) => {
  try {
    const { rawTransaction, senderSignature } = req.body as SponsorRequest

    if (!rawTransaction || !senderSignature) {
      return res.status(400).json({
        error: 'Missing required fields: rawTransaction, senderSignature',
      })
    }

    const shinami = createShinamiClient()
    if (!shinami) {
      return res.status(503).json({
        error: 'Sponsorship service unavailable',
        fallback: true,
      })
    }

    // Deserialize the transaction and authenticator from hex
    const txBytes = Buffer.from(rawTransaction.replace('0x', ''), 'hex')
    const sigBytes = Buffer.from(senderSignature.replace('0x', ''), 'hex')

    const transaction = SimpleTransaction.deserialize(new Deserializer(txBytes))
    const senderAuth = AccountAuthenticator.deserialize(new Deserializer(sigBytes))

    const result = await shinami.sponsorAndSubmitSignedTransaction(
      transaction,
      senderAuth
    )

    console.log('[Sponsor] Transaction sponsored:', result.hash)

    res.json({
      txHash: result.hash,
      sponsored: true,
    } as SponsorResponse)
  } catch (error) {
    console.error('[Sponsor] Error:', error)

    // Check for specific Shinami errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('-32010') || errorMessage.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded, please try again',
        fallback: true,
      })
    }

    if (errorMessage.includes('insufficient') || errorMessage.includes('fund')) {
      return res.status(503).json({
        error: 'Sponsorship fund depleted',
        fallback: true,
      })
    }

    res.status(500).json({
      error: 'Sponsorship failed',
      fallback: true,
      details: errorMessage,
    })
  }
})

/**
 * GET /api/sponsor/status
 * Check sponsorship service status and fund balance
 */
router.get('/status', async (_, res) => {
  try {
    const shinami = createShinamiClient()
    if (!shinami) {
      return res.json({
        available: false,
        reason: 'API key not configured',
      })
    }

    const fund = await shinami.getFund()

    res.json({
      available: true,
      fund: {
        balance: fund.balance,
        inFlight: fund.inFlight,
      },
    })
  } catch (error) {
    console.error('[Sponsor] Status check error:', error)
    res.json({
      available: false,
      reason: 'Service check failed',
    })
  }
})

export { router as sponsorRouter }
