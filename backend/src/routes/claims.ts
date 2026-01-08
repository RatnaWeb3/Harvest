import { Router } from 'express'
import { pool } from '../db'

const router = Router()

// Record a new claim
router.post('/', async (req, res) => {
  try {
    const { address, protocol, txHash, amount, tokenSymbol, valueUsd } = req.body

    // Ensure user exists
    await pool.query(
      `INSERT INTO users (address) VALUES ($1) ON CONFLICT DO NOTHING`,
      [address.toLowerCase()]
    )

    // Insert claim
    const result = await pool.query(
      `INSERT INTO claims (user_address, protocol, tx_hash, amount, token_symbol, value_usd)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [address.toLowerCase(), protocol, txHash, amount, tokenSymbol, valueUsd]
    )

    // Update leaderboard async
    updateLeaderboard(address.toLowerCase()).catch(console.error)

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error recording claim:', error)
    res.status(500).json({ error: 'Failed to record claim' })
  }
})

// Get user's claim history
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { limit = 50, offset = 0 } = req.query

    const result = await pool.query(
      `SELECT * FROM claims WHERE user_address = $1
       ORDER BY claimed_at DESC LIMIT $2 OFFSET $3`,
      [address.toLowerCase(), limit, offset]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching claims:', error)
    res.status(500).json({ error: 'Failed to fetch claims' })
  }
})

async function updateLeaderboard(address: string) {
  const periods = ['daily', 'weekly', 'monthly', 'all-time']

  for (const period of periods) {
    const interval = period === 'daily' ? '1 day'
      : period === 'weekly' ? '7 days'
      : period === 'monthly' ? '30 days'
      : '100 years'

    await pool.query(`
      INSERT INTO leaderboard (user_address, period, total_claimed_usd, claim_count)
      SELECT
        user_address,
        $1 as period,
        COALESCE(SUM(value_usd), 0) as total_claimed_usd,
        COUNT(*) as claim_count
      FROM claims
      WHERE user_address = $2
        AND claimed_at > NOW() - INTERVAL '${interval}'
      GROUP BY user_address
      ON CONFLICT (user_address, period) DO UPDATE SET
        total_claimed_usd = EXCLUDED.total_claimed_usd,
        claim_count = EXCLUDED.claim_count,
        updated_at = NOW()
    `, [period, address])
  }
}

export { router as claimsRouter }
